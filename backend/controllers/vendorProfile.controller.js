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
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const getVendorProfile = async (req, res) => {
  try {
    const { id } = req.params || {};

    let vendorProfile;
    if (id) {
      vendorProfile = await vendorProfileModel.findOne({ userId: id });
    } else {
      const userId = req.user && req.user._id;
      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }
      vendorProfile = await vendorProfileModel.findOne({ userId });
    }

    if (!vendorProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor profile not found" });
    }

    res.status(200).json({ success: true, data: { vendorProfile } });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};

const updateVendorProfile = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const updated = await vendorProfileModel.findOneAndUpdate(
      { userId },
      { $set: req.body },
      { new: true }
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
    res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};

module.exports = { createVendorProfile, getVendorProfile, updateVendorProfile };
