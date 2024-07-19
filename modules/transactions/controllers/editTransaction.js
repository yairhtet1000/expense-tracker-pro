const mongoose = require("mongoose");
const validator = require("validator");

const editTransaction = async (req, res) => {
  const transactionModel = mongoose.model("transactions");
  const usersModel = mongoose.model("users");

  const { transaction_id, remark, amount, transaction_type } = req.body;

  if (!transaction_id) throw "Transaction id is required";
  if (!remark) throw "Remark is required";
  if (!amount) throw "Amount is required";
  if (!transaction_type) throw "Transaction type is required";

  if (transaction_type !== "income" && transaction_type !== "expense")
    throw "Transaction type must be income or expense";

  if (!validator.isMongoId(transaction_id.toString()))
    throw "Please provide valid id";

  const getTransaction = await transactionModel.findOne({
    _id: transaction_id,
  });

  if (!getTransaction) throw "Transaction not found";

  await transactionModel.updateOne(
    {
      _id: transaction_id,
    },
    {
      amount,
      remark,
      transaction_type,
    },
    {
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "Transaction edited successfully",
  });
};

module.exports = editTransaction;
