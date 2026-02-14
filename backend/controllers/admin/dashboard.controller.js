const asyncErrorHandler = require("../../errors/asyncErrorHandle");
const User = require("../../models/auth.model");
const Order = require("../../models/order.model");
const VendorProfile = require("../../models/vendorProfile.model");
const Subscription = require("../../models/subscription.model");
const Transaction = require("../../models/transaction.model");

/**
 * GET /api/v1/admin/stats
 * Overview dashboard statistics
 */
const getStats = asyncErrorHandler(async (req, res) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    totalVendors,
    totalOrders,
    ordersToday,
    pendingOrders,
    revenueAgg,
    failedPayments,
    activeSubscriptions,
  ] = await Promise.all([
    User.countDocuments({ role: "client" }),
    User.countDocuments({ role: "vendor" }),
    Order.countDocuments(),
    Order.countDocuments({ createdAt: { $gte: todayStart } }),
    Order.countDocuments({ deliveryStatus: "pending" }),
    Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$platformFee" } } },
    ]),
    Transaction.countDocuments({ status: "failed" }),
    Subscription.countDocuments({ status: "active" }),
  ]);

  const totalRevenue =
    revenueAgg.length > 0 ? revenueAgg[0].total : 0;

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalVendors,
      totalOrders,
      ordersToday,
      pendingOrders,
      totalRevenue,
      failedPayments,
      activeSubscriptions,
    },
  });
});

module.exports = { getStats };
