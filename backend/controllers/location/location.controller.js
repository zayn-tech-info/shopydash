const asyncErrorHandler = require("../../errors/asyncErrorHandle");
const User = require("../../models/auth.model");

const schoolAreaMap = {
  lautech: [
    "Under G",
    "Adenike",
    "Stadium",
    "Randa",
    "Takie",
    "Apake",
    "Orita Naira",
    "Isale General",
    "Yoaco",
    "Oke Ado",
    "1500 Area",
    "Phase 2",
    "School Area",
    "Under B",
    "Under C",
    "Under D",
    "Aroje",
    "Under G Extension",
    "General Area",
    "Under B Quarters",
    "Back Gate",
    "Oke Anu",
    "Oke Baale",
    "Oja Alegun",
    "Caretaker",
    "Masifa",
    "Sabo",
    "Agbowo",
    "Isale Afon",
    "Isale Ora",
    "Arowomole",
    "Oke Osapa",
    "Aba Afon",
    "Aaje",
    "Aba Odo",
    "Baaki",
    "Arowomole Housing",
    "Kasumu",
    "Oke Olola",
    "Obandi",
    "Ajaawa Road Axis",
    "Ikolaba",
    "NNPC Area",
    "Idi Oro",
    "Ogbagun",
    "Oke Alapata",
  ],
  unilag: [
    "Akoka",
    "Yaba",
    "Bariga",
    "Onike",
    "Iwaya",
    "Ebute Metta",
    "Surulere",
    "Jibowu",
    "Sabo",
    "Alagomeji",
    "Adekunle",
    "Abule Oja",
    "Abule Ijesha",
    "Fola Agoro",
    "Pedro",
    "Gbagada",
    "New Hall",
    "Moremi",
    "Mariere",
    "Jaja",
  ],
  ui: [
    "Agbowo",
    "Orogun",
    "Ojoo",
    "Sango",
    "Samonda",
    "Bodija",
    "Mokola",
    "Ajibode",
    "Apete",
    "Eleyele",
    "UI Gate",
    "UI Quarters",
    "Abadina",
  ],
  oau: [
    "Lagere",
    "Mayfair",
    "Asherifa",
    "Ede Road",
    "Modakeke",
    "Campus",
    "Opa",
    "Ibadan Road",
    "Sabo",
    "Moore",
    "Iloro",
  ],
  futa: [
    "South Gate",
    "North Gate",
    "West Gate",
    "Obanla",
    "Apatapiti",
    "FUTA Junc",
    "Akindeko",
    "Abiola",
    "Oja Oba",
    "Alagbaka",
  ],
  unilorin: [
    "Tanke",
    "Oke Odo",
    "Chapel",
    "Sanrab",
    "Tipper Garage",
    "Mark",
    "School Area",
    "Main Campus",
    "Challenge",
    "Post Office",
  ],
};

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
    matchStage.area = { $regex: search, $options: "i" };
  } else {
    matchStage.area = { $exists: true, $ne: "" };
  }

  let dbAreas = await User.find(matchStage).distinct("area");
  dbAreas = dbAreas.filter((a) => a && a.trim() !== "");

  const normalizedSchoolName = schoolName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  let mappedAreas = [];

  for (const [key, areas] of Object.entries(schoolAreaMap)) {
    if (normalizedSchoolName.includes(key)) {
      mappedAreas = areas;
      break;
    }
  }

  if (search) {
    const searchLower = search.toLowerCase();
    mappedAreas = mappedAreas.filter((a) =>
      a.toLowerCase().includes(searchLower)
    );
  }

  const combinedAreas = [...new Set([...dbAreas, ...mappedAreas])].sort();

  res.status(200).json({
    success: true,
    areas: combinedAreas,
  });
});

module.exports = {
  getSchoolAreas,
};
