import React from "react";
import { motion } from "framer-motion";

/**
 * Premium Badge Component
 * Modern badge with glassmorphism and smooth animations
 */
const PremiumBadge = ({
  children,
  variant = "primary",
  size = "md",
  animated = true,
  className = "",
}) => {
  const variantClasses = {
    primary:
      "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30",
    secondary:
      "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-600 dark:text-green-400 border border-green-500/30",
    accent:
      "bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-600 dark:text-pink-400 border border-pink-500/30",
    success:
      "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30",
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <motion.div
      initial={animated ? { scale: 0.95, opacity: 0 } : {}}
      animate={animated ? { scale: 1, opacity: 1 } : {}}
      transition={{ duration: 0.3 }}
      className={`inline-flex items-center rounded-full font-medium backdrop-blur-sm transition-all duration-300 hover:shadow-lg ${
        variantClasses[variant]
      } ${sizeClasses[size]} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default PremiumBadge;
