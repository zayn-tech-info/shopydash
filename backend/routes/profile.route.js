const express = require("express");
const { protectRoute } = require("../middleware/auth.middleware");
const { get } = require("../controllers/auth/profile.controller");

const profileRouter = express.Router();

profileRouter.get("/:username", get);

module.exports = profileRouter;
