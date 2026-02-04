import { Link } from "react-router";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { LANGUAGE_TO_FLAG } from "../constants";
import PremiumCard from "./premium/PremiumCard";
import PremiumAvatar from "./premium/PremiumAvatar";
import PremiumBadge from "./premium/PremiumBadge";

/**
 * Premium Friend Card Component
 * Modern card with smooth animations and hover effects
 */
const FriendCard = ({ friend }) => {
  return (
    <PremiumCard hoverable animated className="p-4 h-full flex flex-col">
      {/* Avatar and Name */}
      <div className="flex items-center gap-3 mb-4">
        <PremiumAvatar
          src={friend.profilePic}
          alt={friend.fullName}
          size="lg"
        />
        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
          {friend.fullName}
        </h3>
      </div>

      {/* Language Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <PremiumBadge variant="primary" size="sm">
          {getLanguageFlag(friend.nativeLanguage)}
          {friend.nativeLanguage}
        </PremiumBadge>
        <PremiumBadge variant="secondary" size="sm">
          {getLanguageFlag(friend.learningLanguage)}
          {friend.learningLanguage}
        </PremiumBadge>
      </div>

      {/* Message Button */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-auto"
      >
        <Link
          to={`/chat/${friend._id}`}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/50 font-medium transition-all duration-300"
        >
          <MessageCircle className="w-4 h-4" />
          Message
        </Link>
      </motion.div>
    </PremiumCard>
  );
};
export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}
