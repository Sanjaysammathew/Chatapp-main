import { useState } from "react";
import { ShipWheelIcon, Mail, Lock, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import useLogin from "../hooks/useLogin";

/**
 * Premium Login Page
 * Modern glassmorphism design with smooth animations
 */
const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4 sm:p-6">
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
                <ShipWheelIcon className="size-10 text-blue-500" />
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Streamify
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Sign in to continue your language journey
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
            <form onSubmit={handleLogin} className="space-y-5">
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
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition-all duration-300"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
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
                    className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition-all duration-300"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </motion.div>

              {/* Sign In Button */}
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isPending}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>

              {/* Sign Up Link */}
              <motion.p
                variants={itemVariants}
                className="text-center text-sm text-gray-600 dark:text-gray-400"
              >
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-blue-500 hover:text-blue-600 font-semibold hover:underline"
                >
                  Create one
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
                  alt="Language connection illustration"
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
                Connect Worldwide
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-gray-600 dark:text-gray-400 leading-relaxed"
              >
                Practice conversations, make friends, and improve your language skills with
                thousands of learners around the globe
              </motion.p>

              {/* Feature List */}
              <motion.div
                variants={containerVariants}
                className="grid grid-cols-2 gap-3 mt-6"
              >
                {[
                  "💬 Real-time chat",
                  "📞 Video calls",
                  "🌍 Global community",
                  "✨ Learn together",
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    className="p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-white/10"
                  >
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {feature}
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
export default LoginPage;
