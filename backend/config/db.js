const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.CONNECTION_URI;
  if (!uri) {
    console.error(
      "CONNECTION_URI is not set. Set it in your .env or environment variables."
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
