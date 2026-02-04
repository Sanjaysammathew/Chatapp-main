import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAIChatHistory, askAI, clearChatHistory } from "../controllers/ai.controller.js";

const router = express.Router();

// All AI routes require authentication
router.use(protectRoute);

// Get chat history (optionally filtered by conversationId)
router.get("/history", getAIChatHistory);

// Send message to AI and get response
router.post("/ask", askAI);

// Clear chat history
router.delete("/history/:conversationId?", clearChatHistory);

export default router;
