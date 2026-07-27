"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Calendar, Flame, Clock, Brain, Award } from "lucide-react";

const weeklyData = [
  { day: "Mon", practice: 45, score: 7.2 },
  { day: "Tue", practice: 60, score: 7.5 },
  { day: "Wed", practice: 30, score: 7.1 },
  { day: "Thu", practice: 75, score: 7.8 },
  { day: "Fri", practice: 50, score: 7.6 },
  { day: "Sat", practice: 20, score: 7.0 },
  { day: "Sun", practice: 0, score: 0 },
];

const monthlyScores = [
  { month: "Jan", score: 5.8 },
  { month: "Feb", score: 6.2 },
  { month: "Mar", score: 6.5 },
  { month: "Apr", score: 6.8 },
  { month: "May", score: 7.1 },
  { month: "Jun", score: 7.4 },
  { month: "Jul", score: 7.8 },
];

const streakCalendar = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  active: Math.random() > 0.3,
}));

export default function ProgressPage() {
  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold">Progress Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Track your improvement over time
        </p>
      </motion.div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Practice", value: "48h 30m", icon: Clock, color: "text-purple-400" },
          { label: "Longest Streak", value: "14 days", icon: Flame, color: "text-orange-400" },
          { label: "Words Mastered", value: "89", icon: Brain, color: "text-cyan-400" },
          { label: "Achievements", value: "12", icon: Award, color: "text-amber-400" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="stat-card"
          >
            <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
            <p className="text-xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Practice Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary-light" />
            Weekly Practice
          </h2>
          <div className="flex items-end gap-3 h-48">
            {weeklyData.map((data, i) => (
              <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-muted-foreground">{data.practice}m</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.practice / 80) * 100}%` }}
                  transition={{ delay: 0.4 + i * 0.05, duration: 0.5 }}
                  className="w-full rounded-t-lg bg-gradient-to-t from-primary to-primary-light min-h-[4px]"
                />
                <span className="text-xs text-muted-foreground">{data.day}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Monthly Score Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Score Trend
          </h2>
          <div className="flex items-end gap-3 h-48">
            {monthlyScores.map((data, i) => (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-muted-foreground">{data.score}</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.score / 10) * 100}%` }}
                  transition={{ delay: 0.5 + i * 0.05, duration: 0.5 }}
                  className="w-full rounded-t-lg bg-gradient-to-t from-emerald-500 to-emerald-400"
                />
                <span className="text-xs text-muted-foreground">{data.month}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Streak Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6"
      >
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-orange-400" />
          Streak Calendar — July 2026
        </h2>
        <div className="grid grid-cols-7 gap-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-xs text-muted-foreground py-1">
              {day}
            </div>
          ))}
          {/* Offset for first day */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {streakCalendar.map((day) => (
            <motion.div
              key={day.day}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 + day.day * 0.02 }}
              className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium ${
                day.active
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-white/5 text-muted"
              }`}
            >
              {day.day}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Skill Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-6"
      >
        <h2 className="text-lg font-semibold mb-6">Skill Improvement</h2>
        <div className="space-y-4">
          {[
            { skill: "Grammar", current: 78, previous: 65, color: "from-purple-500 to-purple-400" },
            { skill: "Fluency", current: 72, previous: 58, color: "from-cyan-500 to-cyan-400" },
            { skill: "Vocabulary", current: 65, previous: 52, color: "from-pink-500 to-pink-400" },
            { skill: "Confidence", current: 80, previous: 70, color: "from-emerald-500 to-emerald-400" },
            { skill: "Pronunciation", current: 68, previous: 55, color: "from-amber-500 to-amber-400" },
          ].map((skill, i) => (
            <div key={skill.skill}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm">{skill.skill}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{skill.previous}%</span>
                  <span className="text-xs text-muted-foreground">→</span>
                  <span className="text-sm font-bold">{skill.current}%</span>
                  <span className="text-xs text-emerald-400">+{skill.current - skill.previous}%</span>
                </div>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.current}%` }}
                  transition={{ delay: 0.7 + i * 0.1, duration: 0.8 }}
                  className={`h-full rounded-full bg-gradient-to-r ${skill.color}`}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
