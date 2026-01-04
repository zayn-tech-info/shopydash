const User = require("../models/auth.model");
const jwt = require("jsonwebtoken");
const util = require("util");
const asyncErrorHandler = require("../errors/asyncErrorHandle");
const customError = require("../errors/customError");

const protectRoute = asyncErrorHandler(async (req, res, next) => {
  let token;
  const jwtToken = req.headers.authorization;

  if (jwtToken && jwtToken.startsWith("Bearer ")) {
    token = jwtToken.split(" ")[1];
  }

  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "You are not logged in",
    });
  }

  let decodeToken;

  decodeToken = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

  const user = await User.findById(decodeToken.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  if (await user.isPasswordChanged(decodeToken.iat)) {
    const error = new customError(
      "Your password was changed recently. Please login again.",
      401
    );
    return next(error);
  }

  req.user = user;
  next();
});

const verifyRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      const error = new customError("Not Authorized", 401);
      return next(error);
    }

    const userRole = req.user.role;
    if (!allowedRoles.includes(userRole)) {
      const error = new customError("Access denied", 401);
      return next(error);
    }
    next();
  };
};

module.exports = { protectRoute, verifyRole };



 