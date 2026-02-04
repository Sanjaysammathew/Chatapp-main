import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptFriendRequest,
  declineFriendRequest,
  getFriendRequests,
} from "../lib/api";
import {
  BellIcon,
  ClockIcon,
  UserCheckIcon,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import NoNotificationsFound from "../components/NoNotificationsFound";
import PremiumAvatar from "../components/premium/PremiumAvatar";

// DiceBear avatar fallback
const generateAvatarUrl = (seed) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading, error } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequest, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const { mutate: declineRequest, isPending: isDeclining } = useMutation({
    mutationFn: declineFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const incomingRequests = Array.isArray(friendRequests?.incomingReqs)
    ? friendRequests.incomingReqs
    : [];
  const acceptedRequests = Array.isArray(friendRequests?.acceptedReqs)
    ? friendRequests.acceptedReqs
    : [];

  if (error) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <p className="text-base-content">Error loading notifications</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-base-content mb-2">
            Notifications
          </h1>
          <p className="text-base-content/70 flex items-center gap-2">
            <BellIcon className="w-4 h-4" />
            Stay updated with friend requests and connections
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-base-300 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* INCOMING REQUESTS */}
            {incomingRequests.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <UserCheckIcon className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold text-base-content">
                    Friend Requests
                  </h2>
                  <span className="ml-auto px-3 py-1 rounded-full bg-primary/20 text-primary font-bold text-sm">
                    {incomingRequests.length}
                  </span>
                </div>

                {incomingRequests.map((req, index) => (
                  <div
                    key={req?._id || index}
                    className="bg-base-200 border border-base-300 rounded-xl p-4 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-4">
                      <PremiumAvatar
                        src={
                          req.sender?.profilePic ||
                          generateAvatarUrl(req.sender?.fullName || "User")
                        }
                        alt={req.sender?.fullName || "User"}
                        size="lg"
                      />
                      <div>
                        <p className="font-semibold text-base-content">
                          {req.sender?.fullName || "Unknown User"}
                        </p>
                        <p className="text-sm text-base-content/60">
                          Sent you a friend request
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => acceptRequest(req._id)}
                        disabled={isPending || isDeclining}
                        className="px-4 py-2 bg-primary text-primary-content rounded-lg text-sm font-semibold"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => declineRequest(req._id)}
                        disabled={isPending || isDeclining}
                        className="px-4 py-2 border border-primary text-base-content rounded-lg text-sm"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* ACCEPTED REQUESTS */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold text-base-content">
                    New Connections
                  </h2>
                </div>

                {acceptedRequests.map((item, index) => (
                  <div
                    key={item?._id || index}
                    className="bg-base-200 border border-base-300 rounded-xl p-4 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-4">
                      <PremiumAvatar
                        src={
                          item.recipient?.profilePic ||
                          generateAvatarUrl(item.recipient?.fullName || "User")
                        }
                        alt={item.recipient?.fullName || "User"}
                        size="lg"
                      />
                      <div>
                        <p className="font-semibold text-base-content">
                          {item.recipient?.fullName || "Unknown User"}
                        </p>
                        <p className="text-sm text-base-content/60 flex items-center gap-1">
                          <ClockIcon className="w-3 h-3" />
                          Recently connected
                        </p>
                      </div>
                    </div>

                    <span className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-lg font-semibold">
                      New Friend
                    </span>
                  </div>
                ))}
              </section>
            )}

            {incomingRequests.length === 0 &&
              acceptedRequests.length === 0 && <NoNotificationsFound />}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
