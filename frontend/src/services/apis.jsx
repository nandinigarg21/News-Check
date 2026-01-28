// src/services/apis/endPoints.js

// ===== Base API Routes =====
export const AUTH = {
  REGISTER: "/auth/signup",
  LOGIN: "/auth/login",
};

export const NEWS = {
  CHECK: "/check-news",
  HISTORY: "/news/history", // ✅ future use
};

// Central export (optional use)
export const API = {
  ...AUTH,
  ...NEWS,
};
