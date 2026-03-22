const mongoose = require("mongoose");

const schoolAreaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    schoolName: {
      type: String,
      required: true,
    },
    location: {
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
  },
  { timestamps: true }
);

schoolAreaSchema.index({ schoolName: 1, name: 1 }, { unique: true });

const SchoolArea = mongoose.model("SchoolArea", schoolAreaSchema);
module.exports = SchoolArea;
