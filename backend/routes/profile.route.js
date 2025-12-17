const express = require("express");
const { get } = require("../controllers/auth/profile.controller");

const profileRouter = express.Router();

profileRouter.get("/:username", get);

module.exports = profileRouter;
