const clientProfileSchema = require("../models/clientProfile.model");

/* 
1. Verify client authentication (check JWT or session).
2. Check if client profile already exists.
3.
4. Create a new ClientProfile object with the provided data.
5. Return success response with created profile data. */

const createClientProfile = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    const existingClientProfile = await clientProfileSchema.findOne({ userId });

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (existingClientProfile) {
      return res.status(400).json({
        success: false,
        message: "Profile already exist",
      });
    }

    const payload = { ...req.body, userId };

    const clientProfile = await clientProfileSchema.create(payload);

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: {
        clientProfile,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// 1. Verify client authentication (check JWT or session).
// 2. Extract userId from authenticated user.`
// 3. Query database for profile matching userId.
// 4. If profile not found, return “Profile not found” response.
// 5. If found, return profile data in success response.

const getClientProfile = async (req, res) => {
  try {
    const userId = req.user && req.user._id;

    const clientProfile = await clientProfileSchema.findOne({ userId });

    if (!clientProfile) {
      return res.status(404).json({
        success: true,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        clientProfile,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// Verify client authentication (check JWT or session).
// Extract userId from authenticated user.
// Check if client profile exists for userId.
// If not found, return “Profile not found” response.
// Validate incoming update data.
// Update profile fields with new data.
// Save updated profile to database.
// Return success response with updated profile data.

const updateClientProfile = async (req, res) => {
  try {
    const userId = req.user && req.user._id;

    const clientProfile = await clientProfileSchema.findOne({ userId });
    if (!clientProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found ",
      });
    }

    const updatedClientProfile = await clientProfileSchema.findOneAndUpdate(
      { userId },
      { $set: req.body },
      { new: true, runValidators: true, upsert: false }
    );

    res.status(200).json({
      success: true,
      data: {
        updatedClientProfile,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

module.exports = { createClientProfile, getClientProfile, updateClientProfile };
