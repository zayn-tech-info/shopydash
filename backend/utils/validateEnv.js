const { logInfo, logWarn } = require("./logger");

const validateEnv = () => {
  const required = [
    "CONNECTION_URI",
    "JWT_SECRET_KEY",
    "CLOUDINARY_NAME",
    "CLOUDINARYAPI_KEY",
    "CLOUDINARYAPI_API_SECRET",
    "PAYSTACK_LIVE_SECRET_KEY",
    "RESEND_API_KEY",
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
