const asyncErrorHandler = require("../../errors/asyncErrorHandle");
const User = require("../../models/auth.model");

 
const schoolData = {
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

const getSchools = asyncErrorHandler(async (req, res, next) => {
  const schools = Object.keys(schoolData).sort();
  res.status(200).json({
    success: true,
    schools,
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
    matchStage.area = { $regex: search, $options: "i" };
  } else {
    matchStage.area = { $exists: true, $ne: "" };
  }

  let dbAreas = await User.find(matchStage).distinct("area");
  dbAreas = dbAreas.filter((a) => a && a.trim() !== "");

  let mappedAreas = [];

  const schoolKey = Object.keys(schoolData).find(
    (key) => key.toLowerCase() === schoolName.toLowerCase()
  );

  if (schoolKey) {
    mappedAreas = schoolData[schoolKey];
  } else {
 
    const normalizedSchoolName = schoolName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

    for (const [key, areas] of Object.entries(schoolData)) {
      const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (
        normalizedSchoolName.includes(normalizedKey) ||
        normalizedKey.includes(normalizedSchoolName)
      ) {
        // Be careful with short matches, but for Full Names it's safer
        if (normalizedSchoolName.length > 3) {
          mappedAreas = areas;
          break;
        }
      }
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
  getSchools,
};
