import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "stream-chat-react/dist/css/v2/index.css";
import "./index.css";
import App from "./App.jsx";

import { BrowserRouter } from "react-router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useThemeStore } from "./store/useThemeStore";

const queryClient = new QueryClient();

// Initialize dark mode from localStorage
const isDarkMode = localStorage.getItem("streamify-isDarkMode") === "true";
if (isDarkMode) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
