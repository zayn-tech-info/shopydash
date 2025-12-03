const asyncErrorHandler = require("../../errors/asyncErrorHandle");
const User = require("../../models/auth.model");
const ClientProfile = require("../../models/clientProfile.model");
const VendorProfile = require("../../models/vendorProfile.model");
const sendToken = require("../../utils/sendToken");
const validator = require("validator");
const customError = require("../../errors/customError");

const googleAuth = asyncErrorHandler(async (req, res, next) => {
  const { token } = req.body;

  const response = await fetch(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) {
    const err = new customError("Failed to fetch user info from Google", 400);
    return next(err);
  }

  const { email, name, picture } = await response.json();

  let user = await User.findOne({ email });

  if (user) {
    let hasProfile = false;
    if (user.role === "client") {
      const profile = await ClientProfile.findOne({ userId: user._id });
      hasProfile = !!profile;
    } else if (user.role === "vendor") {
      const profile = await VendorProfile.findOne({ userId: user._id });
      hasProfile = !!profile;
    }
    sendToken(user, "Logged in successfully", res, 200, hasProfile);
  } else {
    const baseUsername = email.split("@")[0];
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const username = `${baseUsername}${randomSuffix}`;

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
  } = req.body;

  if (role === "client") {
    if (
      !fullName ||
      !username ||
      !email ||
      !phoneNumber ||
      !schoolName ||
      !password
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
      !businessName
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

  sendToken(user, "User created successfully", res, 201);
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
  const maybeNumber = Number(trimmed);
  let query = null;

  if (trimmed !== "" && !Number.isNaN(maybeNumber) && /^\d+$/.test(trimmed)) {
    query = { schoolId: maybeNumber };
  } else if (validator.isEmail(trimmed)) {
    query = { email: trimmed };
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

  let hasProfile = false;
  if (user.role === "client") {
    const profile = await ClientProfile.findOne({ userId: user._id });
    hasProfile = !!profile;
  } else if (user.role === "vendor") {
    const profile = await VendorProfile.findOne({ userId: user._id });
    hasProfile = !!profile;
  }

  const userResponse = { ...user.toObject(), hasProfile };

  user.hasProfile = hasProfile;

  sendToken(user, "Logged in successfully", res, 200, hasProfile);
});

const logout = asyncErrorHandler((req, res, next) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", "", {
    httpOnly: true,
    secure: isProduction,
    maxAge: 0,

    sameSite: isProduction ? "none" : "lax",
  });

  return res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
});

const checkAuth = asyncErrorHandler(async (req, res, next) => {
  if (!req.user) {
    const err = new customError("Authentication failed", 401);
    return next(err);
  }

  let hasProfile = false;
  if (req.user.role === "client") {
    const profile = await ClientProfile.findOne({ userId: req.user._id });
    hasProfile = !!profile;
  } else if (req.user.role === "vendor") {
    const profile = await VendorProfile.findOne({ userId: req.user._id });
    hasProfile = !!profile;
  }

  res.status(200).json({ ...req.user.toObject(), hasProfile });
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

  const existingUser = await User.findOne({ username });
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
  user.schoolId = schoolId ? Number(schoolId) : undefined;
  user.profileComplete = true;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Registration completed successfully",
    data: { user: user.toObject(), hasProfile: false },
  });
});

module.exports = {
  signup,
  login,
  logout,
  checkAuth,
  googleAuth,
  completeRegistration,
};
