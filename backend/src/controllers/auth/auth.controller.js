const asyncErrorHandler = require("../../errors/asyncErrorHandle");
const User = require("../../models/auth.model");
const VendorProfile = require("../../models/vendorProfile.model");
const ClientProfile = require("../../models/clientProfile.model");
const sendToken = require("../../utils/sendToken");
const validator = require("validator");
const customError = require("../../errors/customError");
const { cloudinary } = require("../vendor/upload.controller");
const { checkUserHasProfile } = require("../../utils/profileHelper");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../../utils/email");
// const crypto = require("crypto");

const VerificationToken = require("../../models/verificationToken.model");

async function generateUniqueUsername(email) {
  const base = email.split("@")[0].replace(/[^a-z0-9_.]/gi, "").toLowerCase();
  const baseUsername = base.length >= 3 ? base : `${base}${Math.floor(Math.random() * 1000)}`;
  let username = baseUsername.slice(0, 30);
  let suffix = 0;
  while (true) {
    const candidate = suffix === 0 ? username : `${username.slice(0, 26)}${String(suffix).padStart(4, "0")}`.slice(0, 30);
    const exists = await User.findOne({ username: candidate }).select("_id").lean();
    if (!exists) return candidate;
    suffix += 1;
  }
}

const googleAuth = asyncErrorHandler(async (req, res, next) => {
  const { token } = req.body;
  const response = await fetch(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!response.ok) {
    const error = new customError("Failed to fetch user info from Google", 400);
    return next(error);
  }

  const { email, name, picture } = await response.json();
  let user = await User.findOne({ email });

  if (user) {
    if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }
    const hasProfile = await checkUserHasProfile(user);
    sendToken(user, "Logged in successfully", res, 200, hasProfile);
  } else {
    const username = await generateUniqueUsername(email);

    const fullName =
      name && String(name).trim()
        ? String(name).trim()
        : email
          ? email.split("@")[0]
          : "User";
    user = await User.create({
      email,
      fullName,
      username,
      profilePic: picture,
      isGoogleAuth: true,
      profileComplete: false,
      isVerified: true,
    });

    sendToken(user, "Account created successfully", res, 201, false);
  }
});

const completeRegistration = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;
  const {
    role,
    fullName,
    phoneNumber,
    schoolName,
    schoolEmail,
    businessName,
    password,
    state,
    city,
    country,
    schoolArea,
    area,
    gender,
    preferredCategory,
    businessCategory,
  } = req.body;

  const user = await User.findById(userId).select("+password");

  if (!user) {
    const err = new customError("User not found", 404);
    return next(err);
  }

  const missingFields = [];
  if (!fullName || !fullName.trim()) missingFields.push("fullName");
  if (!phoneNumber) missingFields.push("phoneNumber");
  if (!state) missingFields.push("state");
  if (!city) missingFields.push("city");
  if (!country) missingFields.push("country");

  const effectiveRole = role || user.role;
  if (effectiveRole === "vendor" && !businessName && !user.businessName) {
    missingFields.push("businessName");
  }

  if ((!user.password || user.isGoogleAuth) && !password) {
    // optional password for Google users
  }

  if (missingFields.length > 0) {
    const err = new customError(
      `Missing required fields: ${missingFields.join(", ")}`,
      400,
    );
    return next(err);
  }

  const trimmedFullName = fullName.trim();
  if (
    trimmedFullName.length < 2 ||
    !/^[a-zA-Z\s'-]+$/.test(trimmedFullName)
  ) {
    const err = new customError(
      "Full name must be at least 2 characters and contain only letters, spaces, hyphens, and apostrophes",
      400,
    );
    return next(err);
  }

  user.fullName = trimmedFullName;
  user.phoneNumber = phoneNumber.trim();
  if (schoolName) user.schoolName = schoolName.trim();
  if (schoolEmail) user.schoolEmail = schoolEmail.trim().toLowerCase();
  if (password) user.password = password;
  if (businessName) user.businessName = businessName.trim();
  if (gender) user.gender = gender;
  if (effectiveRole) user.role = effectiveRole;

  user.state = state || user.state;
  user.city = city || user.city;
  user.country = country || user.country;
  user.schoolArea = schoolArea || user.schoolArea;
  user.profileComplete = true;

  await user.save();

  if (effectiveRole === "client") {
    let clientProfile = await ClientProfile.findOne({ userId }).select("_id").lean();
    if (!clientProfile) {
      clientProfile = await ClientProfile.create({
        userId,
        preferredCategory: Array.isArray(preferredCategory) ? preferredCategory : [],
      });
      if (!clientProfile?._id) {
        const err = new customError("Failed to create client profile", 500);
        return next(err);
      }
    }
  } else if (effectiveRole === "vendor") {
    let vendorProfile = await VendorProfile.findOne({ userId }).select("_id").lean();
    if (!vendorProfile) {
      vendorProfile = await VendorProfile.create({
        userId,
        businessCategory: Array.isArray(businessCategory) ? businessCategory : [],
      });
      if (!vendorProfile?._id) {
        const err = new customError("Failed to create vendor profile", 500);
        return next(err);
      }
    }
  }

  const hasProfile = await checkUserHasProfile(user);
  sendToken(user, "Registration completed successfully", res, 200, hasProfile);
});

const signup = asyncErrorHandler(async (req, res, next) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    const err = new customError("Email and password are required", 400);
    return next(err);
  }

  const validRole = role === "vendor" ? "vendor" : "client";
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const err = new customError(`User with ${email} already exist`, 400);
    return next(err);
  }

  try {
    const verificationToken = await VerificationToken.findOne({
      identifier: email.toLowerCase(),
      verified: true,
    });

    if (!verificationToken) {
      return next(
        new customError("Please verify your email address first", 400),
      );
    }

    const username = await generateUniqueUsername(email);

    const user = await User.create({
      email: email.trim().toLowerCase(),
      password,
      username,
      role: validRole,
      profileComplete: false,
      isVerified: true,
    });

    await VerificationToken.deleteOne({ _id: verificationToken._id });

    const hasProfile = await checkUserHasProfile(user);
    sendToken(user, "User created successfully", res, 201, hasProfile);
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error during signup",
    });
  }
});

const login = asyncErrorHandler(async (req, res, next) => {
  const { password } = req.body;
  const identifier = req.body.email || req.body.username;

  if (!identifier || !password) {
    const err = new customError("All credentials are required", 400);
    return next(err);
  }

  const trimmed = String(identifier).trim().toLowerCase();
  let query = null;

  if (validator.isEmail(trimmed)) {
    query = { email: trimmed };
  } else {
    query = { username: trimmed };
  }

  const user = await User.findOne(query).select(
    "+verificationCode +verificationCodeExpires +isVerified +password",
  );
  if (!user) {
    const err = new customError("Invalid credentials", 401);
    return next(err);
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    const err = new customError("Invalid credentials", 401);
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
    additionalData,
  );
});

const logout = (req, res, next) => {
  const isProduction = process.env.NODE_ENV === "production";

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    maxAge: 0,
    sameSite: "none",
  };

  if (isProduction && process.env.COOKIE_DOMAIN) {
    cookieOptions.domain = process.env.COOKIE_DOMAIN;
  }

  res.cookie("token", "", cookieOptions);

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

  const token = req.user.generateToken();
  res.status(200).json({ ...userData, token });
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
      400,
    );
    return next(error);
  }

  const allowedFields = [
    "fullName",
    "phoneNumber",
    "schoolName",
    "schoolEmail",
    "businessName",
    "profilePic",
    "state",
    "city",
    "country",
    "schoolArea",
    "username",
    "gender",
    "bio",
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
            },
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
    },
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
      400,
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

const sendOtp = asyncErrorHandler(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new customError("Email is required", 400));

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return next(new customError("Email already registered", 400));

  const token = Math.floor(100000 + Math.random() * 900000).toString();

  await VerificationToken.findOneAndUpdate(
    { identifier: email },
    { token, expires: Date.now() + 10 * 60 * 1000, verified: false },
    { upsert: true, new: true },
  );

  try {
    await sendVerificationEmail(email, token);
    res.status(200).json({ success: true, message: "Verification code sent" });
  } catch (error) {
    return next(
      new customError(
        error.message || "Failed to send verification email",
        500,
      ),
    );
  }
});

const verifyEmail = asyncErrorHandler(async (req, res, next) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return next(new customError("Email and code are required", 400));
  }

  const user = await User.findOne({ email }).select(
    "+verificationCode +verificationCodeExpires",
  );

  if (!user) {
    return next(new customError("Invalid or expired verification code", 400));
  }

  if (user.isVerified) {
    return next(new customError("Email is already verified", 400));
  }

  if (
    user.verificationCode !== code ||
    user.verificationCodeExpires < Date.now()
  ) {
    return next(new customError("Invalid or expired verification code", 400));
  }

  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpires = undefined;
  await user.save();

  const hasProfile = await checkUserHasProfile(user);
  sendToken(user, "Email verified successfully", res, 200, hasProfile);
});

const resendVerificationCode = asyncErrorHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new customError("Email is required", 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new customError("User not found", 404));
  }

  if (user.isVerified) {
    return next(new customError("Email is already verified", 400));
  }

  const verificationCode = Math.floor(
    100000 + Math.random() * 900000,
  ).toString();
  const verificationCodeExpires = Date.now() + 10 * 60 * 1000;

  user.verificationCode = verificationCode;
  user.verificationCodeExpires = verificationCodeExpires;
  await user.save();

  try {
    await sendVerificationEmail(email, verificationCode);
    res.status(200).json({
      success: true,
      message: "Verification code sent to your email",
    });
  } catch (error) {
    return next(new customError("Failed to send verification email", 500));
  }
});

const validateOtp = asyncErrorHandler(async (req, res, next) => {
  const { email, code } = req.body;
  if (!email || !code)
    return next(new customError("Email and code required", 400));

  const record = await VerificationToken.findOne({ identifier: email });
  if (!record) return next(new customError("Invalid or expired code", 400));

  if (record.token !== code || record.expires < Date.now()) {
    return next(new customError("Invalid or expired code", 400));
  }

  record.verified = true;
  await record.save();

  res
    .status(200)
    .json({ success: true, message: "Email verified successfully" });
});

const switchRole = asyncErrorHandler(async (req, res, next) => {
  const { role } = req.body;
  const userId = req.user._id;

  if (!role || !["client", "vendor"].includes(role)) {
    return next(
      new customError("Invalid role. Must be 'client' or 'vendor'", 400),
    );
  }

  if (role === "vendor") {
    const vendorProfile = await VendorProfile.findOne({ userId });
    if (!vendorProfile) {
      return next(new customError("Vendor profile required", 400));
    }
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true, runValidators: true },
  );

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
    `Switched to ${role} successfully`,
    res,
    200,
    hasProfile,
    additionalData,
  );
});

const forgotPassword = asyncErrorHandler(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new customError("Email is required", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new customError("User with this email does not exist", 404));
  }

  const resetToken = Math.floor(100000 + Math.random() * 900000).toString();

  await VerificationToken.findOneAndUpdate(
    { identifier: email },
    {
      token: resetToken,
      expires: Date.now() + 10 * 60 * 1000,
      verified: false,
    },
    { upsert: true, new: true },
  );

  try {
    await sendPasswordResetEmail(email, resetToken);
    res.status(200).json({
      success: true,
      message: "Password reset code sent to your email",
    });
  } catch (error) {
    return next(new customError("Failed to send password reset email", 500));
  }
});

const resetPassword = asyncErrorHandler(async (req, res, next) => {
  const { email, otp, newPassword, confirmPassword } = req.body;

  if (!email || !otp || !newPassword || !confirmPassword) {
    return next(new customError("All fields are required", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(new customError("Passwords do not match", 400));
  }

  const tokenRecord = await VerificationToken.findOne({ identifier: email });
  if (!tokenRecord) {
    return next(new customError("Invalid or expired reset code", 400));
  }

  if (tokenRecord.token !== otp || tokenRecord.expires < Date.now()) {
    return next(new customError("Invalid or expired reset code", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new customError("User not found", 404));
  }

  const isSamePassword = await user.comparePassword(newPassword);
  if (isSamePassword) {
    return next(
      new customError(
        "New password cannot be the same as the old password",
        400,
      ),
    );
  }

  user.password = newPassword;
  await user.save();

  await VerificationToken.deleteOne({ _id: tokenRecord._id });

  const hasProfile = await checkUserHasProfile(user);
  sendToken(user, "Password reset successfully", res, 200, hasProfile);
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
  verifyEmail,
  resendVerificationCode,
  sendOtp,
  validateOtp,
  switchRole,
  forgotPassword,
  resetPassword,
};
