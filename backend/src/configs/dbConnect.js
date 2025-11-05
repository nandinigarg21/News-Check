// src/configs/dbConnect.js
import mongoose from "mongoose";

const dbConnect = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error("❌ MONGO_URI not found in environment variables");
    process.exit(1);
  }

  // Recommended by Mongoose 7+
  mongoose.set("strictQuery", true);

  const connect = async () => {
    try {
      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    } catch (err) {
      console.error("❌ MongoDB connection error:", err.message);
      console.log("🔁 Retrying in 5 seconds...");
      setTimeout(connect, 5000); // retry connection
    }
  };

  connect();
};

export default dbConnect;
