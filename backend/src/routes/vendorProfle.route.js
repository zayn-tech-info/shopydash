const express = require("express");
const {
  createVendorProfile,
  getPublicVendorProfile,
  updateVendorProfile,
  updateCoverImage,
  getAllVendorsProfile,
  getVendorProfileByUserId,
} = require("../controllers/vendor/vendorProfile.controller");
const { uploadCover } = require("../controllers/vendor/upload.controller");
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

// More specific route first so it is matched before /updateVendorProfile
route.patch(
  "/updateVendorProfile/cover",
  protectRoute,
  verifyRole("vendor"),
  uploadCover,
  updateCoverImage,
);

route.patch(
  "/updateVendorProfile",
  protectRoute,
  verifyRole("vendor"),
  updateVendorProfile,
);

module.exports = route;
