const mongoose = require("mongoose");

const productItemSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: [true, "Product title is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: [0, "Price cannot be negative"],
  },
  category: {
    type: String,
    required: [true, "Product category is required"],
    enum: [
      "Electronics",
      "Fashion",
      "Books",
      "Food & Beverages",
      "Sports & Fitness",
      "Health & Beauty",
      "Home & Living",
      "Stationery",
      "Services",
      "Other",
    ],
  },
  image: {
    type: String,
    required: [true, "Product image is required"],
  },
  stock: {
    type: Number,
    default: 1,
    min: [0, "Stock cannot be negative"],
  },
  condition: {
    type: String,
    enum: ["New", "Like New", "Good", "Fair", "Used"],
    default: "New",
  },
});

const vendorPostSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    caption: {
      type: String,
      required: [true, "Post caption is required"],
      trim: true,
    },
    products: {
      type: [productItemSchema],
      validate: {
        validator: function (v) {
          return v && v.length >= 4;
        },
        message: "You must upload at least 4 products per post",
      },
    },
    school: {
      type: String,
      required: true,
      index: true,
    },
    location: {
      type: String,
      required: [true, "Location is required (e.g., Under G)"],
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

vendorPostSchema.index({ school: 1, createdAt: -1 });

vendorPostSchema.statics.findBySchool = function (school) {
  return this.find({ school })
    .populate(
      "vendorId",
      "businessName fullName whatsAppNumber phoneNumber username profilePic"
    )
    .sort({ createdAt: -1 });
};

module.exports = mongoose.model("VendorPost", vendorPostSchema);
