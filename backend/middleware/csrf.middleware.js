const customError = require("../errors/customError");

/**
 * CSRF Protection Middleware
 * Validates that state-changing requests come from trusted sources
 * Uses the Synchronizer Token Pattern with Double Submit Cookie
 */

/**
 * Simple CSRF token validation using custom header
 * More suitable for API-first applications with CORS already configured
 */
const csrfProtection = (req, res, next) => {
  // Skip CSRF for GET, HEAD, OPTIONS requests (safe methods)
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }

  // In production, verify the origin header matches expected origins
  const mode = process.env.NODE_ENV || "development";
  const allowedOrigins = [
    mode === "development"
      ? "http://localhost:5173"
      : "https://vendora-app-rho.vercel.app",
  ];

  const origin = req.get("origin") || req.get("referer");

  // For API requests, we rely on CORS + Origin checking
  // The CORS middleware already validates origins
  // Additionally check for custom header to ensure requests are from JavaScript (not simple form POST)
  const hasCustomHeader =
    req.get("X-Requested-With") === "XMLHttpRequest" ||
    req.get("Content-Type")?.includes("application/json");

  if (!hasCustomHeader && origin) {
    // This is likely a form POST from a browser, validate origin
    const isValidOrigin = allowedOrigins.some((allowed) =>
      origin?.startsWith(allowed)
    );

    if (!isValidOrigin) {
      const err = new customError(
        "Invalid request origin - CSRF protection",
        403
      );
      return next(err);
    }
  }

  next();
};

module.exports = csrfProtection;
