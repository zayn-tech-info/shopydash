const asyncErrorHandler = require("../../errors/asyncErrorHandle");
const customError = require("../../errors/customError");
const Order = require("../../models/order.model");
const Notification = require("../../models/notification.model");
const logActivity = require("../../utils/activityLogger");

/**
 * GET /api/v1/admin/orders
 * List all orders with pagination and filters
 */
const getOrders = asyncErrorHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    paymentStatus,
    deliveryStatus,
    payoutStatus,
    vendorId,
    startDate,
    endDate,
    sort = "-createdAt",
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const filter = {};

  if (paymentStatus) filter.paymentStatus = paymentStatus;
  if (deliveryStatus) filter.deliveryStatus = deliveryStatus;
  if (payoutStatus) filter.payoutStatus = payoutStatus;
  if (vendorId) filter.vendor = vendorId;

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate("buyer", "fullName email")
      .populate({
        path: "vendor",
        select: "userId",
        populate: { path: "userId", select: "businessName username" },
      })
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Order.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: {
      orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    },
  });
});

/**
 * GET /api/v1/admin/orders/:id
 * Full order detail
 */
const getOrderDetail = asyncErrorHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("buyer", "fullName email phoneNumber")
    .populate({
      path: "vendor",
      select: "userId bankDetails activeStatus",
      populate: { path: "userId", select: "businessName fullName email username" },
    })
    .lean();

  if (!order) {
    throw new customError("Order not found", 404);
  }

  res.status(200).json({
    success: true,
    data: { order },
  });
});

/**
 * PATCH /api/v1/admin/orders/:id/status
 * Update order delivery or payout status
 */
const updateOrderStatus = asyncErrorHandler(async (req, res) => {
  const { deliveryStatus, payoutStatus } = req.body;

  const update = {};
  if (deliveryStatus) update.deliveryStatus = deliveryStatus;
  if (payoutStatus) update.payoutStatus = payoutStatus;

  if (Object.keys(update).length === 0) {
    throw new customError(
      "Provide deliveryStatus or payoutStatus to update",
      400
    );
  }

  const order = await Order.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
  })
    .populate("buyer", "fullName")
    .populate({
      path: "vendor",
      populate: { path: "userId", select: "fullName" },
    });

  if (!order) {
    throw new customError("Order not found", 404);
  }

  // Notify buyer
  await Notification.create({
    userId: order.buyer._id,
    type: "order:status_change",
    title: "Order Updated",
    message: `Your order status has been updated by admin.`,
    metadata: { orderId: order._id },
  });

  await logActivity(
    req.user._id,
    "order_status_updated",
    "order",
    order._id,
    `Updated order: ${JSON.stringify(update)}`,
    req.ip
  );

  res.status(200).json({
    success: true,
    message: "Order status updated",
    data: { order },
  });
});

/**
 * PATCH /api/v1/admin/orders/:id/cancel
 * Cancel an order
 */
const cancelOrder = asyncErrorHandler(async (req, res) => {
  const { reason } = req.body;

  const order = await Order.findById(req.params.id).populate(
    "buyer",
    "fullName"
  );

  if (!order) {
    throw new customError("Order not found", 404);
  }

  if (order.deliveryStatus === "delivered") {
    throw new customError("Cannot cancel a delivered order", 400);
  }

  order.deliveryStatus = "cancelled";
  order.payoutStatus = "cancelled";
  await order.save();

  // Notify buyer
  await Notification.create({
    userId: order.buyer._id,
    type: "order:status_change",
    title: "Order Cancelled",
    message: `Your order has been cancelled by admin. ${reason ? `Reason: ${reason}` : ""}`,
    metadata: { orderId: order._id },
  });

  await logActivity(
    req.user._id,
    "order_cancelled",
    "order",
    order._id,
    `Cancelled order for ${order.buyer.fullName}. Reason: ${reason || "N/A"}`,
    req.ip
  );

  res.status(200).json({
    success: true,
    message: "Order cancelled successfully",
    data: { order },
  });
});

module.exports = {
  getOrders,
  getOrderDetail,
  updateOrderStatus,
  cancelOrder,
};
