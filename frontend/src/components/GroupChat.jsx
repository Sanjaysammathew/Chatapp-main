import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import {
  getGroupById,
  getGroupMessages,
  sendGroupMessage,
  addMemberToGroup,
  removeMemberFromGroup,
  updateGroup,
} from "../lib/newFeatures.api";
import useAuthUser from "../hooks/useAuthUser";
import toast from "react-hot-toast";
import { Send, Users, Settings, LogOut, Plus, X, UserMinus } from "lucide-react";

const GroupChat = ({ groupId: initialGroupId }) => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef(null);
  const [groupId] = useState(initialGroupId);
  const [messageInput, setMessageInput] = useState("");
  const [showAddMember, setShowAddMember] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [newMemberId, setNewMemberId] = useState("");

  // Fetch group details
  const { data: group, isLoading: groupLoading } = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => getGroupById(groupId),
    enabled: !!groupId && !!authUser,
  });

  // Fetch messages
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["groupMessages", groupId],
    queryFn: () => getGroupMessages(groupId),
    enabled: !!groupId && !!authUser,
  });

  // Send message mutation
  const { mutate: sendMsg, isPending: isSending } = useMutation({
    mutationFn: (text) => sendGroupMessage(groupId, text),
    onSuccess: () => {
      setMessageInput("");
      queryClient.invalidateQueries({ queryKey: ["groupMessages", groupId] });
    },
    onError: () => {
      toast.error("Failed to send message");
    },
  });

  // Add member mutation (expects username/fullName)
  const { mutate: addMember, isPending: isAddingMember } = useMutation({
    mutationFn: (username) => addMemberToGroup(groupId, username),
    onSuccess: () => {
      setNewMemberId("");
      setShowAddMember(false);
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
      toast.success("Member added");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add member");
    },
  });

  // Remove member mutation (username or id accepted)
  const { mutate: removeMember } = useMutation({
    mutationFn: (identifier) => removeMemberFromGroup(groupId, identifier),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
      toast.success("Member removed");
    },
    onError: () => {
      toast.error("Failed to remove member");
    },
  });

  // Leave group mutation
  const { mutate: leaveGroup } = useMutation({
    mutationFn: () => removeMemberFromGroup(groupId, authUser.fullName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Left group");
      // Navigation would happen in parent component
    },
    onError: () => {
      toast.error("Failed to leave group");
    },
  });

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim() && !isSending) {
      sendMsg(messageInput);
    }
  };

  const handleAddMember = () => {
    if (newMemberId.trim()) {
      addMember(newMemberId);
    }
  };

  const isAdmin = group?.admin?._id === authUser?._id;

  if (groupLoading || messagesLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-center text-base-content/60">Group not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-base-100">
      {/* Header */}
      <div className="border-b border-base-300 p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">{group.name}</h2>
          <p className="text-sm text-base-content/60">{group.members?.length || 0} members</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddMember(!showAddMember)}
            className="btn btn-sm btn-ghost gap-2"
            disabled={!isAdmin}
            title={isAdmin ? "Add member" : "Only admin can add members"}
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="btn btn-sm btn-ghost gap-2"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button onClick={() => leaveGroup()} className="btn btn-sm btn-ghost gap-2">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add Member Panel */}
      {showAddMember && isAdmin && (
        <div className="border-b border-base-300 p-4 bg-base-200">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Enter member name"
              value={newMemberId}
              onChange={(e) => setNewMemberId(e.target.value)}
              className="input input-bordered flex-1"
              disabled={isAddingMember}
            />
            <button
              onClick={handleAddMember}
              disabled={isAddingMember || !newMemberId.trim()}
              className="btn btn-primary"
            >
              {isAddingMember ? <span className="loading loading-spinner loading-sm"></span> : "Add"}
            </button>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="border-b border-base-300 p-4 bg-base-200">
          <h3 className="font-semibold mb-3">Members ({group.members?.length || 0})</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {group.members?.map((member) => (
              <div key={member._id || member.fullName} className="flex items-center justify-between p-2 bg-base-100 rounded">
                <div className="flex items-center gap-2">
                  {member.profilePic && (
                    <img src={member.profilePic} alt={member.fullName} className="w-8 h-8 rounded-full" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{member.fullName}</p>
                    {member._id && member._id === group.admin._id && (
                      <p className="text-xs text-primary">Admin</p>
                    )}
                  </div>
                </div>
                {isAdmin && member._id !== group.admin._id && (
                  <button
                    onClick={() => removeMember(member._id ? member._id : member.fullName)}
                    className="btn btn-xs btn-ghost gap-1"
                  >
                    <UserMinus className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-base-content/60">
            <Users className="w-12 h-12 mb-3 opacity-50" />
            <p className="mb-2">No messages yet</p>
            <p className="text-sm">Start a conversation with group members!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${msg.sender._id === authUser._id ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md rounded-lg px-4 py-2 ${
                  msg.sender._id === authUser._id
                    ? "bg-primary text-primary-content"
                    : "bg-base-200 text-base-content"
                }`}
              >
                {msg.sender._id !== authUser._id && (
                  <p className="text-xs font-semibold opacity-75 mb-1">{msg.sender.fullName}</p>
                )}
                <p className="text-sm">{msg.text}</p>
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
            placeholder="Type a message..."
            className="input input-bordered flex-1"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={isSending || !messageInput.trim()}
            className="btn btn-primary gap-2"
          >
            {isSending ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GroupChat;
