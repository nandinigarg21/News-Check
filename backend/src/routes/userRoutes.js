// routes/userRoutes.js
import express from "express";
import { signupUser, loginUser, getCurrentUser, logoutUser } from "../controllers/userController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/signup", signupUser);
router.post("/login", loginUser);

// Private routes
router.get("/me", auth, getCurrentUser);
router.post("/logout", auth, logoutUser);

export default router;
