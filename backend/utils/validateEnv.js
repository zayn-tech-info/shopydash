const { logInfo, logWarn } = require("./logger");

const validateEnv = () => {
  const required = [
    "JWT_SECRET_KEY",
    "RESEND_API_KEY",
  ];

  if (process.env.NODE_ENV === "production") {
    required.push("PAYSTACK_LIVE_SECRET_KEY");
  } else {
    required.push("PAYSTACK_TEST_SECRET_KEY");
  }

  const isProduction = process.env.NODE_ENV === "production";
  const hasDefaultUri = Boolean(process.env.CONNECTION_URI);
  const hasEnvUri = isProduction
    ? Boolean(process.env.CONNECTION_URI_PROD)
    : Boolean(process.env.CONNECTION_URI_DEV);

  if (!hasDefaultUri && !hasEnvUri) {
    required.push(isProduction ? "CONNECTION_URI_PROD" : "CONNECTION_URI_DEV");
  }

  const missing = [];

  for (const variable of required) {
    if (!process.env[variable]) {
      missing.push(variable);
    }
  }

  // Cloudinary: accept either old or new env names (must have one of each)
  const hasCloudName =
    process.env.CLOUDINARY_NAME || process.env.CLOUDINARY_CLOUD_NAME;
  const hasCloudKey =
    process.env.CLOUDINARYAPI_KEY || process.env.CLOUDINARY_API_KEY;
  const hasCloudSecret =
    process.env.CLOUDINARYAPI_API_SECRET || process.env.CLOUDINARY_API_SECRET;
  if (!hasCloudName) {
    missing.push("CLOUDINARY_NAME or CLOUDINARY_CLOUD_NAME");
  }
  if (!hasCloudKey) {
    missing.push("CLOUDINARYAPI_KEY or CLOUDINARY_API_KEY");
  }
  if (!hasCloudSecret) {
    missing.push("CLOUDINARYAPI_API_SECRET or CLOUDINARY_API_SECRET");
  }

  if (missing.length > 0) {
    console.error("❌ Missing required environment variables:");
    missing.forEach((variable) => console.error(`   - ${variable}`));
    console.error("\nPlease set these variables in your .env file");
    process.exit(1);
  }

  if (process.env.JWT_SECRET_KEY.length < 32) {
    logWarn(
      "Environment Validation",
      "JWT_SECRET_KEY should be at least 32 characters for better security"
    );
  }

  
  if (process.env.NODE_ENV === "production" && !process.env.COOKIE_DOMAIN) {
    logWarn(
      "Environment Validation",
      "COOKIE_DOMAIN is not set. Authentication cookies may not work across subdomains in production."
    );
  }

  logInfo(
    "Environment Validation",
    "Environment variables validated successfully"
  );
};

module.exports = validateEnv;
