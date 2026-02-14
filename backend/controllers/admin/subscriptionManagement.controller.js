const asyncErrorHandler = require("../../errors/asyncErrorHandle");
const customError = require("../../errors/customError");
const Subscription = require("../../models/subscription.model");
const User = require("../../models/auth.model");
const logActivity = require("../../utils/activityLogger");

/**
 * GET /api/v1/admin/subscriptions
 * List all subscriptions with pagination and filters
 */
const getSubscriptions = asyncErrorHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    plan,
    status,
    sort = "-createdAt",
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const filter = {};

  if (plan) filter.plan = plan;
  if (status) filter.status = status;

  const [subscriptions, total] = await Promise.all([
    Subscription.find(filter)
      .populate("user", "fullName email businessName profilePic")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Subscription.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: {
      subscriptions,
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
 * GET /api/v1/admin/subscriptions/stats
 * Subscription summary statistics
 */
const getSubscriptionStats = asyncErrorHandler(async (req, res) => {
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

  const [planDistribution, revenueByPlan, expiringSoon, totalActive] =
    await Promise.all([
      Subscription.aggregate([
        { $match: { status: "active" } },
        { $group: { _id: "$plan", count: { $sum: 1 } } },
      ]),
      Subscription.aggregate([
        { $match: { status: "active" } },
        { $group: { _id: "$plan", revenue: { $sum: "$amount" } } },
      ]),
      Subscription.countDocuments({
        status: "active",
        endDate: { $lte: sevenDaysFromNow, $gte: new Date() },
      }),
      Subscription.countDocuments({ status: "active" }),
    ]);

  res.status(200).json({
    success: true,
    data: {
      totalActive,
      expiringSoon,
      planDistribution,
      revenueByPlan,
    },
  });
});

/**
 * PATCH /api/v1/admin/subscriptions/:id/activate
 * Manually activate a subscription
 */
const activateSubscription = asyncErrorHandler(async (req, res) => {
  const { plan, durationDays = 30 } = req.body;

  const subscription = await Subscription.findById(req.params.id).populate(
    "user",
    "fullName email"
  );
  if (!subscription) {
    throw new customError("Subscription not found", 404);
  }

  const endDate = new Date();
  endDate.setDate(endDate.getDate() + parseInt(durationDays));

  subscription.status = "active";
  subscription.startDate = new Date();
  subscription.endDate = endDate;
  if (plan) subscription.plan = plan;
  await subscription.save();

  // Update user
  await User.findByIdAndUpdate(subscription.user._id, {
    subscriptionPlan: subscription.plan,
    isSubscriptionActive: true,
    subscriptionExpiresAt: endDate,
  });

  await logActivity(
    req.user._id,
    "subscription_activated",
    "subscription",
    subscription._id,
    `Activated ${subscription.plan} for ${subscription.user.fullName} (${durationDays} days)`,
    req.ip
  );

  res.status(200).json({
    success: true,
    message: "Subscription activated",
    data: { subscription },
  });
});

/**
 * PATCH /api/v1/admin/subscriptions/:id/cancel
 * Cancel a subscription
 */
const cancelSubscription = asyncErrorHandler(async (req, res) => {
  const subscription = await Subscription.findById(req.params.id).populate(
    "user",
    "fullName email"
  );
  if (!subscription) {
    throw new customError("Subscription not found", 404);
  }

  subscription.status = "cancelled";
  await subscription.save();

  // Update user
  await User.findByIdAndUpdate(subscription.user._id, {
    isSubscriptionActive: false,
    subscriptionPlan: null,
    subscriptionExpiresAt: null,
  });

  await logActivity(
    req.user._id,
    "subscription_cancelled",
    "subscription",
    subscription._id,
    `Cancelled subscription for ${subscription.user.fullName}`,
    req.ip
  );

  res.status(200).json({
    success: true,
    message: "Subscription cancelled",
  });
});

module.exports = {
  getSubscriptions,
  getSubscriptionStats,
  activateSubscription,
  cancelSubscription,
};
