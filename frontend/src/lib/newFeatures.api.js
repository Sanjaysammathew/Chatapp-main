// AI Chat API calls
import { axiosInstance } from "./axios";

/**
 * Get AI chat history (optionally filtered by conversation ID)
 */
export async function getAIChatHistory(conversationId = null) {
  const params = conversationId ? { conversationId } : {};
  const response = await axiosInstance.get("/ai/history", { params });
  return response.data;
}

/**
 * Send a message to AI and get response
 */
export async function askAI(message, conversationId = null) {
  const response = await axiosInstance.post("/ai/ask", {
    message,
    conversationId,
  });
  return response.data;
}

/**
 * Clear chat history for a conversation or all
 */
export async function clearAIChatHistory(conversationId = null) {
  const url = conversationId ? `/ai/history/${conversationId}` : "/ai/history/";
  const response = await axiosInstance.delete(url);
  return response.data;
}

// Group Chat API calls

/**
 * Create a new group
 */
export async function createGroup(name, description = "", members = []) {
  const response = await axiosInstance.post("/groups", {
    name,
    description,
    members,
  });
  return response.data;
}

/**
 * Get all groups the user is a member of
 */
export async function getMyGroups() {
  const response = await axiosInstance.get("/groups");
  return response.data;
}

/**
 * Get a specific group by ID
 */
export async function getGroupById(groupId) {
  const response = await axiosInstance.get(`/groups/${groupId}`);
  return response.data;
}

/**
 * Update group (admin only)
 */
export async function updateGroup(groupId, updates) {
  const response = await axiosInstance.put(`/groups/${groupId}`, updates);
  return response.data;
}

/**
 * Delete group (admin only)
 */
export async function deleteGroup(groupId) {
  const response = await axiosInstance.delete(`/groups/${groupId}`);
  return response.data;
}

/**
 * Add member to group (admin only)
 */
export async function addMemberToGroup(groupId, userId) {
  // expects `username` (fullName) instead of userId
  const response = await axiosInstance.post(`/groups/${groupId}/members`, {
    username: userId,
  });
  return response.data;
}

/**
 * Remove member from group
 */
export async function removeMemberFromGroup(groupId, userId) {
  // expects username in the URL
  const response = await axiosInstance.delete(`/groups/${groupId}/members/${userId}`);
  return response.data;
}

/**
 * Get all messages in a group
 */
export async function getGroupMessages(groupId) {
  const response = await axiosInstance.get(`/groups/${groupId}/messages`);
  return response.data;
}

/**
 * Send message in group
 */
export async function sendGroupMessage(groupId, text) {
  const response = await axiosInstance.post(`/groups/${groupId}/messages`, {
    text,
  });
  return response.data;
}
