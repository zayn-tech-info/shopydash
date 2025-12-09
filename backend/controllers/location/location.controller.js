const asyncErrorHandler = require("../../errors/asyncErrorHandle");
const User = require("../../models/auth.model");
const School = require("../../models/school.model");
const SchoolArea = require("../../models/schoolArea.model");

const initialSchoolData = {
  "Ladoke Akintola University of Technology": [
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
  "University of Lagos": [
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
  "University of Ibadan": [
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
  "Obafemi Awolowo University": [
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
    "Oduduwa Estate",
    "Damico Area",
    "Parakin Estate",
    "Omole",
  ],
  "Federal University of Technology Akure": [
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
  "University of Ilorin": [
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
  "Covenant University": ["Canaanland", "Ota", "Iju", "Atan", "Bells"],
  "Bayero University Kano": ["Danbare", "Rimin Gata", "Kofar Famfo", "Campus"],
  "Ahmadu Bello University": ["Samaru", "Kongo", "Zaria City", "Giwa"],
  "Landmark University": ["Omu-Aran", "Campus"],
  "University of Nigeria Nsukka": [
    "Nsukka",
    "Odim Gate",
    "Beach",
    "Hilltop",
    "Behind Flat",
    "Enugu Campus",
  ],
  "Federal University of Technology Minna": [
    "Bosso",
    "Gidan Kwano",
    "Lut",
    "Maikunkele",
  ],
  "University of Benin": ["Ekosodin", "BDPA", "Ugbowo", "June 12", "Ekenwan"],
  "University of Port Harcourt": [
    "Choba",
    "Alakahia",
    "Rumuekini",
    "Ofrima",
    "Abuja Campus",
  ],
  "Lagos State University": [
    "Iyana Iba",
    "Ojo",
    "Igando",
    "Okokomaiko",
    "Epe Campus",
  ],
  "Federal University of Agriculture Abeokuta": [
    "Camp",
    "Obantoko",
    "Alabata",
    "Isolu",
  ],
  "Afe Babalola University": ["Erinfun", "Poly Road", "Ado Ekiti", "Campus"],
  "Ekiti State University": ["Iworoko", "Osekita", "Ado Ekiti"],
  "Federal University of Technology Owerri": [
    "Ihiagwa",
    "Eziobodo",
    "Umuchima",
    "Obinze",
  ],
  "Federal University of Oye Ekiti": ["Oye Ekiti", "Ikole Ekiti", "Ayegbaju"],
  "Nnamdi Azikiwe University": ["Ifite", "Aroma", "Temp Site", "Okofia"],
  "Usmanu Danfodiyo University Sokoto": ["Sokoto", "Dundaye", "Wamakko"],
  "Abia State University": ["Uturu", "Okigwe"],
  "Kwara State University": ["Malete", "Shao", "Ilorin"],
  "University of Calabar": ["Etta Agbor", "Satellie Town", "Calabar"],
  "University of Jos": ["Bauchi Ring Road", "Farin Gada", "Rusau"],
  "University of Uyo": ["Ikpa Road", "Use Offot", "Itam"],
  "Rivers State University": ["Nkpolu", "Diobu", "Mile 3"],
  "Olabisi Onabanjo University": ["Ago Iwoye", "Oru", "Ijebu Igbo"],
  "University of Abuja": ["Gwagwalada", "Giri", "Mini Campus"],
};

const seedDatabase = async () => {
  try {
    const schoolCount = await School.countDocuments();
    if (schoolCount === 0) {
      console.log("Seeding Schools...");
      for (const [schoolName, areas] of Object.entries(initialSchoolData)) {
        await School.create({ name: schoolName });
        for (const area of areas) {
          await SchoolArea.create({ name: area, schoolName: schoolName });
        }
      }
      console.log("Seeding Complete.");
    }
  } catch (error) {
    console.error("Seeding error:", error);
  }
};

seedDatabase();

const getSchools = asyncErrorHandler(async (req, res, next) => {
  const { search } = req.query;
  const query = {};

  if (search) {
    query.name = { $regex: search, $options: "i" };
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
    matchStage.name = { $regex: search, $options: "i" };
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
    userMatch.area = { $regex: search, $options: "i" };
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

  // Normalize
  // Title Case logic: "under g" -> "Under G"
  const normalizedArea = areaName
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Check existence
  const existing = await SchoolArea.findOne({
    schoolName,
    name: { $regex: new RegExp(`^${normalizedArea}$`, "i") },
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
