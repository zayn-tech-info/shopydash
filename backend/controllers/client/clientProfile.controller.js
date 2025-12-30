const clientProfileSchema = require("../../models/clientProfile.model");
const asyncErrorHandler = require("../../errors/asyncErrorHandle");
const customError = require("../../errors/customError");
const User = require("../../models/auth.model");

const create = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user && req.user._id;

  if (!userId) {
    const err = new customError("Unauthorized", 401);
    return next(err);
  }

  const existingClientProfile = await clientProfileSchema
    .findOne({ userId })
    .select("_id")
    .lean();

  if (existingClientProfile) {
    const err = new customError("Profile already exist", 400);
    return next(err);
  }

  const {
    fullName,
    username,
    phoneNumber,
    schoolName,
    profileImage,
    ...allowedData
  } = req.body;
  const payload = { ...allowedData, userId };

  const clientProfile = await clientProfileSchema.create(payload);

  res.status(201).json({
    success: true,
    message: "Profile created successfully",
    data: {
      clientProfile,
    },
  });
});

const update = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user && req.user._id;

  const { fullName, phoneNumber, gender, preferredCategory, wishList, bio } =
    req.body;

  if (fullName || phoneNumber) {
    const userUpdates = {};
    if (fullName) userUpdates.fullName = fullName;
    if (phoneNumber) userUpdates.phoneNumber = phoneNumber;

    await User.findByIdAndUpdate(userId, userUpdates, {
      new: true,
      runValidators: true,
    });
  }

  const updates = {
    gender,
    preferredCategory,
    wishList,
    bio,
  };

  const updated = await clientProfileSchema.findOneAndUpdate(
    { userId },
    { $set: updates },
    { new: true, runValidators: true, upsert: false }
  );

  if (!updated) {
    const err = new customError("Client profile not found", 404);
    return next(err);
  }

  res.status(200).json({
    status: "success",
    data: {
      clientProfile: updated,
    },
  });
});

module.exports = { create, update };
