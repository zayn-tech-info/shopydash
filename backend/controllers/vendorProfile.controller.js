const vendorProfileModel = require("../models/vendorProfile.model");

const createVendorProfile = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const existingVendorProfile = await vendorProfileModel.findOne({ userId });

    if (existingVendorProfile) {
      return res.status(400).json({
        success: false,
        message: "Profile already exists for this vendor",
      });
    }

    const payload = { ...req.body, userId };

    const vendorProfile = await vendorProfileModel.create(payload);

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: { vendorProfile },
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists. Please choose another one.`,
      });
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages[0] || "Validation error",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const getVendorProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const vendorProfile = await vendorProfileModel.findOne({ userId });

    if (!vendorProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor profile not found" });
    }

    res.status(200).json({
      success: true,
      data: {
        vendorProfile,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const getPublicVendorProfile = async (req, res) => {
  try {
    const storeUsername = req.params.storeUsername;

    if (!storeUsername) {
      return res.status(400).json({
        success: false,
        message: "storeUsername is required",
      });
    }

    const vendorProfile = await vendorProfileModel.findOne({
      storeUsername: storeUsername,
    });

    if (!vendorProfile) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found",
      });
    }
    res.status(200).json({ success: true, data: { vendorProfile } });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const updateVendorProfile = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const vendorProfile = await vendorProfileModel.findOne({ userId });

    if (!vendorProfile) {
      return res.status(200).json({
        success: false,
        message: "Profile not found",
      });
    }
    const updated = await vendorProfileModel.findOneAndUpdate(
      { userId },
      { $set: req.body },
      { new: true, runValidators: true, upsert: false }
    );

    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });

    res.status(200).json({
      success: true,
      message: "Profile updated",
      data: { vendorProfile: updated },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages[0] || "Validation error",
      });
    }
    res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};

module.exports = {
  createVendorProfile,
  getVendorProfile,
  getPublicVendorProfile,
  updateVendorProfile,
};
