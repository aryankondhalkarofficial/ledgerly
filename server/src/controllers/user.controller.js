import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import cookieOptions from "../utils/cookie-options.js";
import serverError from "../utils/server-error.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      success: true,
      message: "User created",
      user: {
        id: user._id,
        name,
        email,
      },
    });
  } catch (error) {
    return serverError(error, res);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }
    const match = await bcrypt.compare(password, existingUser.password);
    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }
    const token = jwt.sign({ sub: existingUser._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, cookieOptions);
    return res.status(200).json({
      success: true,
      message: "User logged in",
    });
  } catch (error) {
    return serverError(error, res);
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", cookieOptions);
    return res.status(200).json({
      success: true,
      message: "User logged out",
    });
  } catch (error) {
    return serverError(error, res);
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        currency: user.currency,
      },
    });
  } catch (error) {
    return serverError(error, res);
  }
};
