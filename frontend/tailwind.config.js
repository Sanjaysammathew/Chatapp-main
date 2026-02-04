import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        // Premium custom colors
        glass: "rgba(255, 255, 255, 0.1)",
      },
      fontFamily: {
        // Modern font stack
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        poppins: ["Poppins", "sans-serif"],
      },
      backdropBlur: {
        xl: "20px",
      },
      backgroundImage: {
        gradient: "linear-gradient(135deg, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light", "dark"], // Enable light and dark themes
  },
};
