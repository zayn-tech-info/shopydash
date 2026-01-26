const mongoose = require("mongoose");
const validator = require("validator");

const verificationTokenSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: [true, "Please provide an email"],
      validate: [validator.isEmail, "Please provide a valid email address"],
    },
    token: {
      type: String,
      required: true,
    },
    expires: {
      type: Date,
      required: true,
      default: () => Date.now() + 10 * 60 * 1000, 
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


verificationTokenSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("VerificationToken", verificationTokenSchema);
