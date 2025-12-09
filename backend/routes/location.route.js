const express = require("express");
const {
  getSchoolAreas,
  getSchools,
} = require("../controllers/location/location.controller");

const router = express.Router();

router.get("/areas", getSchoolAreas);
router.get("/schools", getSchools);

module.exports = router;
