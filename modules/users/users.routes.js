const express = require("express");
const userRegister = require("./controllers/userRegister");
const userLogin = require("./controllers/userLogin");
const userDashboard = require("./controllers/userDashboard");
const auth = require("../../middleware/auth");
const forgotPassword = require("./controllers/forgotPassword");
const resetPassword = require("./controllers/resetPassword");

const userRoutes = express.Router();

// Routes
userRoutes.post("/register", userRegister);
userRoutes.post("/login", userLogin);

userRoutes.post("/forgotPassword", forgotPassword);
userRoutes.post("/resetPassword", resetPassword);

userRoutes.use(auth);

// Protected routes
userRoutes.get("/dashboard", userDashboard);

module.exports = userRoutes;
