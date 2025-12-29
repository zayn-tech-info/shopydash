const mongoose = require("mongoose");
const customError = require("../errors/customError");
const { logInfo, logError } = require("../utils/logger");

const connectDB = async () => {
  const uri = process.env.CONNECTION_URI;

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
      family: 4,
    });
    logInfo("Database", "Database connected successfully");
  } catch (error) {
    const err = new customError(
      `Database connection error: ${error.message}`,
      500
    );
    logError("Database Connection", err);
    process.exit(1);
  }
};

module.exports = connectDB;
