import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import transactionRouter from "./routes/transaction.route.js";
import currencyRouter from "./routes/currency.route.js";

const app = express();
const limiter = rateLimit({
  windowMs: 1000 * 60 * 15,
  limit: 100,
  message: {
    success: false,
    message: "Too many requests, try again later",
  },
});

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);
app.use("/api/users", userRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/currency", currencyRouter);

export default app;
