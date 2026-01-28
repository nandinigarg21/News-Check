import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  checkNews,
  getUserNews,
  deleteNewsItem,
  clearAllNews,
} from "../services/operations/newsOperation";
import { motion, AnimatePresence } from "framer-motion";
import Tesseract from "tesseract.js";
import toast from "react-hot-toast";

const Main = () => {
  const dispatch = useDispatch();
  const { history, result, loading } = useSelector((state) => state.news);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    subject: "News",
    text: "",
  });

  const [showModal, setShowModal] = useState(false);

  // OCR states
  const [image, setImage] = useState(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // History Filter
  const [filter, setFilter] = useState("all");
  const filteredHistory = useMemo(() => {
    if (!Array.isArray(history)) return [];
    if (filter === "all") return history;
    return history.filter((n) => (n?.prediction || "").toLowerCase() === filter);
  }, [history, filter]);

  useEffect(() => {
    dispatch(getUserNews());
  }, [dispatch]);

  // Input change
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Image Upload
  const handleImageUpload = (file) => {
    if (!file?.type?.startsWith("image/")) {
      return toast.error("Upload a valid image.");
    }
    setImage(file);
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragActive(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setDragActive(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files[0]) handleImageUpload(e.dataTransfer.files[0]);
  };

  // OCR Extract
  const extractTextFromImage = async () => {
    if (!image) return;
    setOcrLoading(true);
    toast.loading("Extracting text...", { id: "ocr" });

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const { data } = await Tesseract.recognize(reader.result, "eng");
        setFormData((prev) => ({ ...prev, text: prev.text + "\n" + data.text }));
        toast.success("Text extracted!", { id: "ocr" });
        setImage(null);
      } catch {
        toast.error("OCR failed", { id: "ocr" });
      } finally {
        setOcrLoading(false);
      }
    };
    reader.readAsDataURL(image);
  };

  // Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const { title, date, text } = formData;
    if (!title.trim()) return toast.error("Enter title");
    if (!date) return toast.error("Select date");
    if (!text.trim()) return toast.error("Enter news content");

    dispatch(checkNews(formData)).then(() => setShowModal(true));
  };

  const label = result?.prediction?.toLowerCase();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-10">
      <motion.div
        className="w-full max-w-6xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950
        border border-slate-800 rounded-3xl shadow-2xl flex flex-col lg:flex-row overflow-hidden"
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
      >

        {/* LEFT — History */}
        <div className="lg:w-1/2 w-full p-8 bg-slate-900/50 flex flex-col">
          <div className="flex justify-between items-center">
            <h2 className="text-4xl font-extrabold text-blue-400">History 📜</h2>

            {history.length > 0 && (
              <button
                onClick={() => dispatch(clearAllNews())}
                className="text-sm text-red-400 hover:text-red-500 underline"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex gap-3 my-4">
            {["all", "real", "fake"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-semibold capitalize transition ${
                  filter === f ? "bg-blue-500" : "bg-slate-700 hover:bg-slate-600"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* History List */}
          <div className="space-y-3 overflow-y-auto pr-1" style={{ maxHeight: 520 }}>
            {filteredHistory.length ? (
              filteredHistory.map((item) => (
                <motion.div
                  key={item._id}
                  className={`p-4 rounded-xl border flex justify-between items-start gap-2 ${
                    item.prediction.toLowerCase() === "fake"
                      ? "border-red-500 bg-red-500/10"
                      : "border-green-500 bg-green-500/10"
                  }`}
                >
                  <div>
                    <div className="font-bold text-lg">
                      {item.prediction === "fake" ? "Fake" : "Real"} News
                    </div>
                    <div className="text-sm text-gray-200">{item.title}</div>
                    <p className="text-sm text-gray-300 mt-1">
                      {(item.text || "").slice(0, 120)}...
                    </p>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => dispatch(deleteNewsItem(item._id))}
                    className="text-red-400 hover:text-red-500 px-2"
                  >
                    ✕
                  </button>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No history yet.</p>
            )}
          </div>
        </div>

        {/* RIGHT — Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="lg:w-1/2 w-full bg-slate-900/80 p-10 flex flex-col space-y-5"
        >
          <h1 className="text-4xl font-extrabold text-blue-400">Know the Truth 🧠</h1>

          {/* Upload */}
          <div
            className={`border-2 border-dashed rounded-xl p-4 text-center transition cursor-pointer
              ${dragActive ? "border-blue-400 bg-slate-800" : "border-slate-700 bg-slate-900"}`}
            onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
          >
            <input type="file" accept="image/*" id="uploadImage"
              className="hidden" onChange={(e) => handleImageUpload(e.target.files[0])} />

            {!image ? (
              <label htmlFor="uploadImage" className="text-gray-400 cursor-pointer">
                📎 Drag & Drop or <span className="text-blue-400 underline">Upload News Image</span>
              </label>
            ) : (
              <div className="space-y-2">
                <img
                  src={URL.createObjectURL(image)} alt="preview"
                  className="h-32 mx-auto rounded-lg object-cover border border-slate-700"
                />
                <button
                  type="button"
                  onClick={extractTextFromImage}
                  disabled={ocrLoading}
                  className="bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {ocrLoading ? "Extracting..." : "Extract Text"}
                </button>
              </div>
            )}
          </div>

          {/* Title */}
          <input
            type="text" name="title" value={formData.title} onChange={handleChange}
            placeholder="Enter news title"
            className="w-full p-3 rounded-lg bg-slate-800 text-gray-100"
          />

          {/* Date + Subject */}
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <input
              type="date" name="date" value={formData.date} onChange={handleChange}
              className="w-full sm:w-1/2 p-3 rounded-lg bg-slate-800 text-gray-100"
            />

            <select
              name="subject" value={formData.subject} onChange={handleChange}
              className="w-full sm:w-1/2 p-3 rounded-lg bg-slate-800 text-gray-100"
            >
              <option value="News">News</option>
              <option value="Social Media">Social Media</option>
              <option value="Article">Article</option>
              <option value="WhatsApp">WhatsApp Forward</option>
            </select>
          </div>

          {/* Text */}
          <textarea
            name="text" value={formData.text} onChange={handleChange}
            placeholder="Paste or type the news content here..."
            className="w-full h-36 p-4 rounded-xl bg-slate-800 text-gray-100 resize-none"
          />

          {/* Submit */}
          <button
            type="submit" disabled={loading}
            className={`px-8 py-3 rounded-lg text-lg font-semibold transition 
              ${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </motion.form>
      </motion.div>

      {/* Result Modal */}
      <AnimatePresence>
        {showModal && result && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className={`p-6 rounded-2xl bg-slate-900 border ${
                label === "fake" ? "border-red-500" : "border-green-500"
              }`}
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            >
              <h2 className={`text-2xl font-bold mb-4 ${
                label === "fake" ? "text-red-400" : "text-green-400"
              }`}>
                {result.prediction} News
              </h2>

              {result?.confidence && (
                <p className="text-gray-300 mb-2">
                  Confidence: {(result.confidence * 100).toFixed(1)}%
                </p>
              )}

              <button
                onClick={() => {
                  setShowModal(false);
                  setFormData({ title: "", date: "", subject: "News", text: "" });
                }}
                className="mt-3 bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Main;
