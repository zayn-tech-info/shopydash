/**
 * Simple logging utility for consistent error and info logging
 * In production, consider using Winston or Pino for structured logging
 */

const NODE_ENV = process.env.NODE_ENV || "development";

/**
 * Log error messages
 * @param {string} context - Context where the error occurred
 * @param {Error|string} error - Error object or message
 */
const logError = (context, error) => {
  const timestamp = new Date().toISOString();
  const errorMessage = error instanceof Error ? error.message : error;
  const stackTrace = error instanceof Error ? error.stack : "";

  if (NODE_ENV === "development") {
    console.error(`[${timestamp}] [ERROR] ${context}:`, errorMessage);
    if (stackTrace) {
      console.error(stackTrace);
    }
  } else {
    // In production, log only essential info without stack traces
    console.error(
      JSON.stringify({
        timestamp,
        level: "error",
        context,
        message: errorMessage,
      })
    );
  }
};

/**
 * Log info messages
 * @param {string} context - Context of the log
 * @param {string} message - Info message
 */
const logInfo = (context, message) => {
  const timestamp = new Date().toISOString();

  if (NODE_ENV === "development") {
    console.log(`[${timestamp}] [INFO] ${context}:`, message);
  } else {
    console.log(
      JSON.stringify({
        timestamp,
        level: "info",
        context,
        message,
      })
    );
  }
};

/**
 * Log warning messages
 * @param {string} context - Context of the warning
 * @param {string} message - Warning message
 */
const logWarn = (context, message) => {
  const timestamp = new Date().toISOString();
  console.warn(
    JSON.stringify({
      timestamp,
      level: "warn",
      context,
      message,
    })
  );
};

module.exports = {
  logError,
  logInfo,
  logWarn,
};
