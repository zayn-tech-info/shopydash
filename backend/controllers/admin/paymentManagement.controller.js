const asyncErrorHandler = require("../../errors/asyncErrorHandle");
const Transaction = require("../../models/transaction.model");
const Order = require("../../models/order.model");

/**
 * GET /api/v1/admin/transactions
 * List all transactions with pagination and filters
 */
const getTransactions = asyncErrorHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    startDate,
    endDate,
    sort = "-createdAt",
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const filter = {};

  if (status) filter.status = status;

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const [transactions, total] = await Promise.all([
    Transaction.find(filter)
      .populate("user", "fullName email")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Transaction.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: {
      transactions,
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
 * GET /api/v1/admin/transactions/stats
 * Transaction and revenue summary
 */
const getTransactionStats = asyncErrorHandler(async (req, res) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [
    totalTransactions,
    successCount,
    failedCount,
    totalRevenueAgg,
    todayRevenueAgg,
    commissionAgg,
  ] = await Promise.all([
    Transaction.countDocuments(),
    Transaction.countDocuments({ status: "success" }),
    Transaction.countDocuments({ status: "failed" }),
    Transaction.aggregate([
      { $match: { status: "success" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Transaction.aggregate([
      { $match: { status: "success", paidAt: { $gte: todayStart } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$platformFee" } } },
    ]),
  ]);

  const totalRevenue =
    totalRevenueAgg.length > 0 ? totalRevenueAgg[0].total : 0;
  const todayRevenue =
    todayRevenueAgg.length > 0 ? todayRevenueAgg[0].total : 0;
  const totalCommission =
    commissionAgg.length > 0 ? commissionAgg[0].total : 0;
  const successRate =
    totalTransactions > 0
      ? ((successCount / totalTransactions) * 100).toFixed(1)
      : 0;

  res.status(200).json({
    success: true,
    data: {
      totalTransactions,
      successCount,
      failedCount,
      totalRevenue,
      todayRevenue,
      totalCommission,
      successRate: parseFloat(successRate),
    },
  });
});

/**
 * GET /api/v1/admin/transactions/:id
 * Single transaction detail
 */
const getTransactionDetail = asyncErrorHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id)
    .populate("user", "fullName email")
    .lean();

  if (!transaction) {
    const customError = require("../../errors/customError");
    throw new customError("Transaction not found", 404);
  }

  res.status(200).json({
    success: true,
    data: { transaction },
  });
});

module.exports = {
  getTransactions,
  getTransactionStats,
  getTransactionDetail,
};
