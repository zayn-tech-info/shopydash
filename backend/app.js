const express = require("express");
const connectDB = require("./config/db");
const authRouter = require("./routes/auth.route");

connectDB();
const app = express();

app.use(express.json());
app.use("/api/v1/auth", authRouter);

module.exports = app;
