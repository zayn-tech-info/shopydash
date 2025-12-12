/**
 * Validates required environment variables on startup
 * Prevents the application from running with missing critical configuration
 */
const validateEnv = () => {
  const required = [
    "CONNECTION_URI",
    "JWT_SECRET_KEY",
    "CLOUDINARY_NAME",
    "CLOUDINARYAPI_KEY",
    "CLOUDINARYAPI_API_SECRET",
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
    console.error(
      "⚠️  Warning: JWT_SECRET_KEY should be at least 32 characters for better security"
    );
  }

  console.log("✅ Environment variables validated successfully");
};

module.exports = validateEnv;
