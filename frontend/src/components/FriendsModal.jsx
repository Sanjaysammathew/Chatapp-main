import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserFriends, removeFriend } from "../lib/api";
import toast from "react-hot-toast";
import { UserMinus, Users } from "lucide-react";
import { capitialize } from "../lib/utils";
import { getLanguageFlag } from "./FriendCard";

const FriendsModal = ({ onClose }) => {
  const queryClient = useQueryClient();

  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { mutate: removeFriendMutation, isPending } = useMutation({
    mutationFn: removeFriend,
    onSuccess: () => {
      toast.success("Friend removed");
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to remove friend");
    },
  });

  const handleRemoveFriend = (friendId) => {
    if (window.confirm("Remove this friend?")) {
      removeFriendMutation(friendId);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Users className="w-5 h-5" />
          Friends ({friends.length})
        </h3>
        <button
          onClick={onClose}
          className="btn btn-sm btn-ghost"
        >
          ✕
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-sm"></span>
        </div>
      ) : friends.length === 0 ? (
        <div className="text-center py-8 text-base-content/60">
          <p>No friends yet</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {friends.map((friend) => (
            <div
              key={friend._id}
              className="flex items-center justify-between p-3 bg-base-200 rounded hover:bg-base-300 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="avatar rounded-full w-10 h-10 flex-shrink-0">
                  <img src={friend.profilePic} alt={friend.fullName} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{friend.fullName}</p>
                  <div className="flex gap-1 mt-1">
                    <span className="badge badge-xs badge-secondary text-xs">
                      {getLanguageFlag(friend.nativeLanguage)}
                      {capitialize(friend.nativeLanguage)}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleRemoveFriend(friend._id)}
                disabled={isPending}
                className="btn btn-ghost btn-xs ml-2"
                title="Remove friend"
              >
                <UserMinus className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default FriendsModal;
