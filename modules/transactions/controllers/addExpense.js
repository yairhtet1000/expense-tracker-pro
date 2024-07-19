const mongoose = require("mongoose");
const validator = require("validator");

const addExpense = async (req, res) => {
  const usersModel = mongoose.model("users");
  const transactionModel = mongoose.model("transactions");

  const { amount, remark } = req.body;

  if (!amount) throw "Amount is required";
  if (!validator.isNumeric(amount.toString()))
    throw "Amount must be valid number";
  if (amount < 0) throw "Amount can not be negative";

  if (!remark) throw "Remark is required";
  if (remark.length < 5) throw "Remark must be at least 5 characters long";

  await transactionModel.create({
    user_id: req.user._id,
    amount: amount,
    transaction_type: "expense",
    remark: remark,
  });

  await usersModel.updateOne(
    {
      _id: req.user._id,
    },
    {
      $inc: {
        balance: amount * -1,
      },
    },
    {
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Expense added successfully",
  });
};

module.exports = addExpense;
