import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { HomeIcon, ShipWheelIcon, BellIcon, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import PremiumAvatar from "./premium/PremiumAvatar";

/**
 * Premium Sidebar Component
 * Modern sidebar with navigation, search, and user profile
 */
const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;
  const [searchQuery, setSearchQuery] = useState("");

  const navItems = [
    { icon: HomeIcon, label: "Home", path: "/" },
    { icon: BellIcon, label: "Notifications", path: "/notifications" },
  ];

  return (
    <aside className="w-64 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-gray-200 dark:border-slate-700 hidden lg:flex flex-col h-screen sticky top-0 shadow-xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 border-b border-gray-200 dark:border-slate-700"
      >
        <Link
          to="/"
          className="flex items-center gap-2.5 group hover:opacity-80 transition-opacity"
        >
          <ShipWheelIcon className="size-8 text-blue-500 group-hover:rotate-12 transition-transform" />
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Streamify
          </span>
        </Link>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-4 py-3 border-b border-gray-200 dark:border-slate-700"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:text-white"
          />
        </div>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;

          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ x: 4 }}
            >
              <Link
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30"
                      : "text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                  }
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-sm">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500"
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-4 border-t border-gray-200 dark:border-slate-700 mt-auto"
      >
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
          <PremiumAvatar
            src={authUser?.profilePic}
            alt={authUser?.fullName}
            size="lg"
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
              {authUser?.fullName}
            </p>
            <p className="text-xs text-green-500 flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Online
            </p>
          </div>
        </div>
      </motion.div>
    </aside>
  );
};
export default Sidebar;
