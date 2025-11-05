// src/redux/slices/newsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  text: "",
  result: null,
  history: [],
  loading: false,
  error: null,
};

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    newsStart(state) {
      state.loading = true;
      state.error = null;
    },

    setText(state, action) {
      state.text = action.payload;
    },

    setResult(state, action) {
      state.result = action.payload;
      state.loading = false;
    },

    setHistory(state, action) {
      state.history = action.payload || [];
      state.loading = false;
    },

    addToHistory(state, action) {
      // Prevent duplicates if same item fetched & added manually
      const exists = state.history.find((h) => h._id === action.payload._id);

      if (!exists) state.history.unshift(action.payload);
      state.loading = false;
    },

    clearHistory(state) {
      state.history = [];
    },

    newsFail(state, action) {
      state.error = action.payload;
      state.loading = false;
    },

    setError(state, action) {
      state.error = action.payload;
    },

    clearResult(state) {
      state.result = null;
      state.error = null;
      state.text = "";
    },
  },
});

export const {
  newsStart,
  setText,
  setResult,
  setHistory,
  addToHistory,
  clearHistory,
  newsFail,
  setError,
  clearResult,
} = newsSlice.actions;

export const selectNewsLoading = (state) => state.news.loading;
export const selectHistory = (state) => state.news.history;
export const selectResult = (state) => state.news.result;

export default newsSlice.reducer;
