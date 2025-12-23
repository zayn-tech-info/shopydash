const Order = require("../models/order.model");
const VendorProfile = require("../models/vendorProfile.model");
const { paystackRequest } = require("./payment.controller");

const markOrderDelivered = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.buyer.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Only the buyer can confirm delivery" });
    }

    if (order.deliveryStatus === "delivered") {
      return res.status(400).json({ message: "Order already delivered" });
    }

    order.deliveryStatus = "delivered";
    order.payoutStatus = "released";

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order marked as delivered. Funds released to vendor.",
      data: order,
    });
  } catch (error) {
    console.error("Mark Delivered Error:", error);
    res
      .status(500)
      .json({ message: "Could not update order", error: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { role } = req.query;

    let query = {};
    if (role === "vendor") {
      const vendor = await VendorProfile.findOne({ userId });
      if (!vendor) return res.status(200).json({ data: [] });
      query = { vendor: vendor._id };
    } else {
      query = { buyer: userId };
    }

    const orders = await Order.find(query)
      .populate("items.product", "title image price")
      .populate({
        path: "vendor",
        select: "storeUsername userId",
        populate: {
          path: "userId",
          select: "businessName fullName email",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Get Orders Error:", error);
    res
      .status(500)
      .json({ message: "Could not fetch orders", error: error.message });
  }
};

module.exports = {
  markOrderDelivered,
  getMyOrders,
};
