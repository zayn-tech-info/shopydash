const express = require("express");
const {
  getSchoolAreas,
} = require("../controllers/location/location.controller");

const router = express.Router();

router.get("/areas", getSchoolAreas);

module.exports = router;
