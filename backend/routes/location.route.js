const express = require("express");
const {
  getSchoolAreas,
  getSchools,
  addSchoolArea,
} = require("../controllers/location/location.controller");

const router = express.Router();

router.get("/areas", getSchoolAreas);
router.post("/areas", addSchoolArea);
router.get("/schools", getSchools);

module.exports = router;
