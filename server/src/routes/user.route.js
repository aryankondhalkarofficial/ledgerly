import express from "express";
import {
  register,
  login,
  logout,
  getCurrentUser,
} from "../controllers/user.controller.js";
import auth from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", auth, logout);
router.get("/me", auth, getCurrentUser);

export default router;
