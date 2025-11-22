const globalErrorHandle = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "fail";

  res.status(statusCode).json({
    status: error.statusCode,
    message: error.message,
  });
};
