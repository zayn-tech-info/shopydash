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
      "Clothes",
      "Perfumes",
      "Wristwatches",
      "Gadgets / Appliances",
      "Footwears",
      "Bags",
      "Groceries",
      "Beauty / Skincare",
      "Accessories",
      "Textbooks / Stationaries",
      "Services",
      "Phones & Tablets",
      "Home & Living",
      "Sports & Fitness",
      "Food & Beverages",
      "Art & Crafts",
      "Health & Wellness",
      "Gaming",
      "Furniture & Decor",
      "Party & Events",
      "Baby & Kids",
      "Books & Media",
      "Others",
    ],
  },
  image: {
    type: String,
    required: [true, "Product image is required"],
  },
  images: {
    type: [String],
    default: [],
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
  slug: {
    type: String,
    index: true,
  },
  dealFlash: {
    active: { type: Boolean, default: false },
    dealPrice: { type: Number, min: 0 },
    expiresAt: { type: Date },
  },
});

const slugify = require("slugify");
const crypto = require("crypto");

productItemSchema.pre("save", function (next) {
  if (this.isModified("title") || !this.slug) {
    const baseSlug = slugify(this.title, { lower: true, strict: true });
    const shortId = crypto.randomBytes(3).toString("hex");
    this.slug = `${baseSlug}-${shortId}`;
  }
  next();
});

const vendorPostSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    products: {
      type: [productItemSchema],
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
    state: {
      type: String,
      trim: true,
    },

    area: {
      type: String,
      trim: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

vendorPostSchema.index({ school: 1, createdAt: -1 });
vendorPostSchema.index({ area: 1, createdAt: -1 });
vendorPostSchema.index({ state: 1, area: 1 });
vendorPostSchema.index({
  "products.title": "text",
  "products.description": "text",
});

vendorPostSchema.statics.findBySchool = function (school) {
  return this.find({ school })
    .populate(
      "vendorId",
      "businessName fullName phoneNumber username profilePic",
    )
    .sort({ createdAt: -1 });
};

module.exports = mongoose.model("VendorPost", vendorPostSchema);
