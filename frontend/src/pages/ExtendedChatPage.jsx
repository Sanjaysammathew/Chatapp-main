import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyGroups, createGroup } from "../lib/newFeatures.api";
import useAuthUser from "../hooks/useAuthUser";
import toast from "react-hot-toast";
import AIChat from "../components/AIChat";
import GroupChat from "../components/GroupChat";
import { MessageSquare, Users, Plus, X } from "lucide-react";

const ExtendedChatPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("ai"); // "ai" | "group"
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");

  // Fetch groups
  const { data: groups = [], isLoading: groupsLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: getMyGroups,
    enabled: !!authUser && activeTab === "group",
  });

  // Create group mutation
  const { mutate: createGroupMutation, isPending: isCreatingGroup } = useMutation({
    mutationFn: () => createGroup(newGroupName, newGroupDesc),
    onSuccess: () => {
      setNewGroupName("");
      setNewGroupDesc("");
      setShowCreateGroup(false);
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Group created!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create group");
    },
  });

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (newGroupName.trim()) {
      createGroupMutation();
    }
  };

  return (
    <div className="flex h-full gap-4 p-4 bg-base-100">
      {/* Sidebar with tabs and group list */}
      <div className="w-80 border-r border-base-300 flex flex-col">
        {/* Tab buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab("ai")}
            className={`flex-1 btn btn-sm gap-2 ${
              activeTab === "ai" ? "btn-primary" : "btn-ghost"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            AI Chat
          </button>
          <button
            onClick={() => setActiveTab("group")}
            className={`flex-1 btn btn-sm gap-2 ${
              activeTab === "group" ? "btn-primary" : "btn-ghost"
            }`}
          >
            <Users className="w-4 h-4" />
            Groups
          </button>
        </div>

        {/* Group list section */}
        {activeTab === "group" && (
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-sm">Your Groups</h3>
              <button
                onClick={() => setShowCreateGroup(!showCreateGroup)}
                className="btn btn-xs btn-ghost gap-1"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Create group form */}
            {showCreateGroup && (
              <form onSubmit={handleCreateGroup} className="mb-4 p-3 bg-base-200 rounded space-y-2">
                <input
                  type="text"
                  placeholder="Group name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="input input-sm input-bordered w-full"
                  disabled={isCreatingGroup}
                />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  className="input input-sm input-bordered w-full"
                  disabled={isCreatingGroup}
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isCreatingGroup || !newGroupName.trim()}
                    className="btn btn-xs btn-primary flex-1"
                  >
                    {isCreatingGroup ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      "Create"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateGroup(false);
                      setNewGroupName("");
                      setNewGroupDesc("");
                    }}
                    className="btn btn-xs btn-ghost"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </form>
            )}

            {/* Groups list */}
            {groupsLoading ? (
              <div className="flex justify-center">
                <span className="loading loading-spinner loading-sm"></span>
              </div>
            ) : groups.length === 0 ? (
              <div className="text-center text-base-content/60 text-sm">
                <p className="mb-2">No groups yet</p>
                <p className="text-xs">Create one or ask to join a group</p>
              </div>
            ) : (
              <div className="space-y-2 overflow-y-auto flex-1">
                {groups.map((group) => (
                  <button
                    key={group._id}
                    onClick={() => setSelectedGroupId(group._id)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      selectedGroupId === group._id
                        ? "bg-primary text-primary-content"
                        : "bg-base-200 hover:bg-base-300"
                    }`}
                  >
                    <p className="font-medium text-sm truncate">{group.name}</p>
                    <p className="text-xs opacity-75">
                      {group.members?.length || 0} members
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col rounded-lg border border-base-300 overflow-hidden">
        {activeTab === "ai" ? (
          <AIChat />
        ) : selectedGroupId ? (
          <GroupChat groupId={selectedGroupId} />
        ) : (
          <div className="flex items-center justify-center h-full text-base-content/60">
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Select a group to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExtendedChatPage;
