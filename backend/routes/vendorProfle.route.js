const express = require("express");
const {
  createVendorProfile,
} = require("../controllers/vendorProfile.controller");
const { protectRoute, verifyRole } = require("../middleware/auth.middleware");

const route = express.Router();

route.post(
  "/createVendorProflie",
  protectRoute,
  verifyRole("vendor"),
  createVendorProfile
);

module.exports = route;
