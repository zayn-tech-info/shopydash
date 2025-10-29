const User = require("../models/auth.model");
const jwt = require("jsonwebtoken");
const util = require("util");

const protectRoute = async () => {
  let token;
  const jwtToken = req.headers.authorization;

  if (jwtToken && jwtToken.startsWith("Bearer ")) {
    token = jwtToken.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "You are not logged in",
    });
  }

  let decodeToken;
  try {
    decodeToken = await util.promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET_KEY
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Invalid or malformed token",
    });
  }

  const user = await User.find(decodeToken.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  if (await user.isPaswrdChanged(decodeToken.iat)) {
    return res.status(401).json({
      success: false,
      message: "Password changed recently please login again ",
    });
  }

  req.user = user;
  next();
};

const verifyRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized",
      });
    }

    const userRole = req.user.role;
    if (!allowedRoles.includes(userRole)) {
      return res.status(401).json({
        success: false,
        message: "Access denied",
      });
    }
    next()
  };
};

module.exports = { protectRoute, verifyRole };
