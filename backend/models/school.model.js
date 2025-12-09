const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    state: {
      type: String,
      required: false,
    },
    abbr: {
      type: String,  
      trim: true,
    },
  },
  { timestamps: true }
);

const School = mongoose.model("School", schoolSchema);
module.exports = School;
