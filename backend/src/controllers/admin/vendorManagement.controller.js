const asyncErrorHandler = require("../../errors/asyncErrorHandle");
const customError = require("../../errors/customError");
const User = require("../../models/auth.model");
const Order = require("../../models/order.model");
const VendorProfile = require("../../models/vendorProfile.model");
const Subscription = require("../../models/subscription.model");
const logActivity = require("../../utils/activityLogger");

/**
 * GET /api/v1/admin/vendors
 * List vendors with pagination, search, and filters
 */
const getVendors = asyncErrorHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    search,
    status,
    kycStatus,
    subscription,
    sort = "-createdAt",
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Build VendorProfile filter
  const vendorFilter = {};
  if (status) vendorFilter.activeStatus = status;
  if (kycStatus) vendorFilter.kycStatus = kycStatus;

  // Build User filter for search
  const userFilter = { role: "vendor" };
  if (subscription) {
    if (subscription === "free") {
      userFilter.isSubscriptionActive = { $ne: true };
    } else {
      userFilter.subscriptionPlan = subscription;
      userFilter.isSubscriptionActive = true;
    }
  }

  if (search) {
    userFilter.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { businessName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  // Get matching user IDs first
  const matchingUsers = await User.find(userFilter).select("_id").lean();
  const userIds = matchingUsers.map((u) => u._id);

  vendorFilter.userId = { $in: userIds };

  const [vendors, total] = await Promise.all([
    VendorProfile.find(vendorFilter)
      .populate("userId", "fullName email businessName subscriptionPlan isSubscriptionActive isBanned createdAt")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    VendorProfile.countDocuments(vendorFilter),
  ]);

  // Attach order stats per vendor
  const vendorIds = vendors.map((v) => v._id);
  const orderStats = await Order.aggregate([
    { $match: { vendor: { $in: vendorIds }, paymentStatus: "paid" } },
    {
      $group: {
        _id: "$vendor",
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: "$vendorAmount" },
      },
    },
  ]);

  const statsMap = {};
  orderStats.forEach((s) => {
    statsMap[s._id.toString()] = s;
  });

  const enrichedVendors = vendors.map((v) => ({
    ...v,
    orderStats: statsMap[v._id.toString()] || {
      totalOrders: 0,
      totalRevenue: 0,
    },
  }));

  res.status(200).json({
    success: true,
    data: {
      vendors: enrichedVendors,
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
 * GET /api/v1/admin/vendors/:id
 * Full vendor detail
 */
const getVendorDetail = asyncErrorHandler(async (req, res) => {
  const vendor = await VendorProfile.findById(req.params.id)
    .populate(
      "userId",
      "fullName email phoneNumber businessName subscriptionPlan subscriptionExpiresAt isSubscriptionActive isVerified isBanned createdAt"
    )
    .lean();

  if (!vendor) {
    throw new customError("Vendor not found", 404);
  }

  // Get recent orders
  const recentOrders = await Order.find({ vendor: vendor._id })
    .populate("buyer", "fullName email")
    .sort("-createdAt")
    .limit(10)
    .lean();

  // Get subscription
  const subscription = vendor.userId
    ? await Subscription.findOne({ user: vendor.userId._id }).lean()
    : null;

  res.status(200).json({
    success: true,
    data: {
      vendor,
      recentOrders,
      subscription,
    },
  });
});

/**
 * PATCH /api/v1/admin/vendors/:id/status
 * Activate or suspend a vendor
 */
const updateVendorStatus = asyncErrorHandler(async (req, res) => {
  const { status, reason } = req.body;

  if (!["active", "suspended"].includes(status)) {
    throw new customError("Status must be 'active' or 'suspended'", 400);
  }

  const vendor = await VendorProfile.findByIdAndUpdate(
    req.params.id,
    { activeStatus: status },
    { new: true, runValidators: true }
  ).populate("userId", "fullName email");

  if (!vendor) {
    throw new customError("Vendor not found", 404);
  }

  const action =
    status === "suspended" ? "vendor_suspended" : "vendor_activated";
  await logActivity(
    req.user._id,
    action,
    "vendor",
    vendor._id,
    `${vendor.userId?.fullName || "Unknown"} — ${reason || "No reason provided"}`,
    req.ip
  );

  res.status(200).json({
    success: true,
    message: `Vendor ${status === "suspended" ? "suspended" : "activated"} successfully`,
    data: { vendor },
  });
});

/**
 * PATCH /api/v1/admin/vendors/:id/kyc
 * Approve or reject KYC
 */
const updateVendorKyc = asyncErrorHandler(async (req, res) => {
  const { kycStatus } = req.body;

  if (!["verified", "failed"].includes(kycStatus)) {
    throw new customError("KYC status must be 'verified' or 'failed'", 400);
  }

  const vendor = await VendorProfile.findByIdAndUpdate(
    req.params.id,
    { kycStatus, ...(kycStatus === "verified" ? { isVerified: true } : {}) },
    { new: true, runValidators: true }
  ).populate("userId", "fullName email");

  if (!vendor) {
    throw new customError("Vendor not found", 404);
  }

  const action =
    kycStatus === "verified" ? "vendor_kyc_approved" : "vendor_kyc_rejected";
  await logActivity(
    req.user._id,
    action,
    "vendor",
    vendor._id,
    `KYC ${kycStatus} for ${vendor.userId?.fullName || "Unknown"}`,
    req.ip
  );

  res.status(200).json({
    success: true,
    message: `Vendor KYC ${kycStatus} successfully`,
    data: { vendor },
  });
});

/**
 * PATCH /api/v1/admin/vendors/:id/subscription
 * Manually activate/change vendor subscription
 */
const updateVendorSubscription = asyncErrorHandler(async (req, res) => {
  const { plan, durationDays = 30 } = req.body;

  const validPlans = ["Shopydash Boost", "Shopydash Pro", "Shopydash Max"];
  if (!validPlans.includes(plan)) {
    throw new customError(
      `Plan must be one of: ${validPlans.join(", ")}`,
      400
    );
  }

  const vendor = await VendorProfile.findById(req.params.id).populate(
    "userId",
    "fullName email"
  );
  if (!vendor) {
    throw new customError("Vendor not found", 404);
  }

  // Update User subscription fields
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + parseInt(durationDays));

  await User.findByIdAndUpdate(vendor.userId._id, {
    subscriptionPlan: plan,
    isSubscriptionActive: true,
    subscriptionExpiresAt: endDate,
  });

  // Upsert Subscription record
  await Subscription.findOneAndUpdate(
    { user: vendor.userId._id },
    {
      plan,
      status: "active",
      amount: 0, // Manual activation
      startDate: new Date(),
      endDate,
    },
    { upsert: true, new: true }
  );

  await logActivity(
    req.user._id,
    "subscription_changed",
    "vendor",
    vendor._id,
    `Manually set ${vendor.userId.fullName} to ${plan} for ${durationDays} days`,
    req.ip
  );

  res.status(200).json({
    success: true,
    message: `Subscription updated to ${plan}`,
  });
});

module.exports = {
  getVendors,
  getVendorDetail,
  updateVendorStatus,
  updateVendorKyc,
  updateVendorSubscription,
};
