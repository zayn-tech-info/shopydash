const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema(
  {
    fullName: {
      required: [true, "Full name is a required field"],
      type: String,
      trim: true,
      minlength: [4, "Full name must be at least 4 characters long"],
      maxlength: [100, "Full name cannot be more than 20 characters long"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "Username alread exist"],
      trim: true,
      minlength: [4, "Username must be at least 4 characters long"],
      maxlength: [100, "Usernane cannot be more than 20 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email alread exist"],
      trim: true,
      validate: {
        validator: function (v) {
          return validator.isEmail(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      unique: [true, "Phone number alread exist"],
      trim: true,
    },
    school: {
      type: String,
      required: [true, "Please enter your institution name"],
      trim: true,
    },
    schoolId: {
      type: Number,
      trim: true,
    },
    schoolEmail: {
      type: String,
      trim: true,
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
      required: [true, "Please enter your password"],
      trim: true,
    },
    role: {
      type: String,
      trim: true,
      enum: ["client", "vendor", "admin"],
      default: "client",
    },
    businessName: {
      type: String,
      unique: [
        true,
        "This Business name already exist, You no go like change am?",
      ],
      trim: true,
    },
    logo: {
      type: String,
      trim: true,
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

module.exports = mongoose.model("User", userSchema);
