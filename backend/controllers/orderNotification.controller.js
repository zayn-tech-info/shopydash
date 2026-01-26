const Notification = require("../models/notification.model");
const Order = require("../models/order.model");
const { sendOrderNotificationEmail } = require("../utils/email");
const { logError, logInfo } = require("../utils/logger");

const processOrderNotifications = async (orderId, io) => {
  try {
    
    const order = await Order.findById(orderId)
      .populate("buyer", "fullName email")
      .populate({
        path: "vendor",
        populate: {
          path: "userId",
          select: "email fullName",
        },
      })
      .populate("items.product", "title image price");

    if (!order) {
      logError("Order Notification", `Order ${orderId} not found`);
      return;
    }

    const { vendor, buyer, items, createdAt, vendorAmount } = order;
    const vendorUserId = vendor.userId._id.toString();
    const vendorEmail = vendor.userId.email;
    const vendorName = vendor.userId.fullName;

    
    const notification = await Notification.create({
      userId: vendorUserId,
      type: "order:new",
      title: "New Order Received! 🚀",
      message: `You have received a new order from ${
        buyer.fullName
      } for ₦${vendorAmount.toLocaleString()}`,
      metadata: {
        orderId: order._id,
        link: "/vendor/dashboard/orders",
      },
      readStatus: false,
    });

    
    if (io) {
      io.to(vendorUserId).emit("order:new", {
        orderId: order._id,
        buyerName: buyer.fullName,
        summary: `${items.length} items - ₦${vendorAmount.toLocaleString()}`,
        timestamp: createdAt,
        notification: notification,
      });
      logInfo(
        "Order Notification",
        `Socket event emitted to vendor ${vendorUserId}`
      );
    } else {
      logError("Order Notification", "Socket.IO instance not provided");
    }

    
    
    sendOrderNotificationEmail(vendorEmail, vendorName, {
      buyerName: buyer.fullName,
      items: items.map((i) => ({
        title: i.title || i.product.title,
        quantity: i.quantity,
        price: i.price,
      })),
      orderId: order._id,
      totalAmount: vendorAmount,
    }).catch((err) => {
      logError("Order Notification", `Email failed: ${err.message}`);
    });

    logInfo(
      "Order Notification",
      `Notifications processed for order ${orderId}`
    );
  } catch (error) {
    logError("Order Notification", `Failed to process: ${error.message}`);
  }
};

module.exports = { processOrderNotifications };
