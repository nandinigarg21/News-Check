// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const auth = async (req, res, next) => {
  try {
    // ✅ Get token from cookie or Authorization header
    let token =
      req.cookies?.token ||
      req.headers.authorization?.replace("Bearer ", "").trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized — token missing",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET missing in .env");
      return res.status(500).json({
        success: false,
        message: "Server config error",
      });
    }

    // ✅ Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message:
          err.name === "TokenExpiredError"
            ? "Session expired. Please log in again."
            : "Invalid token. Login again.",
      });
    }

    // ✅ Attach user to request
    const user = await User.findById(decoded.id).select("_id username email");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists, login again",
      });
    }

    req.user = user;

    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};
