import mongoose from "mongoose";

const validateTransactionId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params)) {
    return res.status(400).json({
      success: false,
      message: "Invalid transaction id",
    });
  }
  next();
};

export default validateTransactionId;
