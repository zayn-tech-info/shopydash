const asyncErrorHandler = require("../../errors/asyncErrorHandle");
const ActivityLog = require("../../models/activityLog.model");

/**
 * GET /api/v1/admin/activity-logs
 * Paginated activity logs with filters
 */
const getActivityLogs = asyncErrorHandler(async (req, res) => {
  const {
    page = 1,
    limit = 30,
    action,
    startDate,
    endDate,
    sort = "-createdAt",
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const filter = {};

  if (action) filter.action = action;

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const [logs, total] = await Promise.all([
    ActivityLog.find(filter)
      .populate("actor", "fullName email")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    ActivityLog.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: {
      logs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    },
  });
});

module.exports = { getActivityLogs };
