const express = require("express");
const multer = require("multer");
const asyncErrorHandler = require("../errors/asyncErrorHandle");
const customError = require("../errors/customError");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARYAPI_KEY,
  api_secret: process.env.CLOUDINARYAPI_API_SECRET,
});

const uploadMultiple = asyncErrorHandler(async (req, res, next) => {
  const images = req.files;

  if (!images || images.length === 0) {
    return next(new customError("No files uploaded", 400));
  }

  const imagesUrls = [];
  
  for (const image of images) {
    const result = await cloudinary.uploader.upload(image.path, {
      resource_type: "auto",
    });

    imagesUrls.push(result.secure_url);
  }

  res.status(200).json({
    success: true,
    message: "Images uploaded successfully",
    data: { urls: imagesUrls },
  });
});

module.exports = { uploadMultiple };
