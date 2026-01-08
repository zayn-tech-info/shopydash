const crypto = require("crypto");
const https = require("https");
const Transaction = require("../models/transaction.model");
const Subscription = require("../models/subscription.model");
const plans = require("../config/subscriptionPlans");
const User = require("../models/auth.model");
const VendorProfile = require("../models/vendorProfile.model");
const Order = require("../models/order.model");
const VendorPost = require("../models/vendorProduct");
const { logError } = require("../utils/logger");
const { processOrderNotifications } = require("./orderNotification.controller");

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_LIVE_SECRET_KEY;

const paystackRequest = (endpoint, method, body = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.paystack.co",
      port: 443,
      path: endpoint,
      method: method,
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          const parsedData = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsedData);
          } else {
            reject(
              new Error(
                parsedData.message ||
                  `Request failed with status ${res.statusCode}`
              )
            );
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on("error", (e) => {
      reject(e);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

const initializePayment = async (req, res) => {
  try {
    const { planSlug } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const planKey = Object.keys(plans).find(
      (key) => plans[key].slug === planSlug
    );
    const plan = plans[planKey];

    if (!plan) {
      return res.status(400).json({ message: "Invalid plan selected" });
    }

    const amountInKobo = plan.price * 100;

    const baseUrl =
      req.headers.origin || process.env.CLIENT_URL || "http://localhost:5173";
    const callbackUrl = `${baseUrl}/pricing`;

    const paystackResponse = await paystackRequest(
      "/transaction/initialize",
      "POST",
      {
        email: user.email,
        amount: amountInKobo,
        currency: "NGN",
        callback_url: callbackUrl,
        metadata: {
          userId: userId,
          planKey: planKey,
          planName: plan.name,
        },
      }
    );

    if (!paystackResponse.status) {
      return res
        .status(400)
        .json({ message: "Payment initialization failed at Gateway" });
    }

    await Transaction.create({
      user: userId,
      reference: paystackResponse.data.reference,
      amount: plan.price,
      currency: "NGN",
      status: "pending",
      plan: plan.name,
    });

    res.status(200).json({
      success: true,
      authorization_url: paystackResponse.data.authorization_url,
      access_code: paystackResponse.data.access_code,
      reference: paystackResponse.data.reference,
    });
  } catch (error) {
    logError("Payment Initialization", error);
    res.status(500).json({
      message: "Could not initialize payment",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
};

const createSubaccount = async (req, res) => {
  try {
    const {
      business_name,
      settlement_bank,
      account_number,
      percentage_charge,
    } = req.body;
    const userId = req.user.id;

    const vendor = await VendorProfile.findOne({ userId });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor profile not found" });
    }

    // 1. Server-Side Identity Verification (The "Shadow KYC")
    // We resolve the account number again to ensure the name matches the legal bank owner.
    // This prevents frontend manipulation and ensures we only onboard the REAL bank account owner.
    let resolvedAccountName;
    try {
      const resolveResponse = await paystackRequest(
        `/bank/resolve?account_number=${account_number}&bank_code=${settlement_bank}`,
        "GET"
      );
      if (!resolveResponse.status || !resolveResponse.data) {
        throw new Error("Could not verify account identity");
      }
      resolvedAccountName = resolveResponse.data.account_name;
    } catch (err) {
      return res.status(400).json({
        message:
          "Identity Verification Failed: Could not resolve bank account details. Please ensure account number and bank are correct.",
      });
    }

    // 2. Create Paystack Subaccount using the VERIFIED IDENTITY
    // We strictly use the 'resolvedAccountName' as the 'business_name'.
    // This guarantees that the subaccount is created for the Legal Identity attached to the BVN.
    const paystackResponse = await paystackRequest("/subaccount", "POST", {
      business_name: resolvedAccountName, // FORCE the legal bank name
      settlement_bank,
      account_number,
      percentage_charge: 5,
    });

    if (!paystackResponse.status) {
      return res
        .status(400)
        .json({ message: "Failed to create subaccount on Paystack" });
    }

    vendor.bankDetails = {
      bankName: paystackResponse.data.settlement_bank,
      bankCode: settlement_bank,
      accountNumber: account_number,
      accountName: paystackResponse.data.business_name,
      subaccountCode: paystackResponse.data.subaccount_code,
    };

    // Determine KYC status based on Paystack response
    // For specific subaccount types, active=true usually means verified
    if (paystackResponse.data.active) {
      vendor.kycStatus = "verified";
    } else {
      vendor.kycStatus = "pending";
    }

    await vendor.save();

    res.status(200).json({
      success: true,
      message: "Subaccount created successfully",
      data: vendor.bankDetails,
    });
  } catch (error) {
    logError("Subaccount Creation", error);
    res.status(500).json({
      message: "Internal Server Error",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
};

const initializeOrderPayment = async (req, res) => {
  try {
    const { cartItems, deliveryAddress } = req.body;
    const userId = req.user.id;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "No items in checkout" });
    }

    let totalAmountInKobo = 0;
    const itemsByVendor = {};

    for (const item of cartItems) {
      const post = await VendorPost.findOne({ "products._id": item.productId });
      if (!post) continue;

      const product = post.products.id(item.productId);
      if (!product) continue;

      const vendorId = post.vendorId.toString();

      if (!itemsByVendor[vendorId]) {
        itemsByVendor[vendorId] = [];
      }

      itemsByVendor[vendorId].push({
        product: item.productId,
        title: product.title,
        image: product.image,
        quantity: item.quantity,
        price: product.price,
      });

      totalAmountInKobo += product.price * item.quantity * 100;
    }

    if (!totalAmountInKobo || totalAmountInKobo === 0) {
      return res.status(400).json({
        message: "Invalid cart total",
      });
    }

    const checkoutReference = `CHK_REF_${nanoid(10)}`;

    const orderIds = [];

    for (const [vId, items] of Object.entries(itemsByVendor)) {
      const vendorProfile = await VendorProfile.findOne({ userId: vId });

      if (!vendorProfile) {
        throw new Error(`Vendor profile not found for vendor ID: ${vId}`);
      }

      const vendorTotal = items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );
      const platformFee = vendorTotal * 0.05;
      const vendorAmount = vendorTotal - platformFee;

      const newOrder = await Order.create({
        buyer: userId,
        vendor: vendorProfile._id,
        items: items,
        totalAmount: vendorTotal,
        platformFee: platformFee,
        vendorAmount: vendorAmount,
        paymentStatus: "pending",
        deliveryStatus: "pending",
        payoutStatus: "held",
        transactionReference: checkoutReference,
        deliveryAddress: deliveryAddress,
      });
      orderIds.push(newOrder._id);
    }

    const baseUrl =
      req.headers.origin || process.env.CLIENT_URL || "http://localhost:5173";
    const callbackUrl = `${baseUrl}/order/confirmation`;

    const paystackResponse = await paystackRequest(
      "/transaction/initialize",
      "POST",
      {
        email: req.user.email,
        amount: totalAmountInKobo,
        reference: checkoutReference,
        callback_url: callbackUrl,
        metadata: {
          type: "cart_purchase",
          userId,
          orderIds: orderIds,
          custom_fields: [
            { display_name: "Items Count", value: cartItems.length },
            { display_name: "Order Ref", value: checkoutReference },
          ],
        },
      }
    );

    if (!paystackResponse.status) {
      return res.status(400).json({
        message: "Payment initialization failed",
      });
    }

    res.status(200).json({
      success: true,
      authorization_url: paystackResponse.data.authorization_url,
      reference: checkoutReference,
    });
  } catch (error) {
    logError("Order Payment Initialization", error);
    res.status(500).json({
      message: "Could not initialize order",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
};

const webhook = async (req, res) => {
  try {
    const secret = PAYSTACK_SECRET_KEY;
    const hash = crypto
      .createHmac("sha512", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      return res.status(401).send("Invalid signature");
    }

    const event = req.body;

    if (event.event === "charge.success") {
      const { reference, metadata, amount, gateway_response, paid_at } =
        event.data;

      if (
        metadata &&
        (metadata.type === "product_purchase" ||
          metadata.type === "cart_purchase")
      ) {
        await handleOrderSuccess(event.data, req.app.get("io"));
      } else {
        await handleSubscriptionSuccess(event.data);
      }
    }

    res.status(200).send("Webhook received");
  } catch (error) {
    logError("Webhook Processing", error);
    res.status(500).send("Webhook error");
  }
};

const handleSubscriptionSuccess = async (data) => {
  const { reference, metadata, amount, gateway_response, paid_at } = data;
  const userId = metadata ? metadata.userId : null;
  const planKey = metadata ? metadata.planKey : null;

  if (!userId || !planKey) return;

  const transaction = await Transaction.findOne({ reference });
  if (transaction) {
    transaction.status = "success";
    transaction.gatewayResponse = gateway_response;
    transaction.paidAt = new Date(paid_at);
    await transaction.save();
  } else {
    await Transaction.create({
      user: userId,
      reference: reference,
      amount: amount / 100,
      status: "success",
      plan: plans[planKey].name,
      gatewayResponse: gateway_response,
      paidAt: new Date(paid_at),
    });
  }

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 30);

  await Subscription.findOneAndUpdate(
    { user: userId },
    {
      plan: plans[planKey].name,
      status: "active",
      startDate: startDate,
      endDate: endDate,
      amount: amount / 100,
      paystackReference: reference,
    },
    { upsert: true, new: true }
  );

  await User.findByIdAndUpdate(userId, {
    subscriptionPlan: plans[planKey].name,
    isSubscriptionActive: true,
    subscriptionExpiresAt: endDate,
  });
};

const handleOrderSuccess = async (data, io) => {
  const { reference, metadata, amount } = data;

  if (metadata.type === "cart_purchase") {
    const orderIds = metadata.orderIds;
    if (orderIds && orderIds.length > 0) {
      // Find orders that are not yet paid to avoid duplicate notifications
      const ordersToUpdate = await Order.find({
        _id: { $in: orderIds },
        paymentStatus: { $ne: "paid" },
      });

      if (ordersToUpdate.length > 0) {
        await Order.updateMany(
          { _id: { $in: ordersToUpdate.map((o) => o._id) } },
          { paymentStatus: "paid", payoutStatus: "held" }
        );

        // Trigger notifications for each updated order
        for (const order of ordersToUpdate) {
          await processOrderNotifications(order._id, io);
        }
      }
    }
    return;
  }
};

function nanoid(length) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.query;
    if (!reference) {
      return res
        .status(400)
        .json({ message: "Transaction reference is required" });
    }

    let transaction = await Transaction.findOne({ reference });
    let isOrder = false;

    if (!transaction) {
      const orderExists = await Order.exists({
        transactionReference: reference,
      });
      if (orderExists) {
        isOrder = true;
      }
    }

    if (!transaction && !isOrder) {
      return res
        .status(404)
        .json({ message: "Transaction reference not found" });
    }

    const paystackResponse = await paystackRequest(
      `/transaction/verify/${reference}`,
      "GET"
    );

    if (paystackResponse.status && paystackResponse.data.status === "success") {
      if (isOrder) {
        const ordersToUpdate = await Order.find({
          transactionReference: reference,
          paymentStatus: { $ne: "paid" },
        });

        if (ordersToUpdate.length > 0) {
          await Order.updateMany(
            { _id: { $in: ordersToUpdate.map((o) => o._id) } },
            { paymentStatus: "paid", payoutStatus: "held" }
          );

          const io = req.app.get("io");
          for (const order of ordersToUpdate) {
            await processOrderNotifications(order._id, io);
          }
        }
        return res.status(200).json({
          success: true,
          message: "Order verified successfully",
        });
      }

      const { metadata, amount, gateway_response, paid_at, plan } =
        paystackResponse.data;

      transaction.status = "success";
      transaction.gatewayResponse = gateway_response;
      transaction.paidAt = new Date(paid_at);
      await transaction.save();

      const planNameFromPaystack = metadata?.planName;
      let planKey = metadata?.planKey;

      if (!planKey && planNameFromPaystack) {
        planKey = Object.keys(plans).find(
          (key) => plans[key].name === planNameFromPaystack
        );
      }

      const planDetails = plans[planKey];

      if (planDetails) {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);

        await Subscription.findOneAndUpdate(
          { user: transaction.user },
          {
            plan: planDetails.name,
            status: "active",
            startDate: startDate,
            endDate: endDate,
            amount: amount / 100,
            paystackReference: reference,
          },
          { upsert: true, new: true }
        );

        await User.findByIdAndUpdate(transaction.user, {
          subscriptionPlan: planDetails.name,
          isSubscriptionActive: true,
          subscriptionExpiresAt: endDate,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Payment verified and profile updated",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed or pending",
      });
    }
  } catch (error) {
    logError("Payment Verification", error);
    res.status(500).json({
      message: "Could not verify payment",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
};

const getBanks = async (req, res) => {
  try {
    const response = await paystackRequest("/bank?country=nigeria", "GET");
    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    logError("Get Banks", error);
    res.status(500).json({
      message: "Could not fetch banks",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
};

const resolveAccountNumber = async (req, res) => {
  try {
    const { account_number, bank_code } = req.query;
    if (!account_number || !bank_code) {
      return res
        .status(400)
        .json({ message: "Account number and bank code required" });
    }

    const response = await paystackRequest(
      `/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
      "GET"
    );

    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    logError("Resolve Account Number", error);
    res.status(400).json({
      message: "Could not resolve account",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
};

module.exports = {
  initializePayment,
  webhook,
  verifyPayment,
  createSubaccount,
  initializeOrderPayment,
  getBanks,
  resolveAccountNumber,
};
