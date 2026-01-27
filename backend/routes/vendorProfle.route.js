const express = require("express");
const {
  createVendorProfile,

  getPublicVendorProfile,
  updateVendorProfile,
  getAllVendorsProfile,
  getVendorProfileByUserId,
} = require("../controllers/vendor/vendorProfile.controller");
const { protectRoute, verifyRole } = require("../middleware/auth.middleware");

const route = express.Router();

route.post(
  "/createVendorProfile",
  protectRoute,
  verifyRole("vendor", "client"),
  createVendorProfile,
);

route.get("/store/:storeUsername", getPublicVendorProfile);

route.get("/allvendors", getAllVendorsProfile);

route.get("/:userId", getVendorProfileByUserId);

route.patch(
  "/updateVendorProfile",
  protectRoute,
  verifyRole("vendor"),
  updateVendorProfile,
);

module.exports = route;
