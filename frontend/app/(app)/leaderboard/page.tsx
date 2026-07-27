"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Flame, Star, Crown, Award, TrendingUp } from "lucide-react";

const leaderboardData = [
  { rank: 1, name: "Arun Patel", xp: 12500, level: 15, streak: 45, avatar: "AP" },
  { rank: 2, name: "Sneha Reddy", xp: 11200, level: 14, streak: 38, avatar: "SR" },
  { rank: 3, name: "Vikram Singh", xp: 10800, level: 13, streak: 42, avatar: "VS" },
  { rank: 4, name: "Priya Sharma", xp: 9600, level: 12, streak: 28, avatar: "PS" },
  { rank: 5, name: "Rahul Verma", xp: 8900, level: 11, streak: 25, avatar: "RV" },
  { rank: 6, name: "Anita Desai", xp: 8200, level: 10, streak: 20, avatar: "AD" },
  { rank: 7, name: "Kiran Kumar", xp: 7500, level: 9, streak: 18, avatar: "KK" },
  { rank: 8, name: "Meera Nair", xp: 6800, level: 8, streak: 15, avatar: "MN" },
  { rank: 9, name: "Arjun Das", xp: 6100, level: 7, streak: 12, avatar: "AR" },
  { rank: 10, name: "Lakshmi Iyer", xp: 5500, level: 6, streak: 10, avatar: "LI" },
];

const achievements = [
  { name: "First Words", description: "Complete your first conversation", icon: "🎤", unlocked: true },
  { name: "Week Warrior", description: "Practice for 7 days in a row", icon: "🔥", unlocked: true },
  { name: "Vocabulary Hero", description: "Learn 100 new words", icon: "📚", unlocked: true },
  { name: "Interview Pro", description: "Score 8+ in a mock interview", icon: "💼", unlocked: true },
  { name: "Grammar Master", description: "Achieve 90% grammar accuracy", icon: "✍️", unlocked: false },
  { name: "Fluent Speaker", description: "30-day streak", icon: "🏆", unlocked: false },
  { name: "Polyglot", description: "Learn 500 vocabulary words", icon: "🌍", unlocked: false },
  { name: "Perfectionist", description: "Score 10/10 in any session", icon: "⭐", unlocked: false },
];

export default function LeaderboardPage() {
  const [tab, setTab] = useState<"weekly" | "monthly" | "all">("weekly");

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground mt-1">
          Compete with learners worldwide
        </p>
      </motion.div>

      {/* Your Rank */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-5 gradient-border"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center text-lg font-bold">
            U
          </div>
          <div className="flex-1">
            <p className="font-semibold">You</p>
            <p className="text-sm text-muted-foreground">Level 8 · 6,800 XP</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary-light">#8</p>
            <div className="flex items-center gap-1 text-xs text-emerald-400">
              <TrendingUp className="w-3 h-3" /> +3 this week
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        {(["weekly", "monthly", "all"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm capitalize transition-all ${
              tab === t
                ? "gradient-primary text-white"
                : "bg-white/5 text-muted-foreground hover:bg-white/10"
            }`}
          >
            {t === "all" ? "All Time" : t}
          </button>
        ))}
      </div>

      {/* Top 3 Podium */}
      <div className="flex items-end justify-center gap-4 pt-8">
        {[leaderboardData[1], leaderboardData[0], leaderboardData[2]].map(
          (user, i) => {
            const heights = ["h-24", "h-32", "h-20"];
            const medals = [Medal, Crown, Medal];
            const colors = ["text-gray-400", "text-amber-400", "text-amber-700"];
            const MedalIcon = medals[i];
            return (
              <motion.div
                key={user.rank}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="flex flex-col items-center"
              >
                <MedalIcon className={`w-6 h-6 ${colors[i]} mb-2`} />
                <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center font-bold mb-2">
                  {user.avatar}
                </div>
                <p className="text-sm font-medium text-center">{user.name.split(" ")[0]}</p>
                <p className="text-xs text-muted-foreground">{user.xp.toLocaleString()} XP</p>
                <div className={`${heights[i]} w-20 mt-3 rounded-t-xl bg-gradient-to-t from-primary/30 to-primary/10 flex items-end justify-center pb-2`}>
                  <span className="text-lg font-bold">#{user.rank}</span>
                </div>
              </motion.div>
            );
          }
        )}
      </div>

      {/* Rankings Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card overflow-hidden"
      >
        {leaderboardData.map((user, index) => (
          <motion.div
            key={user.rank}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.05 }}
            className={`flex items-center gap-4 p-4 ${
              index < leaderboardData.length - 1 ? "border-b border-border" : ""
            } hover:bg-white/5 transition-colors`}
          >
            <span className={`w-8 text-center text-sm font-bold ${
              user.rank <= 3 ? "text-amber-400" : "text-muted-foreground"
            }`}>
              #{user.rank}
            </span>
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold">
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground">Level {user.level}</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-orange-400">
              <Flame className="w-3 h-3" />
              {user.streak}
            </div>
            <div className="text-right">
              <p className="text-sm font-bold">{user.xp.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">XP</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Achievements */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          Achievements
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              className={`glass-card p-4 text-center ${
                !achievement.unlocked ? "opacity-40" : ""
              }`}
            >
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <p className="text-xs font-medium mb-1">{achievement.name}</p>
              <p className="text-[10px] text-muted-foreground">{achievement.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
