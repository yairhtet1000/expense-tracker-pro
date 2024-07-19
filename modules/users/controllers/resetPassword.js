const mongoose = require("mongoose");
const argon2 = require("argon2");
const emailManager = require("../../../managers/emailManager");

const resetPassword = async (req, res) => {
  const usersModel = mongoose.model("users");

  const { email, reset_code, new_password } = req.body;

  if (!email) throw "Email is required";
  if (!reset_code) throw "Reset code is required";
  if (!new_password) throw "New password is required";
  if (new_password.length < 6)
    throw "New password's length must be at least 6 characters long";

  const getUserWithResetCode = await usersModel.findOne({
    email: email,
    reset_code: reset_code,
  });

  if (!getUserWithResetCode) throw "Reset code does not match";

  const hashedPassword = await argon2.hash(new_password);

  await usersModel.updateOne(
    {
      email: email,
    },
    {
      password: hashedPassword,
      reset_code: "",
    },
    {
      runValidators: true,
    }
  );

  await emailManager(
    email,
    "Your password is reset successfully",
    "<h1>Your password is successfully reset</h1>",
    "Expense Tracker PRO"
  );

  res.status(200).json({
    status: "success",
    message: "Password reset successful",
  });
};

module.exports = resetPassword;
