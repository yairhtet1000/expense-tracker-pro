require("express-async-errors");
const express = require("express");
const cors = require("cors");
const errorHandler = require("./handlers/errorHandler");
const mongoose = require("mongoose");
const userRoutes = require("./modules/users/users.routes");
const transactionRoutes = require("./modules/transactions/transactions.routes");
const app = express();
require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_CONNECTION, {})
  .then(() => {
    console.log("Mongodb connection successful");
  })
  .catch(() => {
    console.log("Mongodb connection failed");
  });

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);

// Models initialization
require("./models/users.model");
require("./models/transactions.model");

// End of all routes
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "failed",
    message: "Not found",
  });
});

app.use(errorHandler);

app.listen(8000, () => {
  console.log("server is started");
});
