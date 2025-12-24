const express = require("express");
const router = express.Router();
const {
  createReview,
  getVendorReviews,
} = require("../controllers/review.controller");
const { protectRoute } = require("../middleware/auth.middleware");

router.post("/", protectRoute, createReview);
router.get("/:vendorId", getVendorReviews);

module.exports = router;
