// src/services/operations/authOperation.js
import toast from "react-hot-toast";
import { AUTH } from "../apis";
import apiConnector from "../../utils/apiConnector";

import {
  authStart,
  setUser,
  authFail,
  logout,
} from "../../redux/slices/userSlice";

// =====================================================
// REGISTER
// =====================================================
export const signUp = (formData, navigate) => async (dispatch) => {
  dispatch(authStart());
  const toastId = toast.loading("Creating your account...");

  try {
    const response = await apiConnector("POST", AUTH.REGISTER, formData);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Signup failed");
    }

    const { user, token } = response.data;

    dispatch(setUser({ user, token }));

    toast.success("Signup successful 🎉", { id: toastId });
    navigate("/main");
  } catch (error) {
    const msg = error?.response?.data?.message || "Signup failed";
    dispatch(authFail(msg));
    toast.error(msg, { id: toastId });
  }
};

// =====================================================
// LOGIN
// =====================================================
export const login = (formData, navigate) => async (dispatch) => {
  dispatch(authStart());
  const toastId = toast.loading("Logging in...");

  try {
    const response = await apiConnector("POST", AUTH.LOGIN, formData);

    if (!response?.data?.success) {
      throw new Error(response.data.message);
    }

    const { user, token } = response.data;

    dispatch(setUser({ user, token }));

    toast.success("Welcome back 👋", { id: toastId });
    navigate("/main");
  } catch (error) {
    const msg = error?.response?.data?.message || "Login failed";
    dispatch(authFail(msg));
    toast.error(msg, { id: toastId });
  }
};

// =====================================================
// LOGOUT (Optional finish)
// =====================================================
export const logoutUser = () => (dispatch) => {
  dispatch(logout());
  toast.success("Logged out successfully");
};
