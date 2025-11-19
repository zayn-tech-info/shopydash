const mongoose = require("mongoose");

const clientProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },

  fullName: {
    type: String,

    trim: true,
    minlength: 2,
    maxlength: 100,
  },
  username: {
    lowercase: true,
    type: String,
    unique: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
    maxlength: 24,
    validate: {
      validator: function (v) {
        if (!v) return false;
        return /^[0-9+()\-\s]{7,24}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  /*   gender: {
      type: String,
      enum: ["male", "female", "other"],
      lowercase: true,
    }, */

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
  schoolName: {
    type: String,
  },
  profileImage: {
    type: String,
    trim: true,
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

clientProfileSchema.index({ userId: 1 });

module.exports = mongoose.model("ClientProfile", clientProfileSchema);
