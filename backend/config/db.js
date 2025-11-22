const mongoose = require("mongoose");
const customError = require("../errors/customError");

const connectDB = async () => {
  const uri = process.env.CONNECTION_URI;
  if (!uri) {
    const err = new customError(
      "CONNECTION_URI is not set. Set it in your .env or environment variables.",
      500
    );
    console.error(err.message);
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("Database connected successfully");
  } catch (error) {
    const err = new customError(
      `Database connection error: ${error.message}`,
      500
    );
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
