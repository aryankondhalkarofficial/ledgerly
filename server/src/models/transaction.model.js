import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [2, "Title should be at least 2 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
      trim: true,
    },
    note: {
      type: String,
      minlength: [2, "Note should be at least 2 characters"],
      maxlength: [1000, "Note cannot exceed 1000 characters"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amoutn is required"],
      min: 0,
    },
    type: {
      type: String,
      required: [true, "Transaction type is required"],
      enum: ["income", "expense"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Food",
        "Groceries",
        "Transportation",
        "Shopping",
        "Entertainment",
        "Bills & Utilities",
        "Healthcare",
        "Education",
        "Travel",
        "Salary",
        "Freelance",
        "Investments",
        "Other",
      ],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "user is required"],
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
