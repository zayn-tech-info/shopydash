const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Product must be associated with a vendor"],
      validate: {
        validator: async function (vendorId) {
          const User = mongoose.model("User");
          const vendor = await User.findById(vendorId);
          return vendor && vendor.role === "vendor";
        },
        message: "Invalid vendor ID or user is not a vendor",
      },
    },
    title: {
      type: String,
      required: [true, "Please provide a product title"],
      trim: true,
      minlength: [3, "Product title must be at least 3 characters long"],
      maxlength: [200, "Product title cannot exceed 200 characters"],
      index: true, 
    },
    description: {
      type: String,
      required: [true, "Please provide a product description"],
      trim: true,
      minlength: [
        10,
        "Product description must be at least 10 characters long",
      ],
      maxlength: [2000, "Product description cannot exceed 2000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a product price"],
      min: [0, "Price cannot be negative"],
      validate: {
        validator: function (v) {
          return Number.isFinite(v) && v >= 0;
        },
        message: "Please provide a valid price",
      },
    },
    category: {
      type: String,
      required: [true, "Please select a product category"],
      trim: true,
      enum: {
        values: [
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
        message: "Please select a valid category",
      },
      index: true, // For faster filtering by category
    },
    images: {
      type: [String],
      validate: {
        validator: function (v) {
          return v && v.length > 0 && v.length <= 10;
        },
        message: "Please provide at least 1 and at most 10 product images",
      },
      required: [true, "Please provide at least one product image"],
    },
    school: {
      type: String,
      required: [true, "Please specify the school/campus"],
      trim: true,
      index: true, // For faster filtering by school
    },
    location: {
      type: String,
      required: [true, "Please specify the exact location within the school"],
      trim: true,
      minlength: [2, "Location description must be at least 2 characters long"],
      maxlength: [200, "Location description cannot exceed 200 characters"],
      // Examples: "North Gate", "Phase 2", "Block A", "Near Library"
    },
    hostelName: {
      type: String,
      trim: true,
      maxlength: [100, "Hostel name cannot exceed 100 characters"],
      // Optional field for closer distance validation
    },
    stock: {
      type: Number,
      required: [true, "Please specify the available stock quantity"],
      min: [0, "Stock cannot be negative"],
      default: 0,
      validate: {
        validator: function (v) {
          return Number.isInteger(v) && v >= 0;
        },
        message: "Stock must be a non-negative integer",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
      // Vendors can deactivate products without deleting them
    },
    views: {
      type: Number,
      default: 0,
      min: [0, "Views cannot be negative"],
    },
    // Additional fields for enhanced functionality
    condition: {
      type: String,
      enum: {
        values: ["New", "Like New", "Good", "Fair", "Used"],
        message: "Please select a valid condition",
      },
      default: "New",
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          return v.length <= 10;
        },
        message: "Cannot have more than 10 tags",
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Indexes for efficient querying
productSchema.index({ vendorId: 1, createdAt: -1 }); // Get vendor's products sorted by date
productSchema.index({ school: 1, category: 1 }); // Filter by school and category
productSchema.index({ school: 1, location: 1 }); // Filter by school and location
productSchema.index({ title: "text", description: "text" }); // Text search on title and description
productSchema.index({ isActive: 1, stock: 1 }); // Filter active products with stock

// Virtual for checking if product is in stock
productSchema.virtual("inStock").get(function () {
  return this.stock > 0;
});

// Pre-save middleware to ensure stock consistency
productSchema.pre("save", function (next) {
  // If stock is 0 or less, you might want to deactivate the product
  if (this.stock <= 0 && this.isActive) {
    // Optional: Auto-deactivate when out of stock
    // this.isActive = false;
  }
  next();
});

// Instance method to check if vendor owns this product
productSchema.methods.isOwnedBy = function (userId) {
  return this.vendorId.toString() === userId.toString();
};

// Instance method to increment views
productSchema.methods.incrementViews = async function () {
  this.views += 1;
  return await this.save();
};

// Instance method to update stock
productSchema.methods.updateStock = async function (quantity) {
  if (this.stock + quantity < 0) {
    throw new Error("Insufficient stock");
  }
  this.stock += quantity;
  return await this.save();
};

// Static method to get active products by school
productSchema.statics.findBySchool = function (school, options = {}) {
  const query = { school, isActive: true, stock: { $gt: 0 } };

  if (options.category) {
    query.category = options.category;
  }

  if (options.location) {
    query.location = options.location;
  }

  return this.find(query)
    .populate("vendorId", "businessName fullName whatsAppNumber phoneNumber")
    .sort({ createdAt: -1 });
};

// Static method to get vendor's products
productSchema.statics.findByVendor = function (
  vendorId,
  includeInactive = false
) {
  const query = { vendorId };

  if (!includeInactive) {
    query.isActive = true;
  }

  return this.find(query).sort({ createdAt: -1 });
};

// Static method to search products
productSchema.statics.searchProducts = function (searchTerm, school) {
  return this.find({
    $text: { $search: searchTerm },
    school,
    isActive: true,
    stock: { $gt: 0 },
  })
    .populate("vendorId", "businessName fullName whatsAppNumber phoneNumber")
    .sort({ score: { $meta: "textScore" } });
};

module.exports = mongoose.model("Product", productSchema);
