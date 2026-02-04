import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import {
  BellIcon,
  LogOutIcon,
  ShipWheelIcon,
  MessageSquare,
  Moon,
  Sun,
} from "lucide-react";
import { motion } from "framer-motion";
import { useThemeStore } from "../store/useThemeStore";
import useLogout from "../hooks/useLogout";
import PremiumAvatar from "./premium/PremiumAvatar";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-slate-700 sticky top-0 z-30 h-16 flex items-center shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full h-16">
          {/* Logo - Only in chat page */}
          {isChatPage && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-shrink-0"
            >
              <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                <ShipWheelIcon className="size-7 sm:size-8 text-blue-500" />
                <span className="hidden sm:inline text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Streamify
                </span>
              </Link>
            </motion.div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            {/* AI & Groups Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to={"/extended-chat"}>
                <button className="hidden sm:flex btn btn-sm gap-2 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-slate-700 hover:bg-blue-100 dark:hover:bg-slate-700">
                  <MessageSquare className="h-4 w-4" />
                  AI & Groups
                </button>
              </Link>
            </motion.div>

            {/* Notifications */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to={"/notifications"}>
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors relative">
                  <BellIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </button>
              </Link>
            </motion.div>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-indigo-500" />
              )}
            </motion.button>

            {/* User Avatar */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <PremiumAvatar
                src={authUser?.profilePic}
                alt={authUser?.fullName}
                size="md"
              />
            </motion.div>

            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={logoutMutation}
              className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors group"
              title="Logout"
            >
              <LogOutIcon className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:text-red-600" />
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
