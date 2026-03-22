const asyncErrorHandler = require("../../errors/asyncErrorHandle");
const customError = require("../../errors/customError");
const User = require("../../models/auth.model");
const Order = require("../../models/order.model");
const VendorProfile = require("../../models/vendorProfile.model");
const ClientProfile = require("../../models/clientProfile.model");
const logActivity = require("../../utils/activityLogger");

/**
 * GET /api/v1/admin/users
 * List all users with pagination, search, and filters
 */
const getUsers = asyncErrorHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    search,
    role,
    isVerified,
    isBanned,
    startDate,
    endDate,
    sort = "-createdAt",
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const filter = {};

  if (role) filter.role = role;
  if (isVerified !== undefined) filter.isVerified = isVerified === "true";
  if (isBanned !== undefined) filter.isBanned = isBanned === "true";

  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { username: { $regex: search, $options: "i" } },
    ];
  }

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select(
        "fullName username email role isVerified isBanned profilePic createdAt"
      )
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    User.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: {
      users,
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
 * GET /api/v1/admin/users/:id
 * Full user detail
 */
const getUserDetail = asyncErrorHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password -verificationCode -verificationCodeExpires")
    .lean();

  if (!user) {
    throw new customError("User not found", 404);
  }

  // Get related data based on role
  let vendorProfile = null;
  let clientProfile = null;
  let recentOrders = [];

  if (user.role === "vendor") {
    vendorProfile = await VendorProfile.findOne({ userId: user._id }).lean();
  }

  if (user.role === "client") {
    clientProfile = await ClientProfile.findOne({ userId: user._id }).lean();
  }

  recentOrders = await Order.find({ buyer: user._id })
    .sort("-createdAt")
    .limit(10)
    .lean();

  res.status(200).json({
    success: true,
    data: {
      user,
      vendorProfile,
      clientProfile,
      recentOrders,
    },
  });
});

/**
 * PATCH /api/v1/admin/users/:id/ban
 * Ban or unban a user
 */
const toggleBanUser = asyncErrorHandler(async (req, res) => {
  const { ban, reason } = req.body;

  if (typeof ban !== "boolean") {
    throw new customError("'ban' must be a boolean", 400);
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    throw new customError("User not found", 404);
  }

  if (user.role === "admin") {
    throw new customError("Cannot ban an admin user", 400);
  }

  user.isBanned = ban;
  user.banReason = ban ? reason || "Banned by admin" : undefined;
  await user.save({ validateBeforeSave: false });

  const action = ban ? "user_banned" : "user_unbanned";
  await logActivity(
    req.user._id,
    action,
    "user",
    user._id,
    `${user.fullName} (${user.email}) — ${reason || "No reason provided"}`,
    req.ip
  );

  res.status(200).json({
    success: true,
    message: `User ${ban ? "banned" : "unbanned"} successfully`,
  });
});

/**
 * PATCH /api/v1/admin/users/:id/role
 * Change user role
 */
const changeUserRole = asyncErrorHandler(async (req, res) => {
  const { role } = req.body;

  if (!["client", "vendor", "admin"].includes(role)) {
    throw new customError("Role must be 'client', 'vendor', or 'admin'", 400);
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    throw new customError("User not found", 404);
  }

  const oldRole = user.role;
  user.role = role;
  await user.save({ validateBeforeSave: false });

  await logActivity(
    req.user._id,
    "user_role_changed",
    "user",
    user._id,
    `${user.fullName}: ${oldRole} → ${role}`,
    req.ip
  );

  res.status(200).json({
    success: true,
    message: `User role changed to ${role}`,
  });
});

module.exports = {
  getUsers,
  getUserDetail,
  toggleBanUser,
  changeUserRole,
};
