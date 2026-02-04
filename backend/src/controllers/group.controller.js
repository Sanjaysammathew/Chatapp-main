import Group from "../models/Group.js";
import GroupMessage from "../models/GroupMessage.js";
import User from "../models/User.js";

/**
 * Create a new group
 */
export async function createGroup(req, res) {
  try {
    const { name, description, members } = req.body;
    const adminId = req.user.id;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Group name is required" });
    }

    // We expect `members` to be an array of usernames (fullName strings).
    // Validate that provided usernames exist and are in admin's friend list.
    const adminUser = await User.findById(adminId).select("fullName friends profilePic");
    if (!adminUser) return res.status(404).json({ message: "Admin user not found" });

    const membersUsernames = [];

    // Always include admin's username
    membersUsernames.push(adminUser.fullName);

    if (Array.isArray(members)) {
      for (const username of members) {
        if (!username || typeof username !== "string") continue;
        // Find user by fullName
        const user = await User.findOne({ fullName: username });
        if (!user) {
          return res.status(404).json({ message: `User with name ${username} not found` });
        }

        // Only allow adding users who are in admin's friends list
        const isFriend = adminUser.friends.map((f) => f.toString()).includes(user._id.toString());
        if (!isFriend) {
          return res.status(400).json({ message: `${username} is not in your friends list` });
        }

        if (!membersUsernames.includes(user.fullName)) {
          membersUsernames.push(user.fullName);
        }
      }
    }

    const group = await Group.create({
      name: name.trim(),
      description: description || "",
      admin: adminId,
      createdBy: adminId,
      members: membersUsernames,
    });

    // Prepare response: populate admin and createdBy, and transform members to user objects
    await group.populate("admin", "fullName profilePic");
    await group.populate("createdBy", "fullName profilePic");

    const memberUsers = await User.find({ fullName: { $in: group.members } }).select("_id fullName profilePic");
    const membersResolved = group.members.map((username) => memberUsers.find((u) => u.fullName === username) || { fullName: username });

    const groupObj = group.toObject();
    groupObj.members = membersResolved;

    res.status(201).json(groupObj);
  } catch (error) {
    console.error("Error in createGroup:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * Get all groups for a user (groups they are a member of)
 */
export async function getMyGroups(req, res) {
  try {
    const username = req.user.fullName;

    const groups = await Group.find({ members: username })
      .populate("admin", "fullName profilePic")
      .populate("createdBy", "fullName profilePic")
      .sort({ updatedAt: -1 });

    // Resolve member usernames to user objects for frontend compatibility
    const allUsernames = new Set();
    groups.forEach((g) => g.members.forEach((m) => allUsernames.add(m)));
    const users = await User.find({ fullName: { $in: Array.from(allUsernames) } }).select("_id fullName profilePic");

    const groupsResolved = groups.map((g) => {
      const obj = g.toObject();
      obj.members = obj.members.map((username) => users.find((u) => u.fullName === username) || { fullName: username });
      return obj;
    });

    res.status(200).json(groupsResolved);
  } catch (error) {
    console.error("Error in getMyGroups:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * Get a specific group by ID
 */
export async function getGroupById(req, res) {
  try {
    const { groupId } = req.params;
    const username = req.user.fullName;

    const group = await Group.findById(groupId)
      .populate("admin", "fullName profilePic")
      .populate("createdBy", "fullName profilePic");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if user is a member (by username)
    if (!group.members.some((memberUsername) => memberUsername === username)) {
      return res.status(403).json({ message: "You are not a member of this group" });
    }

    const memberUsers = await User.find({ fullName: { $in: group.members } }).select("_id fullName profilePic");
    const membersResolved = group.members.map((uname) => memberUsers.find((u) => u.fullName === uname) || { fullName: uname });

    const groupObj = group.toObject();
    groupObj.members = membersResolved;

    res.status(200).json(groupObj);
  } catch (error) {
    console.error("Error in getGroupById:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * Add member to group (admin only)
 */
export async function addMemberToGroup(req, res) {
  try {
    const { groupId } = req.params;
    const { username } = req.body; // expected username (fullName)
    const adminId = req.user.id;

    if (!username || typeof username !== "string") {
      return res.status(400).json({ message: "username is required" });
    }

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Verify user is admin
    if (group.admin.toString() !== adminId) {
      return res.status(403).json({ message: "Only group admin can add members" });
    }

    // Verify user exists by username
    const user = await User.findOne({ fullName: username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure the user is in admin's friends list
    const adminUser = req.user; // protectRoute attaches full user
    const isFriend = adminUser.friends.map((f) => f.toString()).includes(user._id.toString());
    if (!isFriend) {
      return res.status(400).json({ message: `${username} is not in your friends list` });
    }

    // Check if user already exists as username
    if (group.members.includes(user.fullName)) {
      return res.status(400).json({ message: "User is already a member" });
    }

    group.members.push(user.fullName);
    await group.save();

    await group.populate("admin", "fullName profilePic");
    await group.populate("createdBy", "fullName profilePic");

    const memberUsers = await User.find({ fullName: { $in: group.members } }).select("_id fullName profilePic");
    const membersResolved = group.members.map((uname) => memberUsers.find((u) => u.fullName === uname) || { fullName: uname });

    const groupObj = group.toObject();
    groupObj.members = membersResolved;

    res.status(200).json(groupObj);
  } catch (error) {
    console.error("Error in addMemberToGroup:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * Remove member from group (admin only or self)
 */
export async function removeMemberFromGroup(req, res) {
  try {
    const { groupId, username } = req.params; // username to remove
    const requesterId = req.user.id;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // We'll resolve usernames to check permissions
    const userToRemove = await User.findOne({ fullName: username });
    if (!userToRemove) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if requester is admin or removing self
    if (group.admin.toString() !== requesterId && userToRemove._id.toString() !== requesterId) {
      return res.status(403).json({ message: "Not authorized to remove this member" });
    }

    // Cannot remove admin (unless admin is leaving)
    if (group.admin.toString() === userToRemove._id.toString() && userToRemove._id.toString() !== requesterId) {
      return res.status(400).json({ message: "Cannot remove group admin" });
    }

    group.members = group.members.filter((uname) => uname !== username);
    await group.save();

    await group.populate("admin", "fullName profilePic");
    await group.populate("createdBy", "fullName profilePic");

    const memberUsers = await User.find({ fullName: { $in: group.members } }).select("_id fullName profilePic");
    const membersResolved = group.members.map((uname) => memberUsers.find((u) => u.fullName === uname) || { fullName: uname });

    const groupObj = group.toObject();
    groupObj.members = membersResolved;

    res.status(200).json(groupObj);
  } catch (error) {
    console.error("Error in removeMemberFromGroup:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * Get group messages
 */
export async function getGroupMessages(req, res) {
  try {
    const { groupId } = req.params;

    // Verify user is a member
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const username = req.user.fullName;
    if (!group.members.some((memberUsername) => memberUsername === username)) {
      return res.status(403).json({ message: "You are not a member of this group" });
    }

    const messages = await GroupMessage.find({ groupId })
      .populate("sender", "fullName profilePic")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getGroupMessages:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * Send message in group (handled by Socket.IO in real apps)
 * This is a fallback REST endpoint
 */
export async function sendGroupMessage(req, res) {
  try {
    const { groupId } = req.params;
    const { text } = req.body;
    const senderId = req.user.id;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    // Verify user is a member
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const username = req.user.fullName;
    if (!group.members.some((memberUsername) => memberUsername === username)) {
      return res.status(403).json({ message: "You are not a member of this group" });
    }

    const message = await GroupMessage.create({
      groupId,
      sender: senderId,
      text,
    });

    await message.populate("sender", "fullName profilePic");

    res.status(201).json(message);
  } catch (error) {
    console.error("Error in sendGroupMessage:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * Update group (admin only)
 */
export async function updateGroup(req, res) {
  try {
    const { groupId } = req.params;
    const { name, description, groupPic } = req.body;
    const adminId = req.user.id;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Verify user is admin
    if (group.admin.toString() !== adminId) {
      return res.status(403).json({ message: "Only group admin can update group" });
    }

    if (name) group.name = name;
    if (description !== undefined) group.description = description;
    if (groupPic) group.groupPic = groupPic;

    await group.save();

    await group.populate("admin", "fullName profilePic");
    const memberUsers = await User.find({ fullName: { $in: group.members } }).select("_id fullName profilePic");
    const membersResolved = group.members.map((uname) => memberUsers.find((u) => u.fullName === uname) || { fullName: uname });
    const groupObj = group.toObject();
    groupObj.members = membersResolved;

    await group.populate("createdBy", "fullName profilePic");

    res.status(200).json(groupObj);
  } catch (error) {
    console.error("Error in updateGroup:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * Delete group (admin only)
 */
export async function deleteGroup(req, res) {
  try {
    const { groupId } = req.params;
    const adminId = req.user.id;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Verify user is admin
    if (group.admin.toString() !== adminId) {
      return res.status(403).json({ message: "Only group admin can delete group" });
    }

    // Delete all messages in group
    await GroupMessage.deleteMany({ groupId });

    // Delete group
    await Group.findByIdAndDelete(groupId);

    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    console.error("Error in deleteGroup:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
