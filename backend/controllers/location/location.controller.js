const asyncErrorHandler = require("../../errors/asyncErrorHandle");
const User = require("../../models/auth.model");
const School = require("../../models/school.model");
const SchoolArea = require("../../models/schoolArea.model");
const { createSafeRegex } = require("../../utils/regex");

const getSchools = asyncErrorHandler(async (req, res, next) => {
  const { search } = req.query;
  const query = {};

  if (search) {
    query.name = createSafeRegex(search);
  }

  const schools = await School.find(query).sort({ name: 1 });

  res.status(200).json({
    success: true,
    schools: schools.map((s) => s.name),
  });
});

const getSchoolAreas = asyncErrorHandler(async (req, res, next) => {
  const { schoolName, search } = req.query;

  if (!schoolName) {
    return res.status(200).json({
      success: true,
      areas: [],
    });
  }

  const matchStage = {
    schoolName: schoolName,
  };

  if (search) {
    matchStage.name = createSafeRegex(search);
  }

  let areas = await SchoolArea.find(matchStage).sort({ name: 1 });

  if (areas.length === 0) {
    const allSchoolNames = await SchoolArea.distinct("schoolName");

    const matchingSchool = allSchoolNames.find(
      (dbName) =>
        schoolName.toLowerCase().includes(dbName.toLowerCase()) ||
        dbName.toLowerCase().includes(schoolName.toLowerCase())
    );

    if (matchingSchool) {
      matchStage.schoolName = matchingSchool;
      areas = await SchoolArea.find(matchStage).sort({ name: 1 });
    }
  }

  let areaNames = areas.map((a) => a.name);

  const userMatch = { schoolName: schoolName };
  if (matchStage.schoolName && matchStage.schoolName !== schoolName) {
    userMatch.schoolName = matchStage.schoolName;
  }

  if (search) {
    userMatch.area = createSafeRegex(search);
  } else {
    userMatch.area = { $exists: true, $ne: "" };
  }

  const userAreas = await User.find(userMatch).distinct("area");

  const combined = [...new Set([...areaNames, ...userAreas])]
    .filter((a) => a && a.trim().length > 0)
    .sort();

  res.status(200).json({
    success: true,
    areas: combined,
  });
});

const addSchoolArea = asyncErrorHandler(async (req, res, next) => {
  const { schoolName, areaName } = req.body;

  if (!schoolName || !areaName) {
    return res.status(400).json({
      success: false,
      message: "School name and Area name are required",
    });
  }

  const normalizedArea = areaName
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const existing = await SchoolArea.findOne({
    schoolName,
    name: normalizedArea,
  });

  if (existing) {
    return res.status(200).json({
      success: true,
      message: "Area already exists",
      area: existing,
    });
  }

  const newArea = await SchoolArea.create({
    schoolName,
    name: normalizedArea,
  });

  res.status(201).json({
    success: true,
    message: "Area added successfully",
    area: newArea,
  });
});

module.exports = {
  getSchoolAreas,
  getSchools,
  addSchoolArea,
};
