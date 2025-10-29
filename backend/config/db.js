const mongoose = require("mongoose");

const connectDB = () => {
  try {
    mongoose.connect(process.env.CONNECTION_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.log(`An error occurred: ${error}`);
    process.exit(1);
  }
};

module.exports = connectDB;
