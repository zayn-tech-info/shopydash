const mongoose = require("mongoose");

const clientProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },

  address: {
    type: String,
    trim: true,
    maxlength: 300,
  },
  city: {
    type: String,
    trim: true,
    maxlength: 100,
  },
  state: {
    type: String,
    trim: true,
    maxlength: 100,
  },
  country: {
    type: String,
    trim: true,
    maxlength: 100,
    default: "Nigeria",
  },

  preferredCategory: {
    type: String,
    trim: true,
  },

  wishlist: [
    {
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      addedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  lastLogin: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ClientProfile", clientProfileSchema);
