const asyncErrorHandler = require("../../errors/asyncErrorHandle");
const customError = require("../../errors/customError");
const vendorProfileModel = require("../../models/vendorProfile.model");
const User = require("../../models/auth.model");
const Subscription = require("../../models/subscription.model");
const PLANS = require("../../config/subscriptionPlans");

const createVendorProfile = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user && req.user._id;
  if (!userId) {
    const err = new customError("Unauthorized", 401);
    return next(err);
  }

  const existingVendorProfile = await vendorProfileModel
    .findOne({ userId })
    .select("_id")
    .lean();

  if (existingVendorProfile) {
    const err = new customError("Vendor profile already exists", 409);
    return next(err);
  }

  const {
    businessName,
    email,
    phoneNumber,
    whatsAppNumber,
    schoolName,
    profileImage,
    ...allowedData
  } = req.body;
  const payload = { ...allowedData, userId };

  try {
    const vendorProfile = await vendorProfileModel.create(payload);

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: { vendorProfile },
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const err = new customError(
        `This ${field} is already associated with another vendor profile.`,
        409
      );
      return next(err);
    }
    return next(error);
  }
});

const getPublicVendorProfile = asyncErrorHandler(async (req, res, next) => {
  const storeUsername = req.params.storeUsername;

  if (!storeUsername) {
    const error = new customError("Store username is required", 400);
    return next(error);
  }

  const vendorProfile = await vendorProfileModel
    .findOne({
      storeUsername: storeUsername,
    })
    .populate(
      "userId",
      "businessName email phoneNumber whatsAppNumber schoolName logo isVerified profilePic subscriptionPlan city state country schoolArea area"
    );

  if (!vendorProfile) {
    const error = new customError("Vendor profile not found", 404);
    return next(error);
  }

  const subscription = await Subscription.findOne({
    user: vendorProfile.userId._id,
    status: "active",
    endDate: { $gt: new Date() },
  });

  let badges = {
    isBoosted: false,
    isVerified: false,
  };

  let vendorProfileObj = vendorProfile.toObject();

  if (subscription) {
    if (vendorProfileObj.userId) {
      vendorProfileObj.userId.subscriptionPlan = subscription.plan;
    }
    const planConfig = Object.values(PLANS).find(
      (p) => p.name === subscription.plan
    );
    if (planConfig) {
      if (planConfig.features.boostedBadge) badges.isBoosted = true;
      if (planConfig.features.verifiedBadge) badges.isVerified = true;
    }
  }

  res.status(200).json({
    success: true,
    data: {
      vendorProfile: {
        ...vendorProfileObj,
        ...badges,
      },
    },
  });
});

const getAllVendorsProfile = asyncErrorHandler(async (req, res, next) => {
  const vendors = await User.aggregate([
    { $match: { role: "vendor" } },
    {
      $project: {
        username: 1,
        profilePic: 1,
        businessName: 1,
        whatsAppNumber: 1,
        subscriptionPlan: 1,
        isVerified: 1,
      },
    },

    // Lookup vendor profile for rating
    {
      $lookup: {
        from: "vendorprofiles",
        localField: "_id",
        foreignField: "userId",
        as: "vendorProfile",
      },
    },
    {
      $addFields: {
        rating: {
          $ifNull: [{ $arrayElemAt: ["$vendorProfile.rating", 0] }, 0],
        },
      },
    },

    {
      $lookup: {
        from: "subscriptions",
        let: { userId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$user", "$$userId"] },
                  { $eq: ["$status", "active"] },
                  { $gt: ["$endDate", new Date()] },
                ],
              },
            },
          },
        ],
        as: "subscription",
      },
    },
    {
      $addFields: {
        subscription: { $arrayElemAt: ["$subscription", 0] },
      },
    },

    {
      $addFields: {
        isBoosted: {
          $cond: {
            if: {
              $or: [
                { $eq: ["$subscription.plan", "Shopydash Boost"] },
                { $eq: ["$subscription.plan", "Shopydash Pro"] },
                { $eq: ["$subscription.plan", "Shopydash Max"] },
              ],
            },
            then: true,
            else: false,
          },
        },
        isVerified: {
          $cond: {
            if: { $eq: ["$subscription.plan", "Shopydash Max"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        subscription: 0,
        vendorProfile: 0,
      },
    },
  ]);

  if (!vendors || vendors.length === 0) {
    const error = new customError("No vendor found", 404);
    return next(error);
  }

  res.status(200).json({
    success: true,
    count: vendors.length,
    data: {
      vendors,
    },
  });
});

const updateVendorProfile = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user && req.user._id;
  if (!userId) {
    const err = new customError("Unauthorized", 401);
    return next(err);
  }

  const {
    businessName,
    phoneNumber,
    storeDescription,
    businessCategory,
    accountNumber,
    paymentMethods,
    instagram,
    facebook,
    twitter,
    storeUsername,
    sellingDuration,
    offersDelivery,
  } = req.body;

  if (businessName || phoneNumber) {
    const userUpdates = {};
    if (businessName) userUpdates.businessName = businessName;
    if (phoneNumber) userUpdates.phoneNumber = phoneNumber;

    await User.findByIdAndUpdate(userId, userUpdates, {
      new: true,
      runValidators: true,
    });
  }

  const updates = {
    storeDescription,
    businessCategory,
    sellingDuration,
    offersDelivery,
    accountNumber,
    paymentMethods,
    socialLinks: {
      instagram,
      facebook,
      twitter,
    },
    storeUsername,
  };

  const updated = await vendorProfileModel.findOneAndUpdate(
    { userId },
    { $set: updates },
    { new: true, runValidators: true, upsert: false }
  );

  if (!updated) {
    const err = new customError("Vendor profile not found", 404);
    return next(err);
  }

  res.status(200).json({
    status: "success",
    data: {
      vendorProfile: updated,
    },
  });
});

const getVendorProfileByUserId = asyncErrorHandler(async (req, res, next) => {
  const userId = req.params.userId;
  const vendorProfile = await vendorProfileModel.findOne({ userId });

  if (!vendorProfile) {
    const error = new customError("Vendor profile not found", 404);
    return next(error);
  }

  res.status(200).json({
    success: true,
    data: vendorProfile,
  });
});

module.exports = {
  createVendorProfile,
  getPublicVendorProfile,
  updateVendorProfile,
  getAllVendorsProfile,
  getVendorProfileByUserId,
};
