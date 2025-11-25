const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const globalErrorHandler = require("./errors/globalError.controller");
const customError = require("./errors/customError");

const authRouter = require("./routes/auth.route");
const vendorProfile = require("./routes/vendorProfle.route");
const clientProfile = require("./routes/clientProfile.route");

connectDB();
const app = express();

const mode = process.env.NODE_ENV || "development";

const frontendOrigin =
  mode === "development"
    ? "http://localhost:5173"
    : "https://vendora-app-rho.vercel.app";

app.use(
  cors({
    origin: frontendOrigin,
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/vendorProfile", vendorProfile);
app.use("/api/v1/clientProfile", clientProfile);

app.all(/(.*)/, (req, res, next) => {
  /*   res.status(404).json({
    success: false,
    message: `Could find ${req.originalUrl} on the server`,
  }); */
  const err = new customError(`Could find ${req.originalUrl} on the server`);
  next(err);
});

app.use(globalErrorHandler);

module.exports = app;
