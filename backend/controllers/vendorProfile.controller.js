const vendorProfileModel = require("../models/vendorProfile.model");

const createVendorProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const existingVendorProfile = await vendorProfileModel.findOne({
      id: userId,
    });

    if (existingVendorProfile) {
      return res.status(401).json({
        success: false,
        message: "Profile already exist for this vendor",
      });
    }

    const vendorProfile = await vendorProfileModel.create(req.body);
    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: {
        vendorProfile,
      },
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
    const userId = req.user_id;
    const vendorProfile = vendorProfileModel.findOne({ userId });

    if (!vendorProfile) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found",
      });
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


const updateVendorProfile = (req, res) => {

}
module.exports = { createVendorProfile, getVendorProfile };
