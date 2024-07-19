const argon2 = require("argon2");
const mongoose = require("mongoose");
const jwtManager = require("../../../managers/jwtManager");
const emailManager = require("../../../managers/emailManager");

const userRegister = async (req, res) => {
  const usersModel = mongoose.model("users");

  const { name, email, password, confirm_password, balance } = req.body;

  // Validations
  if (!name) throw "Name must be provided";
  if (!email) throw "Email must be provided";
  if (!password) throw "Password must be provided";
  if (password.length < 6) throw "Password must be at least 6 characters";
  if (password !== confirm_password)
    throw "Password and confirm password does not match";
  if (!balance) throw "Balance must be provided";

  const getDuplicateEmail = await usersModel.findOne({
    email: email,
  });

  if (getDuplicateEmail) throw "This email is already in use";

  const hashedPassword = await argon2.hash(password);

  const createdUser = await usersModel.create({
    name: name,
    email: email,
    password: hashedPassword,
    balance: balance,
  });

  const accessToken = jwtManager(createdUser);

  await emailManager(
    createdUser,
    "Welcome to Expense Tracker PRO",
    "<h1>Welcome to Expense Tracker PRO</h1>",
    "Expense Tracker PRO"
  );

  res.status(201).json({
    status: "User registration successful",
    accessToken: accessToken,
  });
};

module.exports = userRegister;
