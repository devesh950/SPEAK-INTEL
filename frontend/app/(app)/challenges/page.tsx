"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getProgressStats } from "@/lib/progress";
import {
  Mic,
  BookOpen,
  MessageSquare,
  Swords,
  Lightbulb,
  Newspaper,
  Shuffle,
  Presentation,
  Rocket,
  Clock,
  Star,
  Flame,
  Lock,
} from "lucide-react";

const challengeTemplates = [
  { id: "introduce", title: "Introduce Yourself", description: "Give a 2-minute self-introduction", icon: Mic, duration: 2, xp: 50, reqSessions: 1 },
  { id: "story", title: "Tell a Story", description: "Narrate an interesting story from your life", icon: BookOpen, duration: 5, xp: 80, reqSessions: 2 },
  { id: "describe", title: "Describe a Picture", description: "Describe what you see in detail", icon: Lightbulb, duration: 3, xp: 60, reqSessions: 3 },
  { id: "debate", title: "Debate", description: "Argue for or against a given topic", icon: Swords, duration: 10, xp: 120, reqSessions: 4 },
  { id: "explain", title: "Explain a Topic", description: "Explain a concept clearly and simply", icon: MessageSquare, duration: 5, xp: 80, reqSessions: 5 },
  { id: "news", title: "News Discussion", description: "Discuss a current news topic", icon: Newspaper, duration: 8, xp: 100, reqSessions: 6 },
  { id: "random", title: "Random Conversation", description: "Talk about anything for 5 minutes", icon: Shuffle, duration: 5, xp: 70, reqSessions: 7 },
  { id: "presentation", title: "Presentation Practice", description: "Deliver a short presentation", icon: Presentation, duration: 10, xp: 150, reqSessions: 8 },
  { id: "elevator", title: "Elevator Pitch", description: "Pitch an idea in 60 seconds", icon: Rocket, duration: 1, xp: 100, reqSessions: 9 },
];

export default function ChallengesPage() {
  const [sessionsDone, setSessionsDone] = useState(0);

  useEffect(() => {
    const stats = getProgressStats();
    setSessionsDone(stats.sessionsDone || 0);
  }, []);

  const challenges = challengeTemplates.map((c) => ({
    ...c,
    completed: sessionsDone >= c.reqSessions,
  }));

  const completedCount = challenges.filter((c) => c.completed).length;

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold">Daily Challenges</h1>
        <p className="text-muted-foreground mt-1">
          Complete challenges to earn XP and improve
        </p>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-5"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <span className="text-sm font-medium">Today&apos;s Progress</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {completedCount}/{challenges.length} completed
          </span>
        </div>
        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / challenges.length) * 100}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
          />
        </div>
      </motion.div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {challenges.map((challenge, index) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`glass-card p-5 group cursor-pointer hover:border-primary/30 transition-all hover:-translate-y-1 ${
              challenge.completed ? "opacity-60" : ""
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-primary-light">
                <challenge.icon className="w-5 h-5" />
              </div>
              {challenge.completed ? (
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">
                  ✓ Done
                </span>
              ) : (
                <div className="flex items-center gap-1 text-xs text-amber-400">
                  <Star className="w-3 h-3" />
                  {challenge.xp} XP
                </div>
              )}
            </div>
            <h3 className="font-medium mb-1">{challenge.title}</h3>
            <p className="text-xs text-muted-foreground mb-3">{challenge.description}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {challenge.duration} min
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
