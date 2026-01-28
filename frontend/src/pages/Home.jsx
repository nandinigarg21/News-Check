import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkNews } from "../services/operations/newsOperation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const Home = () => {
  const dispatch = useDispatch();
  const { result, loading } = useSelector((state) => state.news);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    subject: "News",
    text: "",
  });

  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ better validation
    if (!formData.title.trim()) return toast.error("Please enter a title.");
    if (!formData.date) return toast.error("Please select a date.");
    if (!formData.text.trim()) return toast.error("Please enter news content.");

    const promise = dispatch(checkNews(formData));

    promise.then(() => {
      setShowModal(true);
    }).catch(() => {
      toast.error("News analysis failed");
    });
  };

  const label = result?.prediction?.toLowerCase();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-10">
      <motion.div
        className="w-full max-w-6xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 rounded-3xl shadow-2xl flex flex-col lg:flex-row items-center lg:items-stretch overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* LEFT INTRO */}
        <div className="lg:w-1/2 w-full p-10 flex flex-col justify-center space-y-6 bg-slate-900/50 backdrop-blur-sm">
          <motion.h1
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-5xl font-extrabold text-blue-400 leading-tight"
          >
            Know the Truth 🧠
          </motion.h1>

          <p className="text-gray-400 text-lg max-w-md leading-relaxed">
            Stop misinformation in its tracks. Enter article details below, and let our AI analyze it in seconds.
          </p>

          <div className="flex space-x-3 pt-3 text-gray-500 text-sm">
            <span>⚡ AI-powered Detection</span>
            <span>🧩 NLP Model Integration</span>
          </div>
        </div>

        {/* RIGHT FORM */}
        <motion.form
          onSubmit={handleSubmit}
          className="lg:w-1/2 w-full bg-slate-900/80 p-10 flex flex-col justify-center space-y-5"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {/* Title */}
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter news title"
            className="w-full p-3 rounded-lg bg-slate-800 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
          />

          {/* Date + Subject */}
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full sm:w-1/2 p-3 rounded-lg bg-slate-800 text-gray-100 focus:ring-2 focus:ring-blue-500"
            />

            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full sm:w-1/2 p-3 rounded-lg bg-slate-800 text-gray-100 focus:ring-2 focus:ring-blue-500"
            >
              <option value="News">News</option>
              <option value="Social Media">Social Media</option>
              <option value="WhatsApp Forward">WhatsApp Forward</option>
            </select>
          </div>

          {/* Text */}
          <textarea
            name="text"
            value={formData.text}
            onChange={handleChange}
            placeholder="Paste or type the news content here..."
            className="w-full h-36 p-4 rounded-xl bg-slate-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </motion.form>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && result && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`p-8 rounded-2xl shadow-xl bg-slate-900 border w-[90%] max-w-lg text-center ${
                label === "fake" ? "border-red-500" : "border-green-500"
              }`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <h2
                className={`text-3xl font-bold mb-4 ${
                  label === "fake" ? "text-red-400" : "text-green-400"
                }`}
              >
                {result.prediction} News
              </h2>

              {result?.confidence && (
                <p className="text-gray-300 mb-4">
                  Confidence: {(result.confidence * 100).toFixed(1)}%
                </p>
              )}

              <div className="text-gray-400 text-sm mb-6 space-y-1">
                <p><strong>Title:</strong> {formData.title}</p>
                <p><strong>Date:</strong> {formData.date}</p>
                <p><strong>Subject:</strong> {formData.subject}</p>
              </div>

              <button
                onClick={() => {
                  setShowModal(false);
                  setFormData({ title: "", date: "", subject: "News", text: "" });
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-all"
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

export default Home;
