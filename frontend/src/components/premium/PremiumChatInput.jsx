import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Smile, Paperclip, Mic } from "lucide-react";

/**
 * Premium Chat Input Component
 * Modern input with emoji picker, attachment preview, and voice button
 */
const PremiumChatInput = ({
  onSendMessage,
  onAttachmentUpload,
  onEmojiSelect,
  disabled = false,
  placeholder = "Type a message...",
}) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const commonEmojis = ["😀", "😂", "😍", "🔥", "👏", "🎉", "✨", "💯", "👍", "❤️"];

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
      setShowEmojiPicker(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = (emoji) => {
    setMessage(message + emoji);
    onEmojiSelect && onEmojiSelect(emoji);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    onAttachmentUpload && onAttachmentUpload(files);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 sm:p-6"
    >
      {/* File Preview */}
      <AnimatePresence>
        {selectedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-wrap gap-2 mb-4"
          >
            {selectedFiles.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-blue-50 dark:bg-slate-800 rounded-lg px-3 py-2"
              >
                <span className="text-xs text-blue-600 dark:text-blue-400 truncate">
                  {file.name}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedFiles(selectedFiles.filter((_, i) => i !== idx))
                  }
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  ✕
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-5 sm:grid-cols-10 gap-2 mb-4 bg-white dark:bg-slate-800 rounded-xl p-3 border border-gray-200 dark:border-slate-700"
          >
            {commonEmojis.map((emoji, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleEmojiClick(emoji)}
                className="text-xl hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg p-1 transition-colors"
              >
                {emoji}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="flex items-end gap-3">
        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows="1"
            className="w-full resize-none rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white dark:placeholder-gray-500 transition-all duration-300"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Emoji Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            title="Add emoji"
          >
            <Smile className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </motion.button>

          {/* Attachment Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            title="Upload attachment"
          >
            <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </motion.button>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
          />

          {/* Voice Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            title="Send voice message"
          >
            <Mic className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </motion.button>

          {/* Send Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!message.trim() || disabled}
            className={`p-2.5 rounded-full transition-all duration-300 ${
              message.trim() && !disabled
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-100 dark:bg-slate-800 text-gray-400 cursor-not-allowed"
            }`}
            title="Send message"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default PremiumChatInput;
