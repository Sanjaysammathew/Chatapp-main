import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createGroup,
  getMyGroups,
  getGroupById,
  addMemberToGroup,
  removeMemberFromGroup,
  getGroupMessages,
  sendGroupMessage,
  updateGroup,
  deleteGroup,
} from "../controllers/group.controller.js";

const router = express.Router();

// All group routes require authentication
router.use(protectRoute);

// Group CRUD
router.post("/", createGroup);
router.get("/", getMyGroups);
router.get("/:groupId", getGroupById);
router.put("/:groupId", updateGroup);
router.delete("/:groupId", deleteGroup);

// Group members
router.post("/:groupId/members", addMemberToGroup);
// Remove member by username (fullName) - e.g. /groups/:groupId/members/:username
router.delete("/:groupId/members/:username", removeMemberFromGroup);

// Group messages
router.get("/:groupId/messages", getGroupMessages);
router.post("/:groupId/messages", sendGroupMessage);

export default router;
