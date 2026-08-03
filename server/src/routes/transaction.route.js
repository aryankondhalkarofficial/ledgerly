import express from "express";
import {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transaction.controller.js";
import validateTransactionId from "../middlewares/validate-transaction-id.middleware.js";
import auth from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(auth);

router.get("/", getAllTransactions);
router.get("/:id", validateTransactionId, getTransactionById);
router.post("/", createTransaction);
router.patch("/:id", validateTransactionId, updateTransaction);
router.delete("/:id", validateTransactionId, deleteTransaction);

export default router;
