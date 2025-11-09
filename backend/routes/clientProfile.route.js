const express = require("express");
const { protectRoute, verifyRole } = require("../middleware/auth.middleware");
const {
  createClientProfile,
} = require("../controllers/clientProfile.controller");

const router = express.Router();

router.post(
  "/createClientProfile",
  protectRoute,
  verifyRole("client"),
  createClientProfile
);

module.exports = router;
