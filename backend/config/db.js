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
      // Connection pooling configuration for better performance
      maxPoolSize: 10, // Maximum number of connections in the pool
      minPoolSize: 2,  // Minimum number of connections in the pool
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
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
