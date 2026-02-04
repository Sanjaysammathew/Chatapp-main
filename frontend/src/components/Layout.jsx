import { useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useThemeStore } from "../store/useThemeStore";

/**
 * Premium Layout Component
 * Manages layout with sidebar and navbar
 */
const Layout = ({ children, showSidebar = false }) => {
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    // Update dark mode class on the html element
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="flex bg-white dark:bg-slate-900">
        {showSidebar && <Sidebar />}

        <div className="flex-1 flex flex-col">
          <Navbar />

          <main className="flex-1 overflow-y-auto bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-slate-900/50 dark:to-slate-950/50">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
export default Layout;
