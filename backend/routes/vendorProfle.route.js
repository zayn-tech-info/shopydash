const express = require("express");
const {
  createVendorProfile,
  // getVendorProfile,
  getPublicVendorProfile,
  updateVendorProfile,
  getAllVendorsProfile,
} = require("../controllers/vendor/vendorProfile.controller");
const { protectRoute, verifyRole } = require("../middleware/auth.middleware");

const upload = require("../middleware/upload.middleware");

const route = express.Router();

route.post(
  "/createVendorProfile",
  protectRoute,
  verifyRole("vendor"),
  createVendorProfile
);

route.get("/store/:storeUsername", getPublicVendorProfile);

// route.get("/profile", protectRoute, verifyRole("vendor"));
// getVendorProfile

route.get("/allvendors", getAllVendorsProfile);
route.patch(
  "/updateVendorProfile",
  protectRoute,
  verifyRole("vendor"),
  upload.single("logo"),
  updateVendorProfile
);

module.exports = route;
