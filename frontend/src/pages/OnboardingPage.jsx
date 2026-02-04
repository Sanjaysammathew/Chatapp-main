import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import {
  ShipWheelIcon,
  ShuffleIcon,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { LANGUAGES } from "../constants";
import PremiumCard from "../components/premium/PremiumCard";
import PremiumAvatar from "../components/premium/PremiumAvatar";

/**
 * Premium Onboarding Page
 * Modern profile setup with glassmorphism and smooth animations
 */
const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("🎉 Welcome to Streamify!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  const dicebearStyles = ["avataaars", "personas", "lorelei", "pixel-art"];

  const handleRandomAvatar = () => {
    const seed = crypto.randomUUID();
    const randomStyle = dicebearStyles[Math.floor(Math.random() * dicebearStyles.length)];
    const avatarUrl = `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${seed}`;

    setFormState((prev) => ({
      ...prev,
      profilePic: avatarUrl,
    }));

    toast.success("✨ New avatar generated!");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-0 left-0 w-96 h-96 bg-blue-300 dark:bg-blue-900 opacity-20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 dark:bg-purple-900 opacity-20 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-2xl relative z-10"
      >
        <PremiumCard animated className="p-8 sm:p-12">
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <div className="inline-block mb-4">
              <ShipWheelIcon className="w-12 h-12 text-blue-500 mx-auto" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Complete Your Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Set up your profile to get started with language exchange
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Picture Section */}
            <motion.div variants={itemVariants} className="flex flex-col items-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="relative"
              >
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gradient-to-r from-blue-500 to-purple-600 shadow-2xl">
                  {formState.profilePic ? (
                    <img
                      src={formState.profilePic}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/default-avatar.png";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <span className="text-white text-4xl">👤</span>
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleRandomAvatar}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
              >
                <ShuffleIcon className="w-4 h-4" />
                Generate Avatar
              </motion.button>
            </motion.div>

            {/* Form Fields */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formState.fullName}
                onChange={(e) =>
                  setFormState({ ...formState, fullName: e.target.value })
                }
                className="input-premium"
                placeholder="Your full name"
                required
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                value={formState.bio}
                onChange={(e) =>
                  setFormState({ ...formState, bio: e.target.value })
                }
                className="input-premium resize-none h-24"
                placeholder="Tell others about yourself and your language learning goals"
              />
            </motion.div>

            {/* Languages Section */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Native Language
                </label>
                <select
                  value={formState.nativeLanguage}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      nativeLanguage: e.target.value,
                    })
                  }
                  className="input-premium"
                  required
                >
                  <option value="">Select native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Learning Language
                </label>
                <select
                  value={formState.learningLanguage}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      learningLanguage: e.target.value,
                    })
                  }
                  className="input-premium"
                  required
                >
                  <option value="">Select learning language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>

            {/* Location */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formState.location}
                  onChange={(e) =>
                    setFormState({ ...formState, location: e.target.value })
                  }
                  className="input-premium pl-12"
                  placeholder="City, Country"
                />
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isPending}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
            >
              {!isPending ? (
                <>
                  Complete Setup
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Setting up...
                </>
              )}
            </motion.button>
          </form>
        </PremiumCard>
      </motion.div>
    </div>
  );
};

export default OnboardingPage;
