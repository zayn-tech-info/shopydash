const customError = require("../errors/customError");




const csrfProtection = (req, res, next) => {
  
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }

  
  const mode = process.env.NODE_ENV || "development";
  const allowedOrigins = [
    mode === "development"
      ? "http://localhost:5173"
      : "https://vendora-app-rho.vercel.app",
  ];

  const origin = req.get("origin") || req.get("referer");

  
  
  
  const hasCustomHeader =
    req.get("X-Requested-With") === "XMLHttpRequest" ||
    req.get("Content-Type")?.includes("application/json");

  if (!hasCustomHeader && origin) {
    
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
