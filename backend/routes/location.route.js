const express = require("express");
const {
  getSchoolAreas,
  getSchools,
  addSchoolArea,
} = require("../controllers/location/location.controller");

const locationRouter = express.Router();

locationRouter.get("/areas", getSchoolAreas);
locationRouter.post("/areas", addSchoolArea);
locationRouter.get("/schools", getSchools);

module.exports = locationRouter;
