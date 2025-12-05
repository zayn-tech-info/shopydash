const mongoose = require("mongoose");
const validator = require("validator");

const VendorProfileAllowedPaymentMethods = [
  "bank_transfer",
  "paystack",
  "credit_card",
];

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
    country: {
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
    accountNumber: {
      type: String,
      trim: true,
    },
    paymentMethods: {
      type: [String],
      validate: {
        validator: function (methods) {
          return (
            Array.isArray(methods) &&
            methods.every((m) => VendorProfileAllowedPaymentMethods.includes(m))
          );
        },
        message: (props) =>
          `Invalid payment method(s): ${
            props.value
          }. Allowed values are: ${VendorProfileAllowedPaymentMethods.join(
            ", "
          )}.`,
      },
      default: [],
    },
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
