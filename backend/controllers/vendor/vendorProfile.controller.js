const asyncErrorHandler = require("../../errors/asyncErrorHandle");
const customError = require("../../errors/customError");
const vendorProfileModel = require("../../models/vendorProfile.model");
const User = require("../../models/auth.model");

const createVendorProfile = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user && req.user._id;
  if (!userId) {
    const err = new customError("Unauthorized", 401);
    return next(err);
  }

  // Use lean() and select only _id for faster check
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

/* const getVendorProfile = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user?._id;

  if (!userId) {
    return next(new customError("Unauthorized", 401));
  }

  const vendorProfile = await vendorProfileModel
    .findOne({ userId })
    .populate(
      "userId",
      "businessName email phoneNumber whatsAppNumber schoolName logo isVerified"
    );

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
}); */

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
      "businessName email phoneNumber whatsAppNumber schoolName logo isVerified profilePic"
    );

  if (!vendorProfile) {
    const error = new customError("Vendor profile not found", 404);
    return next(error);
  }
  res.status(200).json({ success: true, data: { vendorProfile } });
});

const getAllVendorsProfile = asyncErrorHandler(async (req, res, next) => {
  // Use lean() for better performance since we're only reading data
  const vendors = await User.find({ role: "vendor" })
    .select("username profilePic businessName whatsAppNumber")
    .lean();

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
    storeDescription,
    businessCategory,
    address,
    city,
    state,
    lga,
    area,
    country,
    zipCode,
    accountNumber,
    paymentMethods,
    instagram,
    facebook,
    twitter,
    storeUsername,
  } = req.body;

  const updates = {
    storeDescription,
    businessCategory,
    address,
    city,
    state,
    lga,
    area,
    country,
    zipCode,
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

module.exports = {
  createVendorProfile,
  // getVendorProfile,
  getPublicVendorProfile,
  updateVendorProfile,
  getAllVendorsProfile,
};
