const multer = require("multer");
const path = require("path");
const fs = require("fs");
const asyncErrorHandler = require("../errors/asyncErrorHandle");
const customError = require("../errors/customError");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new customError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

const uploadImages = asyncErrorHandler(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next(new customError("Please upload at least one image", 400));
  }

  // In a real production app, you would upload to Cloudinary here.
  // For now, we return the local paths.
  // We need to construct the full URL based on the server address
  const protocol = req.protocol;
  const host = req.get("host");

  const fileUrls = req.files.map((file) => {
    return `${protocol}://${host}/uploads/${file.filename}`;
  });

  res.status(200).json({
    success: true,
    message: "Images uploaded successfully",
    data: fileUrls,
  });
});

module.exports = {
  uploadMiddleware: upload.array("images", 5), // Allow up to 5 images
  uploadImages,
};
