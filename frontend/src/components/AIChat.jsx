import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAIChatHistory, askAI, clearAIChatHistory } from "../lib/newFeatures.api";
import useAuthUser from "../hooks/useAuthUser";
import toast from "react-hot-toast";
import { Send, Trash2, MessageSquare } from "lucide-react";

const AIChat = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef(null);
  const [conversationId] = useState(new Date().getTime().toString());
  const [messageInput, setMessageInput] = useState("");

  // Fetch chat history
  const { data: chatHistory = [], isLoading } = useQuery({
    queryKey: ["aiChatHistory", conversationId],
    queryFn: () => getAIChatHistory(conversationId),
    enabled: !!authUser,
  });

  // Send message mutation
  const { mutate: sendMessage, isPending: isSending } = useMutation({
    mutationFn: (message) => askAI(message, conversationId),
    onSuccess: () => {
      setMessageInput("");
      queryClient.invalidateQueries({ queryKey: ["aiChatHistory", conversationId] });
    },
    onError: () => {
      toast.error("Failed to send message to AI");
    },
  });

  // Clear history mutation
  const { mutate: clearHistory } = useMutation({
    mutationFn: () => clearAIChatHistory(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aiChatHistory", conversationId] });
      toast.success("Chat history cleared");
    },
    onError: () => {
      toast.error("Failed to clear chat history");
    },
  });

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim() && !isSending) {
      sendMessage(messageInput);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-base-100">
      {/* Header */}
      <div className="border-b border-base-300 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          <h2 className="text-xl font-bold">AI Assistant</h2>
        </div>
        {chatHistory.length > 0 && (
          <button
            onClick={() => clearHistory()}
            className="btn btn-sm btn-ghost gap-2"
            title="Clear chat history"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-base-content/60">
            <MessageSquare className="w-12 h-12 mb-3 opacity-50" />
            <p className="mb-2">Welcome to AI Chat!</p>
            <p className="text-sm">Ask me anything about language learning, culture, or just chat.</p>
          </div>
        ) : (
          chatHistory.map((msg) => (
            <div key={msg._id} className="space-y-2">
              {/* User message */}
              <div className="flex justify-end">
                <div className="max-w-xs lg:max-w-md bg-primary text-primary-content rounded-lg px-4 py-2">
                  <p className="text-sm">{msg.userMessage}</p>
                </div>
              </div>

              {/* AI response */}
              <div className="flex justify-start">
                <div className="max-w-xs lg:max-w-md bg-base-200 text-base-content rounded-lg px-4 py-2">
                  <p className="text-sm">{msg.aiResponse}</p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-base-300 p-4 bg-base-100">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Ask the AI assistant..."
            className="input input-bordered flex-1"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={isSending || !messageInput.trim()}
            className="btn btn-primary gap-2"
          >
            {isSending ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChat;
