import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import store from "./redux/store";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        {/* ✅ Global Toast System */}
        <Toaster position="top-center" reverseOrder={false} />

        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
