import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import { CheckCircle, MapPin, UserPlus, Users } from "lucide-react";
import { motion } from "framer-motion";

import { capitialize } from "../lib/utils";

import FriendCard, { getLanguageFlag } from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import FriendsModal from "../components/FriendsModal";
import PremiumCard from "../components/premium/PremiumCard";
import PremiumAvatar from "../components/premium/PremiumAvatar";
import PremiumBadge from "../components/premium/PremiumBadge";

/**
 * Premium HomePage
 * Modern design with glassmorphism cards and smooth animations
 */
const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());
  const [showFriendsModal, setShowFriendsModal] = useState(false);

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-slate-900/50 dark:to-slate-950/50">
      <div className="container mx-auto space-y-12">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Your Friends
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Connect and chat with your language partners
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFriendsModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/50 border border-blue-200 dark:border-blue-800/50 transition-all duration-300"
            >
              <Users className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Friends</span>
            </motion.button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/notifications"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-950/50 border border-purple-200 dark:border-purple-800/50 transition-all duration-300"
              >
                <Users className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Requests</span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Friends Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {loadingFriends ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : friends.length === 0 ? (
            <NoFriendsFound />
          ) : (
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {friends.map((friend) => (
                <motion.div key={friend._id} variants={itemVariants}>
                  <FriendCard friend={friend} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.section>

        {/* Recommended Users Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Discover New Learners
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Find perfect language exchange partners based on your interests
            </p>
          </motion.div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <PremiumCard className="p-8 text-center">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                No recommendations available
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Check back later for new language partners!
              </p>
            </PremiumCard>
          ) : (
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                return (
                  <motion.div key={user._id} variants={itemVariants}>
                    <PremiumCard hoverable animated className="p-6 h-full flex flex-col">
                      {/* Header with Avatar and Info */}
                      <div className="flex items-start gap-4 mb-4">
                        <PremiumAvatar
                          src={user.profilePic}
                          alt={user.fullName}
                          size="lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                            {user.fullName}
                          </h3>
                          {user.location && (
                            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mt-1">
                              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{user.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Languages */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <PremiumBadge variant="primary" size="sm">
                          {getLanguageFlag(user.nativeLanguage)}
                          {capitialize(user.nativeLanguage)}
                        </PremiumBadge>
                        <PremiumBadge variant="secondary" size="sm">
                          {getLanguageFlag(user.learningLanguage)}
                          {capitialize(user.learningLanguage)}
                        </PremiumBadge>
                      </div>

                      {/* Bio */}
                      {user.bio && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                          {user.bio}
                        </p>
                      )}

                      {/* Action Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                        className={`mt-auto py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                          hasRequestBeenSent
                            ? "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/50"
                        }`}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4" />
                            Send Request
                          </>
                        )}
                      </motion.button>
                    </PremiumCard>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </motion.section>
      </div>

      {/* Friends Modal */}
      {showFriendsModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowFriendsModal(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-96 overflow-auto"
          >
            <FriendsModal onClose={() => setShowFriendsModal(false)} />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default HomePage;
