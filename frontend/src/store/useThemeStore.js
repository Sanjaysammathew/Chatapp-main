import { create } from "zustand";

// Premium theme configuration with modern color palettes
export const useThemeStore = create((set) => ({
  // dark: modern dark mode, light: modern light mode
  isDarkMode: localStorage.getItem("streamify-isDarkMode") === "true" || true,
  
  setIsDarkMode: (isDark) => {
    localStorage.setItem("streamify-isDarkMode", isDark);
    set({ isDarkMode: isDark });
  },

  toggleTheme: () => {
    const newIsDark = localStorage.getItem("streamify-isDarkMode") !== "true";
    localStorage.setItem("streamify-isDarkMode", newIsDark);
    set({ isDarkMode: newIsDark });
  },
}));
