const User = require("../models/auth.model");
const ClientProfile = require("../models/clientProfile.model");
const VendorProfile = require("../models/vendorProfile.model");
const sendToken = require("../utils/sendToken");
const validator = require("validator");

const googleAuth = async (req, res) => {
  const { token } = req.body;

  try {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user info from Google");
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
  } catch (error) {
    console.error("Google Auth Error:", error);
    return res.status(400).json({
      success: false,
      message: "Invalid Google Token",
    });
  }
};

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

    const user = await User.create({ ...req.body, profileComplete: true });

    sendToken(user, "User created successfully", res, 201);
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0]; 
      let message = "";

      if (field === "phoneNumber") {
        message = "This phone number is already registered";
      } else if (field === "email") {
        message = "This email is already registered";
      } else if (field === "username") {
        message = "This username is already taken";
      } else if (field === "businessName") {
        message = "This business name is already taken";
      } else {
        message = `This ${field} is already in use`;
      }

      return res.status(400).json({
        success: false,
        message: message,
      });
    }
    return res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};

const login = async (req, res, next) => {
  try {
    const { password } = req.body;
    const identifier = req.body.email || req.body.username || req.body.schoolId;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Identifier (email / username / schoolId) and password are required",
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
        message: "Invalid email / school id / username or password",
      });
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email / school id / username or password",
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

    const userResponse = { ...user.toObject(), hasProfile };

    user.hasProfile = hasProfile;

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

const completeRegistration = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      role,
      phoneNumber,
      schoolName,
      whatsAppNumber,
      businessName,
      schoolId,
      password,
    } = req.body;

    if (!role || !phoneNumber || !schoolName || !whatsAppNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (role === "vendor" && !businessName) {
      return res.status(400).json({
        success: false,
        message: "Business name is required for vendors",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

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
  } catch (error) {
    console.error("Complete Registration Error:", error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      let message = "";

      if (field === "phoneNumber") {
        message = "This phone number is already registered";
      } else if (field === "whatsAppNumber") {
        message = "This WhatsApp number is already registered";
      } else if (field === "businessName") {
        message = "This business name is already taken";
      } else {
        message = `This ${field} is already in use`;
      }

      return res.status(400).json({
        success: false,
        message: message,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

module.exports = {
  signup,
  login,
  logout,
  checkAuth,
  googleAuth,
  completeRegistration,
};
