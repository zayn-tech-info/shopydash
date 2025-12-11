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

const storage = multer.memoryStorage();

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

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "vendor/products",
        allowed_formats: ["jpeg", "jpg", "png", "webp"],
        transformation: [{ width: 1000, height: 1000, crop: "limit" }],
        resource_type: "auto",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

const uploadImages = asyncErrorHandler(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next(new customError("Please upload at least one image", 400));
  }

  if (req.files.length > 10) {
    return next(
      new customError("Maximum of 10 images allowed per upload", 400)
    );
  }

  const uploadPromises = req.files.map((file) =>
    uploadToCloudinary(file.buffer)
  );

  const uploadedResults = await Promise.all(uploadPromises);
  const fileUrls = uploadedResults.map((result) => result.secure_url);

  res.status(200).json({
    success: true,
    message: "Images uploaded successfully",
    data: fileUrls,
  });
});

module.exports = {
  uploadMiddleware: upload.array("images", 6),
  changeAvatar: upload.single("avatar"),
  uploadImages,
  cloudinary,
};
