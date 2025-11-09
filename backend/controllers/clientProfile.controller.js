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

module.exports = { createClientProfile };
