const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const authRouter = require("./routes/auth.route");
const vendorProfile = require("./routes/vendorProfle.route");

connectDB();
const app = express();

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/vendorProfile", vendorProfile);

module.exports = app;
