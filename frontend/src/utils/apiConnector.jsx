// src/utils/apiConnector.js
import axios from "axios";
import { logout } from "../redux/slices/userSlice";
import store from "../redux/store";
import toast from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: "https://fake-news-detector-b.onrender.com/api",
  withCredentials: true,
});

// ✅ Attach token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().user.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle Unauthorized (expired token auto logout)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      toast.error("Session expired. Please log in again.");
      store.dispatch(logout());
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ✅ Generic API wrapper
export const apiConnector = async (
  method,
  url,
  data = {},
  headers = {},
  params = {}
) => {
  try {
    const response = await axiosInstance({
      method,
      url,
      data,
      headers,
      params,
    });

    return response;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};

export default apiConnector;
