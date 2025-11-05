// server.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";

import dbConnect from "../backend/src/configs/dbConnect.js";
import newsRoutes from "./src/routes/newsRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

// Load env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// DB
dbConnect();

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://fake-news-detector-neon-one.vercel.app"
  ],
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json({ limit: "3mb" }));
app.use(express.urlencoded({ extended: true, limit: "3mb" }));

// Rate Limit
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: { success: false, message: "Too many requests, try again later" },
  })
);

// Routes
app.get("/api", (req, res) => {
  res.json({ success: true, message: "✅ Fake News Detector API Running" });
});

app.use("/api/auth", userRoutes);
app.use("/api", newsRoutes);

// Production Serve
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "/client/dist")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
  );
}

// Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server error",
  });
});

// Start
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
