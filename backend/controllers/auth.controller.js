const User = require("../models/auth.model");
const sendToken = require("../utils/sendToken");

const signup = async (req, res, next) => {
  const {
    fullname,
    username,
    email,
    phoneNumber,
    school,
    password,
    businessName,
    role,
  } = req.body;

  try {
    if (role === "client") {
      if (
        !fullname ||
        !username ||
        !email ||
        !phoneNumber ||
        !school ||
        !password
      ) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }
    } else if (role === "vendor") {
      if (
        !fullname ||
        !username ||
        !email ||
        !phoneNumber ||
        !school ||
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


module.exports = { signup };
