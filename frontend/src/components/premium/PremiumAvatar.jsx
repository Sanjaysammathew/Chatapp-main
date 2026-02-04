import React, { useState } from "react";
import { motion } from "framer-motion";

/**
 * Premium Avatar Component
 * Modern gradient avatar with smooth animations and online status indicator
 */
const PremiumAvatar = ({
  src,
  alt = "User",
  size = "md",
  showStatus = false,
  isOnline = true,
  className = "",
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
    "2xl": "w-20 h-20",
  };

  const statusIndicatorSize = {
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3",
    xl: "w-3.5 h-3.5",
    "2xl": "w-4 h-4",
  };

  // Generate a fallback avatar from DiceBear API
  const fallbackAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(alt || "user")}&scale=80`;

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`relative ${sizeClasses[size]} ${className}`}
    >
      <div className="relative w-full h-full rounded-full overflow-hidden ring-2 ring-blue-500/30 hover:ring-blue-500/60 transition-all duration-300 bg-gradient-to-br from-blue-500 to-purple-600">
        {/* Avatar image or fallback */}
        {!imageError && src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            onLoad={() => setImageError(false)}
          />
        ) : (
          <img
            src={fallbackAvatar}
            alt={alt}
            className="w-full h-full object-cover bg-gradient-to-br from-blue-500 to-purple-600"
            onError={(e) => {
              // Ultimate fallback - show initials
              e.target.style.display = "none";
            }}
          />
        )}

        {/* Initials fallback if image fails */}
        {imageError && (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 absolute inset-0">
            <span className="text-white font-bold text-sm">
              {alt
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </span>
          </div>
        )}
      </div>

      {/* Online status indicator */}
      {showStatus && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className={`absolute bottom-0 right-0 ${statusIndicatorSize[size]} rounded-full border-2 border-white ${
            isOnline ? "bg-green-500" : "bg-gray-400"
          }`}
        />
      )}
    </motion.div>
  );
};

export default PremiumAvatar;
