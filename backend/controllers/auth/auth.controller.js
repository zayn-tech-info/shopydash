const asyncErrorHandler = require("../../errors/asyncErrorHandle");
const User = require("../../models/auth.model");
const VendorProfile = require("../../models/vendorProfile.model");
const sendToken = require("../../utils/sendToken");
const validator = require("validator");
const customError = require("../../errors/customError");
const { cloudinary } = require("../vendor/upload.controller");
const { checkUserHasProfile } = require("../../utils/profileHelper");

const googleAuth = asyncErrorHandler(async (req, res, next) => {
  const { token } = req.body;

  const response = await fetch(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) {
    const error = new customError("Failed to fetch user info from Google", 400);
    return next(error);
  }

  const { email, name, picture } = await response.json();
  let user = await User.findOne({ email });

  if (user) {
    const hasProfile = await checkUserHasProfile(user);
    sendToken(user, "Logged in successfully", res, 200, hasProfile);
  } else {
    let username = email.split("@")[0].replace(/[^a-zA-Z0-9_.]/g, "");
    if (username.length < 3) {
      username = `${username}${Math.floor(Math.random() * 1000)}`;
    }

    user = await User.create({
      email,
      fullName: name,
      username,
      profilePic: picture,
      isGoogleAuth: true,
      profileComplete: false,
    });

    sendToken(user, "Account created successfully", res, 201, false);
  }
});

const completeRegistration = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;
  const {
    role,
    username,
    phoneNumber,
    schoolName,
    whatsAppNumber,
    businessName,
    schoolId,
    password,
    state,
    city,
    country,
    schoolArea,
    area,
  } = req.body;

  if (
    !role ||
    !username ||
    !phoneNumber ||
    !schoolName ||
    !whatsAppNumber ||
    !password
  ) {
    const err = new customError("All fields are required", 400);
    return next(err);
  }

  if (role === "vendor" && !businessName) {
    const err = new customError("Business name is required for vendors", 400);
    return next(err);
  }

  const user = await User.findById(userId);

  if (!user) {
    const err = new customError("User not found", 404);
    return next(err);
  }

  const existingUser = await User.findOne({ username }).select("_id").lean();
  if (existingUser && existingUser._id.toString() !== userId.toString()) {
    const err = new customError("Username is already taken", 400);
    return next(err);
  }

  user.username = username;
  user.role = role;
  user.phoneNumber = phoneNumber;
  user.schoolName = schoolName;
  user.whatsAppNumber = whatsAppNumber;
  user.password = password;
  user.businessName = role === "vendor" ? businessName : undefined;
  user.schoolId = schoolId || undefined;
  user.schoolId = schoolId || undefined;
  user.state = state;
  user.city = city;
  user.schoolArea = schoolArea;
  user.area = area;
  user.country = country;
  user.profileComplete = true;

  await user.save();

  sendToken(user, "Registration completed successfully", res, 200, false);
});

const signup = asyncErrorHandler(async (req, res, next) => {
  const {
    fullName,
    username,
    email,
    phoneNumber,
    schoolName,
    password,
    businessName,
    role,
    city,
    state,
    country,
    schoolArea,
  } = req.body;

  if (role === "client") {
    if (
      !fullName ||
      !username ||
      !email ||
      !phoneNumber ||
      !schoolName ||
      !schoolName ||
      !password ||
      !city ||
      !state ||
      !country ||
      !schoolArea
    ) {
      const err = new customError("All fields are required", 400);
      return next(err);
    }
  } else if (role === "vendor") {
    if (
      !fullName ||
      !username ||
      !email ||
      !phoneNumber ||
      !schoolName ||
      !password ||
      !businessName ||
      !city ||
      !state ||
      !country ||
      !schoolArea
    ) {
      const err = new customError("All fields are required", 400);
      return next(err);
    }
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const err = new customError(`User with ${email} already exist`, 400);
    return next(err);
  }

  const user = await User.create({ ...req.body, profileComplete: true });

  const hasProfile = await checkUserHasProfile(user);
  sendToken(user, "User created successfully", res, 201, hasProfile);
});

const login = asyncErrorHandler(async (req, res, next) => {
  const { password } = req.body;
  const identifier = req.body.email || req.body.username || req.body.schoolId;

  if (!identifier || !password) {
    const err = new customError(
      "Identifier (email / username / schoolId) and password are required",
      400
    );
    return next(err);
  }

  const trimmed = String(identifier).trim();
  let query = null;

  if (validator.isEmail(trimmed)) {
    query = { email: trimmed };
  } else if (/^\d+$/.test(trimmed)) {
    query = { schoolId: trimmed };
  } else {
    query = { username: trimmed };
  }

  const user = await User.findOne(query);
  if (!user) {
    const err = new customError(
      "Invalid email / school id / username or password",
      401
    );
    return next(err);
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    const err = new customError(
      "Invalid email / school id / username or password",
      401
    );
    return next(err);
  }

  const hasProfile = await checkUserHasProfile(user);

  let additionalData = {};
  if (user.role === "vendor") {
    const vendorProfile = await VendorProfile.findOne({
      userId: user._id,
    }).select("+bankDetails.subaccountCode");
    if (vendorProfile) {
      additionalData.vendorProfile = vendorProfile;
    }
  }

  sendToken(
    user,
    "Logged in successfully",
    res,
    200,
    hasProfile,
    additionalData
  );
});

const logout = (req, res, next) => {
  const isProduction =
    process.env.NODE_ENV === "production" || process.env.RENDER === "true";

  res.cookie("token", "", {
    httpOnly: true,
    secure: isProduction,
    maxAge: 0,
    sameSite: isProduction ? "none" : "lax",
  });

  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};

const checkAuth = asyncErrorHandler(async (req, res, next) => {
  if (!req.user) {
    const err = new customError("Authentication failed", 401);
    return next(err);
  }

  const hasProfile = await checkUserHasProfile(req.user);
  const userData = req.user.toObject();
  userData.hasProfile = hasProfile;

  if (req.user.role === "vendor") {
    const vendorProfile = await VendorProfile.findOne({
      userId: req.user._id,
    }).select("+bankDetails.subaccountCode");
    if (vendorProfile) {
      userData.vendorProfile = vendorProfile;
    }
  }

  res.status(200).json(userData);
});

const filterField = (obj, ...allowedFields) => {
  const filteredfields = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) {
      filteredfields[key] = obj[key];
    }
  });
  return filteredfields;
};

const updateUser = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;

  if (req.body.password || req.body.email || req.body.role) {
    const error = new customError(
      "You are not allowed to update email, password, or role here.",
      400
    );
    return next(error);
  }

  const allowedFields = [
    "fullName",
    "phoneNumber",
    "schoolName",
    "businessName",
    "profilePic",
    "state",
    "city",
    "country",
    "schoolArea",
    "area",
    "username",
  ];

  let filteredBody = filterField(req.body, ...allowedFields);

  if (req.file) {
    try {
      const uploadToCloudinary = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "vendor/avatars",
              allowed_formats: ["jpeg", "jpg", "png", "webp"],
              transformation: [{ width: 500, height: 500, crop: "limit" }],
              resource_type: "auto",
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(buffer);
        });
      };

      const uploaded = await uploadToCloudinary(req.file.buffer);
      filteredBody.profilePic = uploaded.secure_url;
    } catch (error) {
      return next(new customError("Image upload failed", 500));
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: filteredBody },
    {
      new: true,
      runValidators: true,
      context: "query",
    }
  );

  if (!updatedUser) {
    const error = new customError("User not found", 404);
    return next(error);
  }

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    updatedUser,
  });
});

const changePassword = asyncErrorHandler(async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user._id;

  if (!currentPassword || !newPassword || !confirmPassword) {
    const error = new customError("All fields are required", 400);
    return next(error);
  }

  if (newPassword !== confirmPassword) {
    const error = new customError(
      "New password and confirm password do not match",
      400
    );
    return next(error);
  }

  const user = await User.findById(userId).select("+password");

  if (!user) {
    const error = new customError("User not found", 404);
    return next(error);
  }

  const isPasswordMatch = await user.comparePassword(currentPassword);
  if (!isPasswordMatch) {
    const error = new customError("Current incorrect password", 401);
    return next(error);
  }

  user.password = newPassword;
  await user.save();

  sendToken(user, "Password changed successfully", res, 200);
});

module.exports = {
  signup,
  login,
  logout,
  checkAuth,
  googleAuth,
  completeRegistration,
  updateUser,
  changePassword,
};
