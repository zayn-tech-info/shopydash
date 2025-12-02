const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const asyncErrorHandler = require("../../errors/asyncErrorHandle");
const customError = require("../../errors/customError");
const fs = require("fs");

 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARYAPI_KEY,
  api_secret: process.env.CLOUDINARYAPI_API_SECRET,
});
 
const storage = multer.diskStorage({});

 
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
    fileSize: 5 * 1024 * 1024,  
  },
});

 
const uploadImages = asyncErrorHandler(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next(new customError("Please upload at least one image", 400));
  }

  const fileUrls = [];

  for (const file of req.files) {
    const uploaded = await cloudinary.uploader.upload(file.path, {
      folder: "vendor/products",
      allowed_formats: ["jpeg", "jpg", "png", "webp"],
      transformation: [{ width: 1000, height: 1000, crop: "limit" }],
    });

    fileUrls.push(uploaded.secure_url);

    fs.unlinkSync(file.path);
  }

  res.status(200).json({
    success: true,
    message: "Images uploaded successfully",
    data: fileUrls,
  });
});

 
module.exports = {
  uploadMiddleware: upload.array("images", 6),
  uploadImages,
};
