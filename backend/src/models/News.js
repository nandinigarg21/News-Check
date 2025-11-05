import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      index: true 
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },

    date: {
      type: Date,
      required: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
      default: "News"
    },

    text: { 
      type: String, 
      required: true,
      trim: true,
      minlength: 10,
    },

    prediction: { 
      type: String,
      enum: ["real", "fake", "unknown"], 
      default: "unknown" 
    },

    confidence: {
      type: Number,
      default: null,
      min: 0,
      max: 1,
    }
  },

  { timestamps: true } // ✅ adds createdAt + updatedAt
);

export const NewsCheck = mongoose.model("NewsCheck", newsSchema);
