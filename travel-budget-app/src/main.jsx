import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx"; // Ye tumhara TravelBudgetApp component hai

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
