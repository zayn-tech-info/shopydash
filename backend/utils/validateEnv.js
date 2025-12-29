const { logInfo, logWarn } = require("./utils/logger");
 
const validateEnv = () => {
  const required = [
    "CONNECTION_URI",
    "JWT_SECRET_KEY",
    "CLOUDINARY_NAME",
    "CLOUDINARYAPI_KEY",
    "CLOUDINARYAPI_API_SECRET",
    "PAYSTACK_TEST_SECRET_KEY",
  ];

  const missing = [];

  for (const variable of required) {
    if (!process.env[variable]) {
      missing.push(variable);
    }
  }

  if (missing.length > 0) {
    console.error("❌ Missing required environment variables:");
    missing.forEach((variable) => console.error(`   - ${variable}`));
    console.error("\nPlease set these variables in your .env file");
    process.exit(1);
  }

  // Validate JWT_SECRET_KEY strength
  if (process.env.JWT_SECRET_KEY.length < 32) {
    logWarn(
      "Environment Validation",
      "JWT_SECRET_KEY should be at least 32 characters for better security"
    );
  }

  logInfo("Environment Validation", "Environment variables validated successfully");
};

module.exports = validateEnv;
