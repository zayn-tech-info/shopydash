const express = require("express");
const {
  createVendorProfile,
  getVendorProfile,
  updateVendorProfile,
} = require("../controllers/vendorProfile.controller");
const { protectRoute, verifyRole } = require("../middleware/auth.middleware");

const route = express.Router();

route.post(
  "/createVendorProfile",
  protectRoute,
  verifyRole("vendor"),
  createVendorProfile
);

route.get(
  "/store",
  protectRoute,
  verifyRole("vendor"),
  getVendorProfile
);
route.get("/me", protectRoute, verifyRole("vendor"), getVendorProfile);
route.patch(
  "/updateVendorProfile",
  protectRoute,
  verifyRole("vendor"),
  updateVendorProfile
);

module.exports = route;
