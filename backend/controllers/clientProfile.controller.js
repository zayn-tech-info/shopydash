const clientProfileSchema = require("../models/clientProfile.model");
const asyncErrorHandler = require("../errors/asyncErrorHandle");
const customError = require("../errors/customError");

const createClientProfile = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user && req.user._id;

  if (!userId) {
    const err = new customError("Unauthorized", 401);
    return next(err);
  }

  const existingClientProfile = await clientProfileSchema.findOne({ userId });

  if (existingClientProfile) {
    const err = new customError("Profile already exist", 400);
    return next(err);
  }

  const payload = { ...req.body, userId };

  const clientProfile = await clientProfileSchema.create(payload);

  res.status(201).json({
    success: true,
    message: "Profile created successfully",
    data: {
      clientProfile,
    },
  });
});

const getClientProfile = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user && req.user._id;

  const clientProfile = await clientProfileSchema.findOne({ userId });

  if (!clientProfile) {
    const err = new customError("Profile not found", 404);
    return next(err);
  }

  res.status(200).json({
    success: true,
    data: {
      clientProfile,
    },
  });
});

const updateClientProfile = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user && req.user._id;

  const clientProfile = await clientProfileSchema.findOne({ userId });
  if (!clientProfile) {
    const err = new customError("Profile not found", 404);
    return next(err);
  }

  const updatedClientProfile = await clientProfileSchema.findOneAndUpdate(
    { userId },
    { $set: req.body },
    { new: true, runValidators: true, upsert: false }
  );

  res.status(200).json({
    success: true,
    data: {
      updatedClientProfile,
    },
  });
});

module.exports = { createClientProfile, getClientProfile, updateClientProfile };
