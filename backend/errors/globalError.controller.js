const customError = require("./customError");

// Allowed origins for CORS error responses
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://app.shopydash.com",
  "https://admin.shopydash.com",
  "https://shopydash.com",
  "https://www.shopydash.com",
  "https://admin.shopydash.com",
];
const vercelPattern = /^https:\/\/.*\.vercel\.app$/;

const setCorsHeaders = (req, res) => {
  const origin = req.headers.origin;
  if (origin && (allowedOrigins.includes(origin) || vercelPattern.test(origin))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
};

const devErrors = (res, error) => {
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
    stackTrace: error.stack,
    error,
  });
};

const prodErrors = (res, error) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
    });
  } else {
    res.status(500).json({
      success: false,
      message: "Something went wrong please try again later",
    });
  }
};

const castErrorHandler = (err) => {
  const msg = `Invalid value ${err.path} for field ${err.value}`;
  return new customError(msg, 400);
};

const duplicateKeyErrorHandler = (err) => {
  const field = err.keyValue ? Object.keys(err.keyValue)[0] : "field";
  const msg = `${field} already exist. Please use another ${field}!`;
  return new customError(msg, 400);
};

const validationErrorHandler = (err) => {
  const error = Object.values(err.errors);
  const msg = error.map((val) => val.message).join(". ");
  return new customError(`Invalid input data : ${msg}`, 400);
};

const tokenExpiredErrorHandler = (err) => {
  return new customError("Session expired, please login again", 401);
};

const globalErrorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  // Ensure CORS headers are set for error responses
  setCorsHeaders(req, res);

  if (error.name === "TokenExpiredError")
    error = tokenExpiredErrorHandler(error);

  if (process.env.NODE_ENV === "production") {
    if (error.name === "CastError") error = castErrorHandler(error);
    if (error.code === 11000) error = duplicateKeyErrorHandler(error);
    if (error.name === "ValidationError") error = validationErrorHandler(error);
    prodErrors(res, error);
  } else {
    // Development mode or any other mode
    if (error.name === "ValidationError") error = validationErrorHandler(error);
    devErrors(res, error);
  }
};

module.exports = globalErrorHandler;
