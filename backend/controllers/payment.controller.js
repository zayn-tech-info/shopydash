const crypto = require("crypto");
const https = require("https");
const Transaction = require("../models/transaction.model");
const Subscription = require("../models/subscription.model");
const plans = require("../config/subscriptionPlans");
const User = require("../models/auth.model");

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_TEST_SECRET_KEY;

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
    console.error("Payment Init Error:", error);
    res.status(500).json({
      message: "Could not initialize payment",
      error: error.message,
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
      const { reference, metadata, amount, status, gateway_response, paid_at } =
        event.data;

      const userId = metadata ? metadata.userId : null;
      const planKey = metadata ? metadata.planKey : null;

      if (!userId || !planKey) {
        return res.status(200).send("Metadata missing, cannot process");
      }

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
    }

    res.status(200).send("Webhook received");
  } catch (error) {
    console.error("Webhook Error:", error);
    res.status(500).send("Webhook error");
  }
};

module.exports = {
  initializePayment,
  webhook,
};
