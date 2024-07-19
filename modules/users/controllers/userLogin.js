const argon2 = require("argon2");
const mongoose = require("mongoose");
const jwtManager = require("../../../managers/jwtManager");

const userLogin = async (req, res) => {
  const usersModel = mongoose.model("users");

  const { email, password } = req.body;

  const getUser = await usersModel.findOne({
    email: email,
  });

  if (!getUser) throw "This email does not exist";

  const storedPassword = getUser.password;

  const verifyPassword = await argon2.verify(storedPassword, password);

  if (!verifyPassword) throw "Password is wrong";

  const accessToken = jwtManager(getUser);

  res.status(200).json({
    status: "success",
    message: "User login successful",
    accessToken: accessToken,
  });
};

module.exports = userLogin;
