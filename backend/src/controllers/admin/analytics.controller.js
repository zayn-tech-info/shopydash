const asyncErrorHandler = require("../../errors/asyncErrorHandle");
const User = require("../../models/auth.model");
const Order = require("../../models/order.model");
const VendorProfile = require("../../models/vendorProfile.model");

/**
 * GET /api/v1/admin/analytics/signups
 * Daily signups for last N days
 */
const getSignupAnalytics = asyncErrorHandler(async (req, res) => {
  const { days = 30 } = req.query;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(days));
  startDate.setHours(0, 0, 0, 0);

  const signups = await User.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          role: "$role",
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.date": 1 } },
  ]);

  // Transform to { date, clients, vendors } format
  const dateMap = {};
  signups.forEach((s) => {
    if (!dateMap[s._id.date]) {
      dateMap[s._id.date] = { date: s._id.date, clients: 0, vendors: 0 };
    }
    if (s._id.role === "client") dateMap[s._id.date].clients = s.count;
    if (s._id.role === "vendor") dateMap[s._id.date].vendors = s.count;
  });

  res.status(200).json({
    success: true,
    data: Object.values(dateMap),
  });
});

/**
 * GET /api/v1/admin/analytics/orders
 * Daily order count and revenue for last N days
 */
const getOrderAnalytics = asyncErrorHandler(async (req, res) => {
  const { days = 30 } = req.query;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(days));
  startDate.setHours(0, 0, 0, 0);

  const analytics = await Order.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        orders: { $sum: 1 },
        revenue: { $sum: "$totalAmount" },
        commission: { $sum: "$platformFee" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const data = analytics.map((a) => ({
    date: a._id,
    orders: a.orders,
    revenue: a.revenue,
    commission: a.commission,
  }));

  res.status(200).json({
    success: true,
    data,
  });
});

/**
 * GET /api/v1/admin/analytics/top-vendors
 * Top N vendors by revenue
 */
const getTopVendors = asyncErrorHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const topVendors = await Order.aggregate([
    { $match: { paymentStatus: "paid" } },
    {
      $group: {
        _id: "$vendor",
        totalRevenue: { $sum: "$vendorAmount" },
        totalOrders: { $sum: 1 },
      },
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: parseInt(limit) },
    {
      $lookup: {
        from: "vendorprofiles",
        localField: "_id",
        foreignField: "_id",
        as: "profile",
      },
    },
    { $unwind: { path: "$profile", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "profile.userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        totalRevenue: 1,
        totalOrders: 1,
        storeName: "$user.username",
        businessName: "$user.businessName",
        fullName: "$user.fullName",
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: topVendors,
  });
});

/**
 * GET /api/v1/admin/analytics/revenue
 * Daily platform revenue (commission) for last N days
 */
const getRevenueAnalytics = asyncErrorHandler(async (req, res) => {
  const { days = 30 } = req.query;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(days));
  startDate.setHours(0, 0, 0, 0);

  const revenue = await Order.aggregate([
    { $match: { paymentStatus: "paid", createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        commission: { $sum: "$platformFee" },
        totalSales: { $sum: "$totalAmount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const data = revenue.map((r) => ({
    date: r._id,
    commission: r.commission,
    totalSales: r.totalSales,
  }));

  res.status(200).json({
    success: true,
    data,
  });
});

module.exports = {
  getSignupAnalytics,
  getOrderAnalytics,
  getTopVendors,
  getRevenueAnalytics,
};
