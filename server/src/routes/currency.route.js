import express from "express";
import auth from "../middlewares/auth.middleware.js";

const router = express.Router();

router.patch("/", updateCurrency);

export default router;
