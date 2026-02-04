import AIChatMessage from "../models/AIChat.js";
import { GoogleGenAI } from "@google/genai";


const AI_PROVIDER = process.env.AI_PROVIDER || "mock";

async function callAIProvider(message) {
  if (AI_PROVIDER === "gemini") {
    return await callGemini(message);
  }
  return await callMock(message);
}


async function callMock() {
  const responses = [
    "That's an interesting question!",
    "I can help with that 😊",
    "Could you explain a bit more?",
    "That's a common issue. You're not alone.",
    "Sure! Let’s break it down step by step."
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}


async function callGemini(message) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY not set");
    }

    // ✅ Correct client initialization
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    // ✅ Gemini 2.5 Flash (text chat)
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
    });

    return response.text;
  } catch (error) {
    console.error("Gemini error:", error);
    return "AI service is currently unavailable.";
  }
}


export async function getAIChatHistory(req, res) {
  try {
    const userId = req.user.id;
    const { conversationId } = req.query;

    const query = { userId };
    if (conversationId) query.conversationId = conversationId;

    const messages = await AIChatMessage.find(query).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error("getAIChatHistory error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export async function askAI(req, res) {
  try {
    const userId = req.user.id;
    const { message, conversationId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    const aiResponse = await callAIProvider(message);

    const chatMessage = await AIChatMessage.create({
      userId,
      userMessage: message,
      aiResponse,
      conversationId: conversationId || null,
    });

    res.status(201).json(chatMessage);
  } catch (error) {
    console.error("askAI error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function clearChatHistory(req, res) {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;

    await AIChatMessage.deleteMany(
      conversationId ? { userId, conversationId } : { userId }
    );

    res.status(200).json({ message: "Chat history cleared" });
  } catch (error) {
    console.error("clearChatHistory error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
