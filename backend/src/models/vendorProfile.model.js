const mongoose = require("mongoose");
const validator = require("validator");

const vendorProfileSchema = new mongoose.Schema(
  {
    // One vendor profile per user. Ensure no duplicate userId in DB before deployment.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    businessCategory: {
      type: [String],
      default: [],
    },

    sellingDuration: {
      type: String,
    },

    offersDelivery: {
      type: Boolean,
      default: false,
    },

    website: {
      type: String,
      lowercase: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    activeStatus: {
      type: String,
      default: "active",
    },

    kycStatus: {
      type: String,
      enum: ["pending", "verified", "failed", "none"],
      default: "none",
    },

    rating: {
      type: Number,
      default: 0,
    },

    totalSales: {
      type: Number,
      default: 0,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    products: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
      default: [],
    },

    socialLinks: {
      type: {
        instagram: String,
        facebook: String,
        twitter: String,
      },
      default: {},
    },
    coverImage: {
      type: String,
      default: null,
    },
    bankDetails: {
      bankName: String,
      bankCode: String,
      accountNumber: String,
      accountName: String,
      subaccountCode: {
        type: String,
        select: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

vendorProfileSchema.index({ businessCategory: 1 });
vendorProfileSchema.index({ isVerified: 1 });

module.exports = mongoose.model("VendorProfile", vendorProfileSchema);
