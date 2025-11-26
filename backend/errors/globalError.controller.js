const customError = require("./customError");

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

const globalErrorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "production") {
    if (error.name === "castError") error = castErrorHandler(error);
    if (error.code === 11000) error = duplicateKeyErrorHandler(error);
    if (error.name === "ValidationError") error = validationErrorHandler(error);
    prodErrors(res, error);
  } else if (process.env.NODE_ENV === "development") {
    if (error.name === "ValidationError") validationErrorHandler(error);
    devErrors(res, error);
  }
};

module.exports = globalErrorHandler;
