import toast from "react-hot-toast";
import apiConnector from "../../utils/apiConnector";
import { NEWS } from "../apis";

import {
  newsStart,
  setResult,
  setHistory,
  addToHistory,
  newsFail,
} from "../../redux/slices/newsSlice";

// =====================================================
// ✅ CHECK NEWS (Fake News Detection + Save to State)
// =====================================================
export const checkNews = (formData) => async (dispatch) => {
  dispatch(newsStart());
  const toastId = toast.loading("Analyzing news...");

  try {
    const response = await apiConnector("POST", NEWS.CHECK, formData);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Unexpected server response");
    }

    const result = response.data.data;

    dispatch(setResult(result));
    dispatch(addToHistory(result)); // Update UI immediately

    toast.success("News analyzed ✅", { id: toastId });
  } catch (error) {
    const msg = error?.response?.data?.message || "News analysis failed";
    dispatch(newsFail(msg));
    toast.error(msg, { id: toastId });
  }
};

// =====================================================
// ✅ GET USER HISTORY
// =====================================================
export const getUserNews = () => async (dispatch) => {
  dispatch(newsStart());
  const toastId = toast.loading("Fetching your history...");

  try {
    const res = await apiConnector("GET", NEWS.HISTORY);
    dispatch(setHistory(res.data.data || []));
    toast.dismiss(toastId); // no success popup needed
  } catch (err) {
    dispatch(newsFail("Failed to load history"));
    toast.error("Failed to load history", { id: toastId });
  }
};

// DELETE single history record
export const deleteNewsItem = (id) => async (dispatch) => {
  try {
    toast.loading("Deleting...", { id: "del" });
    await apiConnector("DELETE", `/news/history/${id}`);
    toast.success("Deleted!", { id: "del" });
    dispatch(getUserNews());
  } catch {
    toast.error("Delete failed", { id: "del" });
  }
};

// CLEAR all history
export const clearAllNews = () => async (dispatch) => {
  try {
    toast.loading("Clearing...", { id: "clear" });
    await apiConnector("DELETE", `/news/history`);
    toast.success("History cleared!", { id: "clear" });
    dispatch(getUserNews());
  } catch {
    toast.error("Failed to clear", { id: "clear" });
  }
};

