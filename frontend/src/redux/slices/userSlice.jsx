// src/redux/slices/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const getUserFromStorage = () => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null; // prevent crash if corrupted
  }
};

const initialState = {
  user: getUserFromStorage(),
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

const saveAuthToLocal = (user, token) => {
  if (user) localStorage.setItem("user", JSON.stringify(user));
  if (token) localStorage.setItem("token", token);
};

const clearAuthStorage = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    authStart(state) {
      state.loading = true;
      state.error = null;
    },
    setUser(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;

      saveAuthToLocal(action.payload.user, action.payload.token);
    },
    authFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      clearAuthStorage();
    },
  },
});

export const { authStart, setUser, authFail, logout, clearError } =
  userSlice.actions;

export const selectCurrentUser = (state) => state.user.user;
export const selectToken = (state) => state.user.token;
export const selectAuthLoading = (state) => state.user.loading;
export const selectAuthError = (state) => state.user.error;

export default userSlice.reducer;
