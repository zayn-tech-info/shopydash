const express = require("express");
const {
  signup,
  login,
  checkAuth,
  logout,
  googleAuth,
  completeRegistration,
} = require("../controllers/auth/auth.controller");
const { protectRoute } = require("../middleware/auth.middleware");

const route = express.Router();

route.post("/signup", signup);
route.post("/login", login);
route.post("/logout", logout);
route.get("/check", protectRoute, checkAuth);
route.post("/google", googleAuth);
route.post("/complete-registration", protectRoute, completeRegistration);

module.exports = route;
