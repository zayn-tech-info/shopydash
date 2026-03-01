const asyncErrorHandler = require("../../errors/asyncErrorHandle");
const User = require("../../models/auth.model");
const Order = require("../../models/order.model");
const VendorProfile = require("../../models/vendorProfile.model");
const Subscription = require("../../models/subscription.model");
const Transaction = require("../../models/transaction.model");
const VendorPost = require("../../models/vendorProduct");

/**
 * GET /api/v1/admin/stats
 * Overview dashboard statistics
 * - totalRevenue: sum of order totalAmount (paid orders) = true total sales
 * - totalProducts: total listed product items across all vendor posts
 * - successfulPayments: count of orders with paymentStatus "paid"
 */
const getStats = asyncErrorHandler(async (req, res) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    totalClients,
    totalVendors,
    totalOrders,
    ordersToday,
    pendingOrders,
    revenueAgg,
    successfulPaymentsCount,
    failedPayments,
    activeSubscriptions,
    totalProductsAgg,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "client" }),
    User.countDocuments({ role: "vendor" }),
    Order.countDocuments(),
    Order.countDocuments({ createdAt: { $gte: todayStart } }),
    Order.countDocuments({ deliveryStatus: "pending" }),
    // True total revenue: sum of order totalAmount for paid orders (total sales)
    Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
    Order.countDocuments({ paymentStatus: "paid" }),
    Transaction.countDocuments({ status: "failed" }),
    Subscription.countDocuments({ status: "active" }),
    // Total listed products: sum of products array length across all vendor posts
    VendorPost.aggregate([
      { $project: { count: { $size: { $ifNull: ["$products", []] } } } },
      { $group: { _id: null, total: { $sum: "$count" } } },
    ]),
  ]);

  const totalRevenue =
    revenueAgg.length > 0 ? revenueAgg[0].total : 0;
  const totalProducts =
    totalProductsAgg.length > 0 ? totalProductsAgg[0].total : 0;

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalClients,
      totalVendors,
      totalOrders,
      ordersToday,
      pendingOrders,
      totalRevenue,
      successfulPayments: successfulPaymentsCount,
      failedPayments,
      activeSubscriptions,
      totalProducts,
    },
  });
});

module.exports = { getStats };
