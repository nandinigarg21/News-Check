import axios from "axios";
import { NewsCheck } from "../models/News.js";

// ✅ Check News + Save
export const checkNews = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user?.id;

    if (!text) {
      return res.status(400).json({ success: false, message: "No text provided." });
    }

    const pythonApiUrl = process.env.PYTHON_API_URL || "http://127.0.0.1:5000/predict";
    const pythonResponse = await axios.post(pythonApiUrl, { text });

    const prediction = pythonResponse.data;

    const saved = await NewsCheck.create({
      userId,
      text,
      prediction: prediction?.label || prediction.prediction,
      confidence: prediction?.confidence,
    });

    res.status(200).json({ success: true, data: saved });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error checking news",
      error: error.message,
    });
  }
};

// ✅ Fetch user history
export const getUserNews = async (req, res) => {
  try {
    const news = await NewsCheck.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch history", error: error.message });
  }
};

// ✅ Delete single record
export const deleteUserNews = async (req, res) => {
  try {
    const deleted = await NewsCheck.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete", error: error.message });
  }
};

// ✅ Clear user history
export const clearUserNews = async (req, res) => {
  try {
    await NewsCheck.deleteMany({ userId: req.user.id });
    res.json({ success: true, message: "All history cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to clear history", error: error.message });
  }
};
