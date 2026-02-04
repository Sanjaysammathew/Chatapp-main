import React from "react";
import { motion } from "framer-motion";

/**
 * Premium Card Component
 * Modern card with glassmorphism, smooth shadows, and hover effects
 */
const PremiumCard = ({
  children,
  className = "",
  hoverable = true,
  animated = true,
  gradient = false,
}) => {
  return (
    <motion.div
      initial={animated ? { opacity: 0, y: 10 } : {}}
      animate={animated ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
      whileHover={hoverable ? { y: -4 } : {}}
      className={`
        relative backdrop-blur-xl
        ${
          gradient
            ? "bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-900/90 dark:to-slate-800/70"
            : "bg-white/80 dark:bg-slate-900/80"
        }
        border border-white/20 dark:border-white/10
        rounded-2xl shadow-lg hover:shadow-2xl
        transition-all duration-300
        ${hoverable ? "hover:border-white/30 dark:hover:border-white/20 cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

export default PremiumCard;
