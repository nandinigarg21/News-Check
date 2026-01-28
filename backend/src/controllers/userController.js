// controllers/userController.js
import bcrypt from "bcryptjs";
const { compare, hash } = bcrypt;

import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

/***************************
 📌 Helper: generate JWT & Cookie
***************************/
const generateTokenAndCookie = (user, res) => {
  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};

/***************************
 ✅ Signup
***************************/
export const signupUser = async (req, res) => {
  try {
    let { firstName, lastName, username, email, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !username || !email || !password || !confirmPassword)
      return res.status(400).json({ success: false, message: "All fields are required" });

    if (password.length < 6)
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });

    if (password !== confirmPassword)
      return res.status(400).json({ success: false, message: "Passwords do not match" });

    username = username.toLowerCase().trim();
    email = email.toLowerCase().trim();

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser)
      return res.status(400).json({ success: false, message: "Email or username already exists" });

    const hashedPassword = await hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    });

    const token = generateTokenAndCookie(newUser, res);

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
      token,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/***************************
 ✅ Login
***************************/
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ success: false, message: "Username & password required" });

    const user = await User.findOne({ username: username.toLowerCase() }).select("+password");

    if (!user)
      return res.status(400).json({ success: false, message: "User not found" });

    const isMatch = await compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = generateTokenAndCookie(user, res);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/***************************
 ✅ Get Current User (/me)
***************************/
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/***************************
 ✅ Logout
***************************/
export const logoutUser = async (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ success: true, message: "Logged out successfully" });
};
