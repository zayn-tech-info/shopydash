const customError = require("../errors/customError");

const csrfProtection = (req, res, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }

  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "https://shopydash-v1.vercel.app",
    "https://app.shopydash.com",
    "https://admin.shopydash.com",
    "https://shopydash.com",
    "https://www.shopydash.com",
  ];

  const origin = req.get("origin") || req.get("referer");

  const hasCustomHeader =
    req.get("X-Requested-With") === "XMLHttpRequest" ||
    req.get("Content-Type")?.includes("application/json");

  if (!hasCustomHeader && origin) {
    const isValidOrigin = allowedOrigins.some((allowed) =>
      origin?.startsWith(allowed),
    );

    if (!isValidOrigin) {
      const err = new customError(
        "Invalid request origin - CSRF protection",
        403,
      );
      return next(err);
    }
  }

  next();
};

module.exports = csrfProtection;
