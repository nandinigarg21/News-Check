// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { 
      type: String, 
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50
    },

    lastName: { 
      type: String, 
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50
    },

    username: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      index: true
    },

    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },

    password: { 
      type: String, 
      required: true,
      minlength: 6,
      select: false // 🔒 prevents returning password unless explicitly requested
    },
  },
  { timestamps: true }
);

// ✅ Virtual: full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// ✅ Ensure password is returned manually only when needed
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  },
});

export const User = mongoose.model("User", userSchema);
