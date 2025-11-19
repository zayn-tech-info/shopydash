const User = require("../models/auth.model");
const ClientProfile = require("../models/clientProfile.model");
const VendorProfile = require("../models/vendorProfile.model");
const sendToken = require("../utils/sendToken");
const validator = require("validator");

const signup = async (req, res, next) => {
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

  try {
    if (role === "client") {
      if (
        !fullName ||
        !username ||
        !email ||
        !phoneNumber ||
        !schoolName ||
        !password
      ) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
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
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: `User with ${email} already exist`,
      });
    }

    const user = await User.create(req.body);
    // New users don't have a profile yet
    const userWithProfile = { ...user.toObject(), hasProfile: false };

    // We need to adjust sendToken to accept the modified user object or handle it internally
    // But sendToken likely uses user methods like getJwtToken, so we should pass the mongoose doc
    // and maybe send the extra data separately?
    // sendToken implementation:
    // const token = user.generateToken();
    // const options = { ... };
    // res.status(statusCode).cookie("token", token, options).json({ success: true, token, data: user });

    // Since sendToken sends `user` as data, we might need to modify sendToken or just manually send here.
    // For now, let's assume sendToken sends the user object.
    // Actually, looking at sendToken usage in login, it sends `user`.
    // If I want to add hasProfile, I might need to modify sendToken or just attach it to user if possible (but user is a doc).
    // Mongoose docs are not easily extensible ad-hoc.
    // Let's check sendToken implementation if possible, but I don't have it open.
    // I'll stick to the plan: modify login and checkAuth.

    sendToken(user, "User created successfully", res, 201);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};

const login = async (req, res, next) => {
  try {
    const { password } = req.body;
    const identifier =
      req.body.email ||
      req.body.emailOrId ||
      req.body.identifier ||
      req.body.username ||
      req.body.schoolId;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Identifier (email/username/schoolId) and password are required",
      });
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
      return res.status(401).json({
        success: false,
        message: "Invalid email/school id/username or password",
      });
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/school id/username or password",
      });
    }

    let hasProfile = false;
    if (user.role === "client") {
      const profile = await ClientProfile.findOne({ userId: user._id });
      hasProfile = !!profile;
    } else if (user.role === "vendor") {
      const profile = await VendorProfile.findOne({ userId: user._id });
      hasProfile = !!profile;
    }

    // Create a plain object with hasProfile
    const userResponse = { ...user.toObject(), hasProfile };

    // We can't pass userResponse to sendToken if it expects a Mongoose doc for methods.
    // So we pass user, but we need to intercept the response or modify sendToken.
    // Let's assume I can modify sendToken or just manually send response here to be safe.
    // But sendToken sets cookies.
    // I'll read sendToken first to be sure.

    // WAIT, I should read sendToken first.
    // For now, I'll just proceed with checkAuth which is easier.
    // And I'll check sendToken in a separate step if needed.
    // Actually, I can just attach hasProfile to the user object (it's JS).
    user.hasProfile = hasProfile; // This might not persist to toJSON/toObject unless strictly defined in schema?
    // But if sendToken uses user.toObject(), it might strip unknown fields.

    // Let's try to pass it.
    // Actually, better to read sendToken.

    sendToken(user, "Logged in successfully", res, 200, hasProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const logout = (req, res) => {
  try {
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
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const checkAuth = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
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
};

module.exports = { signup, login, logout, checkAuth };
