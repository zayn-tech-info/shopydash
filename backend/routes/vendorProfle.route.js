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

route.get("/username/:id", getVendorProfile);

route.get("/me", protectRoute, getVendorProfile);

route.put("/", protectRoute, verifyRole("vendor"), updateVendorProfile);

module.exports = route;
