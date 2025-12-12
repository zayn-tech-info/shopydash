const express = require("express");
const {
  signup,
  login,
  checkAuth,
  logout,
  googleAuth,
  completeRegistration,
  updateUser,
} = require("../controllers/auth/auth.controller");
const { protectRoute } = require("../middleware/auth.middleware");
const { changeAvatar } = require("../controllers/vendor/upload.controller");
const createRateLimiter = require("../middleware/rateLimiter.middleware");

const route = express.Router();

// Rate limit auth endpoints to prevent brute force attacks
const authLimiter = createRateLimiter(
  10,
  15 * 60 * 1000,
  "Too many authentication attempts, please try again later"
);

// General rate limiter for other routes
const generalLimiter = createRateLimiter(
  100,
  15 * 60 * 1000,
  "Too many requests, please try again later"
);

route.post("/signup", authLimiter, signup);
route.post("/login", authLimiter, login);
route.post("/logout", generalLimiter, logout);
route.get("/check", protectRoute, generalLimiter, checkAuth);
route.post("/google", authLimiter, googleAuth);
route.post("/complete-registration", protectRoute, generalLimiter, completeRegistration);

route.patch("/update", protectRoute, generalLimiter, changeAvatar, updateUser);

module.exports = route;
