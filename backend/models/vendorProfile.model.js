const mongoose = require("mongoose");
const validator = require("validator");

const vendorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    storeUsername: {
      lowercase: true,
      type: String,
      unique: true,
      sparse: true,
    },
    storeDescription: {
      type: String,
    },
    businessCategory: {
      type: String,
    },

    coverImage: {
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    lga: {
      type: String,
    },
    area: {
      type: String,
    },

    website: {
      type: String,
      lowercase: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "active",
    },
    rating: {
      type: Number,
      default: 0,
    },
    totalSales: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    socialLinks: {
      instagram: String,
      facebook: String,
      twitter: String,
    },
  },
  {
    timestamps: true,
  }
);

vendorProfileSchema.index({ userId: 1 });
vendorProfileSchema.index({ storeUsername: 1 });
vendorProfileSchema.index({ businessCategory: 1 });
vendorProfileSchema.index({ isVerified: 1 });

module.exports = mongoose.model("VendorProfile", vendorProfileSchema);
