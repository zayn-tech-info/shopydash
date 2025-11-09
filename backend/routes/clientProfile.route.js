const express = require("express");
const { protectRoute, verifyRole } = require("../middleware/auth.middleware");
const {
  createClientProfile,
  getClientProfile,
  updateClientProfile,
} = require("../controllers/clientProfile.controller");

const router = express.Router();

router.post(
  "/createClientProfile",
  protectRoute,
  verifyRole("client"),
  createClientProfile
);

router.get(
  "/getClientProfile",
  protectRoute,
  verifyRole("client"),
  getClientProfile
);
router.patch(
  "/updateClientProfile",
  protectRoute,
  verifyRole("client"),
  updateClientProfile
);
module.exports = router;
