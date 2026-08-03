import serverError from "../utils/server-error.js";
import Transaction from "../models/transaction.model.js";

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user,
    }).sort({ date: -1 });
    return res.status(200).json({
      success: true,
      message: "Transactions fetched",
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    return serverError(error, res);
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findOne({
      _id: id,
      user: req.user,
    });
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Transaction fetched",
      transaction,
    });
  } catch (error) {
    return serverError(error, res);
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { title, note, amount, type, date, category } = req.body;
    const transaction = await Transaction.create({
      title,
      note,
      amount,
      type,
      date,
      category,
      user: req.user,
    });
    return res.status(201).json({
      success: true,
      message: "Transaction created",
      transaction,
    });
  } catch (error) {
    return serverError(error, res);
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findOneAndUpdate(
      {
        _id: id,
        user: req.user,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Transaction updated",
      transaction,
    });
  } catch (error) {
    return serverError(error, res);
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      user: req.user,
    });
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Transaction deleted",
      transaction,
    });
  } catch (error) {
    return serverError(error, res);
  }
};
