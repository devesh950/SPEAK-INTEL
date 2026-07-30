"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mic, AlertCircle, Sparkles, Globe, Brain, MessageCircle, Volume2, Star } from "lucide-react";
import { signIn } from "next-auth/react";

const features = [
  { icon: MessageCircle, label: "AI Conversations", desc: "Practice real-world English dialogues" },
  { icon: Brain, label: "Smart Feedback", desc: "Get instant grammar & pronunciation tips" },
  { icon: Volume2, label: "Voice Recognition", desc: "Speak naturally and get scored" },
  { icon: Globe, label: "Interview Prep", desc: "Ace your next job interview" },
];

export default function SignInPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (err: any) {
      setError("Google authentication failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[#09090b]" />
      <div className="absolute inset-0 gradient-hero" />
      
      {/* Floating orbs */}
      <div className="absolute top-[10%] left-[15%] w-72 h-72 rounded-full bg-purple-600/8 blur-[120px] animate-[float_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-[15%] right-[10%] w-96 h-96 rounded-full bg-cyan-500/6 blur-[150px] animate-[float_10s_ease-in-out_infinite_2s]" />
      <div className="absolute top-[60%] left-[60%] w-64 h-64 rounded-full bg-pink-500/5 blur-[100px] animate-[float_12s_ease-in-out_infinite_4s]" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      {/* Left Panel - Hero / Features (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16 xl:px-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold tracking-tight">
              Speak<span className="text-primary">Intel</span>
            </span>
          </div>

          {/* Tagline */}
          <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-4">
            Your AI-Powered
            <br />
            <span className="gradient-text">Communication Coach</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mb-12 leading-relaxed">
            Master English speaking with real-time AI conversations, smart feedback, and personalized learning paths.
          </p>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 gap-4 max-w-lg">
            {features.map((feature, i) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-4.5 h-4.5 text-primary-light" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/90">{feature.label}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-12 flex items-center gap-4"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#09090b] overflow-hidden">
                  <div className={`w-full h-full ${
                    i === 1 ? 'bg-gradient-to-br from-violet-500 to-purple-600' :
                    i === 2 ? 'bg-gradient-to-br from-cyan-400 to-blue-500' :
                    i === 3 ? 'bg-gradient-to-br from-pink-400 to-rose-500' :
                    i === 4 ? 'bg-gradient-to-br from-amber-400 to-orange-500' :
                    'bg-gradient-to-br from-emerald-400 to-teal-500'
                  }`} />
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 mb-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Loved by <span className="text-white font-medium">2,000+</span> learners worldwide</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Panel - Sign In Card */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[420px]"
        >
          {/* Card with gradient border glow */}
          <div className="relative">
            {/* Glow effect behind card */}
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-purple-600/20 via-cyan-500/10 to-pink-500/20 blur-xl opacity-60" />
            
            <div className="relative rounded-2xl bg-[#141418]/90 backdrop-blur-xl border border-white/[0.08] p-8 sm:p-10 shadow-2xl">
              {/* Mobile logo (hidden on desktop) */}
              <div className="lg:hidden text-center mb-2">
                <div className="inline-flex items-center gap-2.5 mb-6">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-purple-500/25">
                    <Mic className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-2xl font-bold">
                    Speak<span className="text-primary">Intel</span>
                  </span>
                </div>
              </div>

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center lg:justify-start mb-6"
              >
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary-light border border-primary/20">
                  <Sparkles className="w-3 h-3" />
                  Free to get started
                </span>
              </motion.div>

              {/* Heading */}
              <div className="text-center lg:text-left mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
                <p className="text-sm text-muted-foreground">
                  Sign in to continue your learning journey
                </p>
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-3.5 rounded-xl bg-red-500/8 border border-red-500/15 text-xs text-red-400 flex items-center gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Google Sign In Button */}
              <motion.button
                onClick={handleGoogleLogin}
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-xl bg-white text-gray-800 font-semibold text-sm hover:bg-gray-50 transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-black/10 relative overflow-hidden group"
              >
                <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="relative z-10">{loading ? "Signing in..." : "Continue with Google"}</span>
              </motion.button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>

              {/* Feature highlights for mobile */}
              <div className="lg:hidden space-y-3 mb-6">
                {features.slice(0, 2).map((feature, i) => (
                  <motion.div
                    key={feature.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-3 text-xs text-muted-foreground"
                  >
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-3.5 h-3.5 text-primary-light" />
                    </div>
                    <span>{feature.label} — {feature.desc}</span>
                  </motion.div>
                ))}
              </div>

              {/* Terms */}
              <p className="text-center text-[11px] text-muted-foreground/70 leading-relaxed">
                By signing in, you agree to our{" "}
                <span className="text-muted-foreground hover:text-white transition-colors cursor-pointer">Terms of Service</span>
                {" "}and{" "}
                <span className="text-muted-foreground hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
              </p>
            </div>
          </div>

          {/* Bottom attribution */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center text-[11px] text-muted-foreground/40 mt-6"
          >
            Powered by AI · Built with ❤️ for English learners
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
