import React from "react";
import { motion } from "framer-motion";

/**
 * Premium Typing Indicator Component
 * Smooth animated typing dots indicator
 */
const TypingIndicator = () => {
  const dotVariants = {
    initial: { y: 0 },
    animate: { y: -10 },
  };

  const dotTransition = {
    duration: 0.6,
    repeat: Infinity,
    repeatType: "reverse",
  };

  return (
    <div className="flex items-center gap-1 p-3">
      <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
        Typing
      </span>
      <motion.div
        variants={dotVariants}
        initial="initial"
        animate="animate"
        transition={{ ...dotTransition, delay: 0 }}
        className="w-2 h-2 rounded-full bg-blue-500"
      />
      <motion.div
        variants={dotVariants}
        initial="initial"
        animate="animate"
        transition={{ ...dotTransition, delay: 0.2 }}
        className="w-2 h-2 rounded-full bg-blue-500"
      />
      <motion.div
        variants={dotVariants}
        initial="initial"
        animate="animate"
        transition={{ ...dotTransition, delay: 0.4 }}
        className="w-2 h-2 rounded-full bg-blue-500"
      />
    </div>
  );
};

export default TypingIndicator;
