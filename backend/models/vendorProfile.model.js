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
    businessName: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      sparse: true,
    },
    storeUsername: {
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
    phoneNumber: {
      type: String,
      unique: true,
      trim: true,
    },
    whatsAppNumber: {
      type: String,
      unique: true,
      trim: true,
      sparse: true,
    },
    email: {
      type: String,
      sparse: true,
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          return validator.isEmail(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    profileImage: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    address: String,
    state: String,
    city: String,
    country: String,
    /*     mapLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
 */
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
    schoolName: {
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
      validate: {
        validator: function (v) {
          return /^\d{8,20}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid account number!`,
      },
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
    settings: {
      notifications: { type: Boolean, default: true },
      autoReply: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("VendorProfile", vendorProfileSchema);
