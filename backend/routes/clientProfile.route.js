const express = require("express");
const { protectRoute, verifyRole } = require("../middleware/auth.middleware");
const {
  createClientProfile,
  updateClientProfile,
} = require("../controllers/clientProfile.controller");

const router = express.Router();

router.post(
  "/createClientProfile",
  protectRoute,
  verifyRole("client"),
  createClientProfile
);

router.patch(
  "/updateClientProfile",
  protectRoute,
  verifyRole("client"),
  updateClientProfile
);
module.exports = router;
