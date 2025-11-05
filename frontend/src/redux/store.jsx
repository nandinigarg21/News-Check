import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import newsReducer from "./slices/newsSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    news: newsReducer,
  },

  // ✅ Enable Redux DevTools only in development
  devTools: process.env.NODE_ENV !== "production",

  // ✅ Extendable middleware (future API logging / error monitor)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,  // useful when handling File, FormData, etc.
    }),
});

export default store;
