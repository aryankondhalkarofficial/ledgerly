import express from "express";
import updateCurrency from "../controllers/currency.controller.js";
import auth from "../middlewares/auth.middleware.js";

const router = express.Router();

router.patch("/", auth, updateCurrency);

export default router;
