const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema(
  {
    fullName: {
      required: [true, "Please provide your full name"],
      type: String,
      trim: true,
      minlength: [2, "Full name must be at least 2 characters long"],
      maxlength: [100, "Full name cannot exceed 100 characters"],
      validate: {
        validator: function (v) {
          return /^[a-zA-Z\s'-]+$/.test(v);
        },
        message:
          "Full name can only contain letters, spaces, hyphens, and apostrophes",
      },
    },
    username: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      validate: {
        validator: function (v) {
          return /^[a-z0-9_.]+$/.test(v);
        },
        message:
          "Username can only contain lowercase letters, numbers, underscores, and dots",
      },
    },
    email: {
      required: [true, "Please provide your email address"],
      type: String,
      unique: [
        true,
        "This email is already registered. Please use a different email or login.",
      ],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return validator.isEmail(v);
        },
        message:
          "Please provide a valid email address (e.g., user@example.com)",
      },
    },
    phoneNumber: {
      type: String,
      trim: true,
      unique: [
        true,
        "This phone number is already registered. Please use a different number.",
      ],
      sparse: true,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return /^(\+?\d{1,4}[\s-]?)?(\(?\d{1,4}\)?[\s-]?)?[\d\s-]{7,15}$/.test(
            v
          );
        },
        message:
          "Please provide a valid phone number (e.g., +234XXXXXXXXX or 080XXXXXXXX)",
      },
    },
    schoolName: {
      type: String,
      trim: true,
    },
    schoolId: {
      type: String,
      trim: true,
      unique: [
        true,
        "This School ID is already registered. Please verify your ID or contact support.",
      ],
      sparse: true,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return /^[A-Za-z0-9-/]+$/.test(v) && v.length >= 4 && v.length <= 20;
        },
        message:
          "School ID must be 4-20 characters and can only contain letters, numbers, hyphens, and slashes",
      },
    },
    schoolEmail: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return validator.isEmail(v);
        },
        message: "Please provide a valid school email address",
      },
    },
    profilePic: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
      required: [
        function () {
          return !this.isGoogleAuth;
        },
        "Please provide a password",
      ],
      minlength: [8, "Password must be at least 8 characters long"],
      validate: {
        validator: function (v) {
          if (!v || this.isGoogleAuth) return true;
          const hasUpperCase = /[A-Z]/.test(v);
          const hasLowerCase = /[a-z]/.test(v);
          const hasNumber = /\d/.test(v);
          const hasSpecialChar = /[@$!%*?&#^()_+=\-{}\[\]|:;"'<>,.~`]/.test(v);
          return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
        },
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#, etc.)",
      },
    },
    role: {
      type: String,
      trim: true,
      enum: {
        values: ["client", "vendor", "admin"],
        message: "Role must be either 'client', 'vendor', or 'admin'",
      },
      default: "client",
    },
    businessName: {
      type: String,
      unique: [
        true,
        "This business name is already registered. Please choose a different name for your business.",
      ],
      sparse: true,
      trim: true,
      minlength: [2, "Business name must be at least 2 characters long"],
      maxlength: [100, "Business name cannot exceed 100 characters"],
    },
    whatsAppNumber: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return /^(\+?\d{1,4}[\s-]?)?(\(?\d{1,4}\)?[\s-]?)?[\d\s-]{7,15}$/.test(
            v
          );
        },
        message: "Please provide a valid WhatsApp number (e.g., +234XXXXXXXX)",
      },
    },
    logo: {
      type: String,
      trim: true,
    },
    isGoogleAuth: {
      type: Boolean,
      default: false,
    },
    profileComplete: {
      type: Boolean,
      default: false,
    },
    passwordChangedAt: {
      type: Date,
    },
    state: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    schoolArea: {
      type: String,
      trim: true,
    },
    area: {
      type: String,
      trim: true,
    },
    subscriptionPlan: {
      type: String,
      enum: ["Shopydash Boost", "Shopydash Pro", "Shopydash Max"],
      default: null,
    },
    subscriptionExpiresAt: {
      type: Date,
    },
    isSubscriptionActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (userPassword) {
  if (!this.password) return false;
  return bcrypt.compare(userPassword, this.password);
};

userSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );
};

userSchema.methods.comparePasswordInDb = async function (password) {
  if (!this.password) {
    throw new Error(
      "No password set for this user. Please use the appropriate login method."
    );
  }
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.isPasswordChanged = function (jwtTimeStamp) {
  if (!this.passwordChangedAt) return false;

  const passwordChangedTimeStamp = this.passwordChangedAt
    ? parseInt(this.passwordChangedAt.getTime() / 1000, 10)
    : 0;

  return jwtTimeStamp < passwordChangedTimeStamp;
};

userSchema.index({ role: 1 });

module.exports = mongoose.model("User", userSchema);
