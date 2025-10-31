const User = require("../models/auth.model");
const sendToken = require("../utils/sendToken");
const jwt = require("jsonwebtoken");
const util = require("util");
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

    sendToken(user, "Logged in successfully", res, 200);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const logout = (req, res, next) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", "", {
      httpOnly: true,
      secure: isProduction,
      maxAge: new Date(0),
      sameSite: isProduction ? "lax" : "none",
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

module.exports = { signup, login, logout };
