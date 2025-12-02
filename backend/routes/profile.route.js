const express = require("express");
const { protectRoute } = require("../middleware/auth.middleware");
const { getProfile } = require("../controllers/auth/profile.controller");

const router = express.Router();

router.get("/:username", getProfile);

module.exports = router;
