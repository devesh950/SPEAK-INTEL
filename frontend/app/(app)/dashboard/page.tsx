"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getProgressStats, resetProgressStats, getRecentActivities, UserStats, RecentActivity } from "@/lib/progress";
import {
  Mic,
  Briefcase,
  PenTool,
  Headphones,
  Zap,
  BookOpen,
  Clock,
  Flame,
  TrendingUp,
  Award,
  CheckCircle,
  Brain,
  Target,
  ArrowRight,
  Activity,
} from "lucide-react";

// ============================================
// STATS DATA
// ============================================

const stats = [
  {
    label: "Daily Practice",
    value: "45",
    unit: "min",
    icon: Clock,
    color: "from-purple-500 to-purple-700",
    bgColor: "bg-purple-500/10",
    change: "+12%",
  },
  {
    label: "Current Streak",
    value: "7",
    unit: "days",
    icon: Flame,
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-500/10",
    change: "🔥",
  },
  {
    label: "Weekly Progress",
    value: "82",
    unit: "%",
    icon: TrendingUp,
    color: "from-emerald-500 to-emerald-700",
    bgColor: "bg-emerald-500/10",
    change: "+5%",
  },
  {
    label: "Communication",
    value: "7.8",
    unit: "/10",
    icon: Activity,
    color: "from-cyan-500 to-cyan-700",
    bgColor: "bg-cyan-500/10",
    change: "+0.3",
  },
  {
    label: "Sessions Done",
    value: "23",
    unit: "",
    icon: CheckCircle,
    color: "from-blue-500 to-blue-700",
    bgColor: "bg-blue-500/10",
    change: "+3",
  },
  {
    label: "Words Learned",
    value: "156",
    unit: "",
    icon: Brain,
    color: "from-pink-500 to-pink-700",
    bgColor: "bg-pink-500/10",
    change: "+18",
  },
  {
    label: "Interview Score",
    value: "8.2",
    unit: "/10",
    icon: Target,
    color: "from-amber-500 to-amber-700",
    bgColor: "bg-amber-500/10",
    change: "+0.5",
  },
];

const quickActions = [
  {
    label: "Start Conversation",
    icon: Mic,
    href: "/conversation",
    color: "from-purple-600/20 to-purple-800/10",
    iconColor: "text-purple-400",
    description: "Practice with AI coach",
  },
  {
    label: "Interview Practice",
    icon: Briefcase,
    href: "/interview",
    color: "from-cyan-600/20 to-cyan-800/10",
    iconColor: "text-cyan-400",
    description: "Mock interviews",
  },
  {
    label: "Grammar Practice",
    icon: PenTool,
    href: "/grammar",
    color: "from-pink-600/20 to-pink-800/10",
    iconColor: "text-pink-400",
    description: "Fix your grammar",
  },
  {
    label: "Pronunciation",
    icon: Headphones,
    href: "/pronunciation",
    color: "from-emerald-600/20 to-emerald-800/10",
    iconColor: "text-emerald-400",
    description: "Perfect your accent",
  },
  {
    label: "Daily Challenge",
    icon: Zap,
    href: "/challenges",
    color: "from-amber-600/20 to-amber-800/10",
    iconColor: "text-amber-400",
    description: "Today's challenge",
  },
  {
    label: "Vocabulary",
    icon: BookOpen,
    href: "/vocabulary",
    color: "from-blue-600/20 to-blue-800/10",
    iconColor: "text-blue-400",
    description: "Build your vocab",
  },
];


// ============================================
// DASHBOARD PAGE
// ============================================

export default function DashboardPage() {
  const { data: session } = useSession();
  const [userName, setUserName] = useState("Learner");
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [progress, setProgress] = useState<UserStats | null>(null);
  const [activitiesList, setActivitiesList] = useState<RecentActivity[]>([]);

  useEffect(() => {
    // Sync username
    if (session?.user?.name) {
      setUserName(session.user.name);
    } else {
      const cachedName = localStorage.getItem("speakintel-username") || "Learner";
      setUserName(cachedName);
    }

    // Track first-time visit vs returning visit
    const hasVisited = localStorage.getItem("speakintel-visited");
    if (!hasVisited) {
      // First-time visitor: reset stats to 0, register visit
      resetProgressStats();
      setIsFirstTime(true);
      localStorage.setItem("speakintel-visited", "true");
    } else {
      setIsFirstTime(false);
    }

    // Load progress metrics & activities
    setProgress(getProgressStats());
    setActivitiesList(getRecentActivities());
  }, [session]);

  const statsList = [
    {
      label: "Daily Practice",
      value: progress ? progress.dailyPractice.toString() : "0",
      unit: "min",
      icon: Clock,
      bgColor: "bg-purple-500/10",
      change: progress && progress.dailyPractice > 0 ? `+${progress.dailyPractice}m` : "New",
    },
    {
      label: "Current Streak",
      value: progress ? progress.currentStreak.toString() : "0",
      unit: "days",
      icon: Flame,
      bgColor: "bg-orange-500/10",
      change: "🔥",
    },
    {
      label: "Weekly Progress",
      value: progress ? progress.weeklyProgress.toString() : "0",
      unit: "%",
      icon: TrendingUp,
      bgColor: "bg-emerald-500/10",
      change: progress && progress.weeklyProgress > 0 ? `${progress.weeklyProgress}%` : "0%",
    },
    {
      label: "Communication",
      value: progress && progress.communicationScore > 0 ? progress.communicationScore.toString() : "0.0",
      unit: "/10",
      icon: Activity,
      bgColor: "bg-cyan-500/10",
      change: progress && progress.communicationScore > 0 ? `★ ${progress.communicationScore}` : "N/A",
    },
    {
      label: "Sessions Done",
      value: progress ? progress.sessionsDone.toString() : "0",
      unit: "",
      icon: CheckCircle,
      bgColor: "bg-blue-500/10",
      change: progress && progress.sessionsDone > 0 ? `+${progress.sessionsDone}` : "0",
    },
    {
      label: "Words Learned",
      value: progress ? progress.wordsLearned.toString() : "0",
      unit: "",
      icon: Brain,
      bgColor: "bg-pink-500/10",
      change: progress && progress.wordsLearned > 0 ? `+${progress.wordsLearned}` : "0",
    },
    {
      label: "Interview Score",
      value: progress && progress.interviewScore > 0 ? progress.interviewScore.toString() : "0.0",
      unit: "/10",
      icon: Target,
      bgColor: "bg-amber-500/10",
      change: progress && progress.interviewScore > 0 ? `★ ${progress.interviewScore}` : "N/A",
    },
  ];

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold">
          {`Welcome, ${userName}! 👋`}
        </h1>
        <p className="text-muted-foreground mt-1">
          {isFirstTime ? "Let's start your English learning journey today!" : "Here's your learning progress"}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {statsList.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="stat-card group"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-9 h-9 rounded-lg ${stat.bgColor} flex items-center justify-center`}
              >
                <stat.icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs text-emerald-400 font-medium">
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold">
              {stat.value}
              <span className="text-sm text-muted-foreground font-normal ml-0.5">
                {stat.unit}
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action, index) => (
            <Link key={action.label} href={action.href}>
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`glass-card p-5 text-center cursor-pointer group relative overflow-hidden`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
                <div className="relative z-10">
                  <div
                    className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3 ${action.iconColor}`}
                  >
                    <action.icon className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium mb-1">{action.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Bottom Section: Score Chart + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Communication Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-semibold mb-6">Communication Score</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {[
              { label: "Grammar", score: progress?.detailedScores?.grammar || 0, color: "#7c3aed" },
              { label: "Fluency", score: progress?.detailedScores?.fluency || 0, color: "#06b6d4" },
              { label: "Vocabulary", score: progress?.detailedScores?.vocabulary || 0, color: "#ec4899" },
              { label: "Confidence", score: progress?.detailedScores?.confidence || 0, color: "#10b981" },
              { label: "Pronunciation", score: progress?.detailedScores?.pronunciation || 0, color: "#f59e0b" },
              { label: "Speaking Speed", score: progress?.detailedScores?.speakingSpeed || 0, color: "#6366f1" },
              { label: "Listening", score: progress?.detailedScores?.listening || 0, color: "#8b5cf6" },
              { label: "Overall", score: progress?.detailedScores?.overall || 0, color: "#14b8a6" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div
                  className="score-circle mx-auto mb-2 bg-white/5"
                  style={
                    {
                      "--score-color": item.color,
                      "--score-percent": `${item.score}%`,
                    } as React.CSSProperties
                  }
                >
                  <span className="text-sm font-bold">{item.score || "—"}</span>
                </div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 flex flex-col h-full"
        >
          <div className="flex items-center justify-between mb-6 flex-shrink-0">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            {activitiesList.length > 0 && (
              <Link
                href="/progress"
                className="text-xs text-primary-light hover:underline flex items-center gap-1"
              >
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-center">
            {activitiesList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground">
                  <Mic className="w-6 h-6 animate-pulse text-primary-light" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">No practice history yet</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">
                    Start your first conversation with your AI English coach to see your scores update!
                  </p>
                </div>
                <Link
                  href="/conversation"
                  className="text-xs font-semibold px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20"
                >
                  Start Speaking
                </Link>
              </div>
            ) : (
              <div className="space-y-3 w-full">
                {activitiesList.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        activity.type === "conversation"
                          ? "bg-purple-500/15 text-purple-400"
                          : activity.type === "interview"
                          ? "bg-cyan-500/15 text-cyan-400"
                          : activity.type === "challenge"
                          ? "bg-amber-500/15 text-amber-400"
                          : "bg-pink-500/15 text-pink-400"
                      }`}
                    >
                      {activity.type === "conversation" ? (
                        <Mic className="w-5 h-5" />
                      ) : activity.type === "interview" ? (
                        <Briefcase className="w-5 h-5" />
                      ) : activity.type === "challenge" ? (
                        <Zap className="w-5 h-5" />
                      ) : (
                        <PenTool className="w-5 h-5" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-white">
                        {activity.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.duration} · {activity.time}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p
                        className={`text-sm font-bold ${
                          activity.score >= 8
                            ? "text-emerald-400"
                            : activity.score >= 6
                            ? "text-amber-400"
                            : "text-red-400"
                        }`}
                      >
                        {activity.score}/10
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Weekly Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-6"
      >
        <h2 className="text-lg font-semibold mb-6">This Week</h2>
        <div className="flex items-end gap-3 h-40">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
            (day, index) => {
              const heights = [60, 80, 45, 90, 70, 30, 0];
              const isToday = index === 6;
              return (
                <div
                  key={day}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heights[index]}%` }}
                    transition={{ delay: 0.7 + index * 0.05, duration: 0.5 }}
                    className={`w-full rounded-t-lg ${
                      isToday
                        ? "bg-white/10"
                        : heights[index] >= 70
                        ? "bg-gradient-to-t from-primary to-primary-light"
                        : heights[index] >= 40
                        ? "bg-gradient-to-t from-secondary to-secondary/60"
                        : "bg-white/10"
                    }`}
                  />
                  <span
                    className={`text-xs ${
                      isToday
                        ? "text-muted"
                        : "text-muted-foreground"
                    }`}
                  >
                    {day}
                  </span>
                </div>
              );
            }
          )}
        </div>
      </motion.div>
    </div>
  );
}
