import { useState } from "react";
import { ShipWheelIcon, User, Mail, Lock, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import useSignUp from "../hooks/useSignUp";

/**
 * Premium SignUp Page
 * Modern glassmorphism design with smooth animations
 */
const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { isPending, error, signupMutation } = useSignUp();

  const handleSignup = (e) => {
    e.preventDefault();
    if (agreeTerms) {
      signupMutation(signupData);
    }
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4 sm:p-6">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-0 right-0 w-96 h-96 bg-purple-300 dark:bg-purple-900 opacity-20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 dark:bg-blue-900 opacity-20 rounded-full blur-3xl"
        />
      </div>

      <div className="w-full max-w-5xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left - Form Section */}
          <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl p-8 sm:p-10"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <ShipWheelIcon className="size-10 text-purple-500" />
                <span className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-600 bg-clip-text text-transparent">
                  Streamify
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Join Our Community
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Create your account and start learning with global partners
              </p>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                variants={itemVariants}
                className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 text-sm"
              >
                {error.response?.data?.message || "An error occurred"}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSignup} className="space-y-5">
              {/* Full Name Input */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white transition-all duration-300"
                    value={signupData.fullName}
                    onChange={(e) =>
                      setSignupData({ ...signupData, fullName: e.target.value })
                    }
                    required
                  />
                </div>
              </motion.div>

              {/* Email Input */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white transition-all duration-300"
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData({ ...signupData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </motion.div>

              {/* Password Input */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white transition-all duration-300"
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData({ ...signupData, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Minimum 6 characters recommended
                </p>
              </motion.div>

              {/* Terms Checkbox */}
              <motion.div
                variants={itemVariants}
                className="flex items-start gap-3 p-4 rounded-xl bg-purple-50 dark:bg-slate-800/50 border border-purple-200 dark:border-slate-700"
              >
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-1 rounded border-gray-300 cursor-pointer accent-purple-500"
                />
                <label htmlFor="terms" className="text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
                  I agree to the{" "}
                  <span className="text-purple-600 dark:text-purple-400 hover:underline font-medium">
                    terms of service
                  </span>{" "}
                  and{" "}
                  <span className="text-purple-600 dark:text-purple-400 hover:underline font-medium">
                    privacy policy
                  </span>
                </label>
              </motion.div>

              {/* Sign Up Button */}
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isPending || !agreeTerms}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>

              {/* Login Link */}
              <motion.p
                variants={itemVariants}
                className="text-center text-sm text-gray-600 dark:text-gray-400"
              >
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-purple-500 hover:text-purple-600 font-semibold hover:underline"
                >
                  Sign in
                </Link>
              </motion.p>
            </form>
          </motion.div>

          {/* Right - Illustration Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="hidden lg:flex flex-col items-center justify-center"
          >
            <div className="relative w-full max-w-md aspect-square mb-8">
              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="relative w-full h-full"
              >
                <img
                  src="/i.png"
                  alt="Language learning illustration"
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </motion.div>
            </div>

            <motion.div
              variants={containerVariants}
              initial="initial"
              animate="animate"
              className="text-center space-y-4 max-w-sm"
            >
              <motion.h2
                variants={itemVariants}
                className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white"
              >
                Learn & Connect
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-gray-600 dark:text-gray-400 leading-relaxed"
              >
                Join thousands of language learners and practice with native speakers around the world
              </motion.p>

              {/* Benefits */}
              <motion.div
                variants={containerVariants}
                className="space-y-2 mt-6"
              >
                {[
                  "Instant messaging with language partners",
                  "Video calls for real conversations",
                  "Learn at your own pace",
                ].map((benefit, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-white/10"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white text-left">
                      {benefit}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
