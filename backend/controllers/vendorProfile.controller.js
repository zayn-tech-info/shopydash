const asyncErrorHandler = require("../errors/asyncErrorHandle");
const customError = require("../errors/customError");
const vendorProfileModel = require("../models/vendorProfile.model");

const createVendorProfile = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user && req.user._id;
  if (!userId) {
    const err = new customError("Unauthorized", 401);
    return next(err);
  }

  const existingVendorProfile = await vendorProfileModel.findOne({ userId });

  if (existingVendorProfile) {
    const err = new customError("Vendor profile already exists", 409);
    return next(err);
  }

  const payload = { ...req.body, userId };

  const vendorProfile = await vendorProfileModel.create(payload);

  res.status(201).json({
    success: true,
    message: "Profile created successfully",
    data: { vendorProfile },
  });
});

const getVendorProfile = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user?._id;

  if (!userId) {
    return next(new customError("Unauthorized", 401));
  }

  const vendorProfile = await vendorProfileModel.findOne({ userId });

  if (!vendorProfile) {
    const error = new customError("Vendor profile not found", 404);
    return next(error);
  }

  res.status(200).json({
    success: true,
    data: {
      vendorProfile,
    },
  });
});

const getPublicVendorProfile = asyncErrorHandler(async (req, res, next) => {
  const storeUsername = req.params.storeUsername;

  if (!storeUsername) {
    const error = new customError("Store username is required", 400);
    return next(error);
  }

  const vendorProfile = await vendorProfileModel.findOne({
    storeUsername: storeUsername,
  });

  if (!vendorProfile) {
    const error = new customError("Vendor profile not found", 404);
    return next(error);
  }
  res.status(200).json({ success: true, data: { vendorProfile } });
});

const updateVendorProfile = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user && req.user._id;
  if (!userId) {
    const err = new customError("Unauthorized", 401);
    return next(err);
  }

  const updates = { ...req.body };
  delete updates.userId;
  delete updates._id;

  const updated = await vendorProfileModel.findOneAndUpdate(
    { userId },
    { $set: updates },
    { new: true, runValidators: true, upsert: false }
  );

  if (!updated) {
    const err = new customError("Profile not found", 404);
    return next(err);
  }

  res.status(200).json({
    success: true,
    message: "Profile updated",
    data: { vendorProfile: updated },
  });
});

module.exports = {
  createVendorProfile,
  getVendorProfile,
  getPublicVendorProfile,
  updateVendorProfile,
};
