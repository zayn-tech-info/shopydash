const mongoose = require("mongoose");
const dns = require("dns");
const customError = require("../errors/customError");
const { logInfo, logError } = require("../utils/logger");


// dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
// dns.setDefaultResultOrder("ipv4first");

const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === "production";
  let uri =
    process.env.CONNECTION_URI ||
    (isProduction
      ? process.env.CONNECTION_URI_PROD
      : process.env.CONNECTION_URI_DEV);

  // Non-SRV URIs often have no database path (e.g. .../?ssl=...), so the driver uses "test".
  // If MONGODB_DATABASE is set, insert it so we connect to the correct database.
  const dbNameFromEnv = process.env.MONGODB_DATABASE;
  if (dbNameFromEnv && uri) {
    if (uri.includes("/?")) {
      uri = uri.replace("/?", `/${dbNameFromEnv}?`);
    } else if (uri.includes("?") && !uri.match(/\/[^/?]+\?/)) {
      uri = uri.replace("?", `/${dbNameFromEnv}?`);
    }
  }

  console.log("Connecting to MongoDB with URI:", uri);
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
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
