const express = require("express");
const {
  signup,
  login,
  checkAuth,
  logout,
} = require("../controllers/auth.controller");
const { protectRoute } = require("../middleware/auth.middleware");

const route = express.Router();

route.post("/signup", signup);
route.post("/login", login);
route.post("/logout", logout);
route.get("/check", protectRoute, checkAuth);

module.exports = route;
