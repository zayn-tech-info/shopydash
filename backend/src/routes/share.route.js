const express = require("express");
const { generateSharePreview } = require("../controllers/share.controller");

const router = express.Router();

router.get("/:slug", generateSharePreview);

module.exports = router;
