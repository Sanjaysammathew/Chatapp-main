import React from "react";
import { motion } from "framer-motion";
import { Check, CheckCheck } from "lucide-react";

/**
 * Premium Message Bubble Component
 * Modern message bubble with reactions, delivery/read status, and smooth animations
 */
const PremiumMessageBubble = ({
  message,
  isOwn = false,
  showTime = true,
  reactions = [],
  isDelivered = false,
  isRead = false,
  className = "",
}) => {
  const bubbleVariants = {
    initial: { opacity: 0, scale: 0.8, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: 10 },
  };

  return (
    <motion.div
      variants={bubbleVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-3`}
    >
      <div className={`flex flex-col max-w-xs sm:max-w-md ${isOwn ? "items-end" : "items-start"}`}>
        {/* Message Bubble */}
        <div
          className={`
            rounded-3xl px-4 py-2.5 shadow-md
            ${
              isOwn
                ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md"
                : "bg-gradient-to-br from-gray-200 to-gray-100 dark:from-slate-700 dark:to-slate-800 text-gray-900 dark:text-white rounded-bl-md"
            }
            break-words
            ${className}
          `}
        >
          <p className="text-sm sm:text-base leading-relaxed">{message}</p>
        </div>

        {/* Time & Status */}
        <div className={`flex items-center gap-1.5 mt-1 text-xs opacity-60 ${isOwn ? "flex-row-reverse" : ""}`}>
          {showTime && <span className="text-xs">{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>}
          {isOwn && (
            <>
              {isRead ? (
                <CheckCheck className="w-4 h-4 text-blue-400" />
              ) : isDelivered ? (
                <Check className="w-4 h-4" />
              ) : null}
            </>
          )}
        </div>

        {/* Reactions */}
        {reactions && reactions.length > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex gap-1 mt-1 bg-white dark:bg-slate-800 rounded-full px-2 py-1 shadow-sm border border-gray-200 dark:border-slate-700"
          >
            {reactions.map((emoji, idx) => (
              <span key={idx} className="text-sm">
                {emoji}
              </span>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default PremiumMessageBubble;
