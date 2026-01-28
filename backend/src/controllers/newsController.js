import axios from "axios";
import { NewsCheck } from "../models/News.js";

// ✅ Check News + Save full form
export const checkNews = async (req, res) => {
  try {
    const { title, date, subject, text } = req.body;
    const userId = req.user?.id;

    // Validate required fields
    if (!title || !date || !subject || !text) {
      return res.status(400).json({
        success: false,
        message: "All fields (title, date, subject, text) are required",
      });
    }

    if (text.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Text must be at least 10 characters",
      });
    }

    // Call Python API
    const pythonApiUrl = process.env.PYTHON_API_URL;
    const py = await axios.post(pythonApiUrl, { text });

    const prediction = (py.data.label || py.data.prediction || "unknown").toLowerCase();
    const confidence = py.data.confidence ?? null;

    // ✅ Save all fields
    const saved = await NewsCheck.create({
      userId,
      title,
      date,
      subject,
      text,
      prediction,
      confidence,
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

// ✅ Fetch User History
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

// ✅ Clear history
export const clearUserNews = async (req, res) => {
  try {
    await NewsCheck.deleteMany({ userId: req.user.id });
    res.json({ success: true, message: "All history cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to clear history", error: error.message });
  }
};
