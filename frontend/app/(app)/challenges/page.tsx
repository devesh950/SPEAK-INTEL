"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getProgressStats, updateRealtimeProgress } from "@/lib/progress";
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
  X,
  ArrowRight,
  CheckCircle2,
  Volume2,
  MicOff,
  Play,
  RotateCcw,
  Trophy,
  Zap,
} from "lucide-react";
import { sendMessage } from "@/lib/api";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  duration: number;
  xp: number;
  reqSessions: number;
  prompt: string;           // what the AI opens with
  tip: string;              // coaching tip shown in modal
  category: "Speaking" | "Debate" | "Story" | "Presentation";
  color: string;
  iconColor: string;
}

// ─── Challenge Data ───────────────────────────────────────────────────────────

const challengeTemplates: Omit<Challenge, "completed">[] = [
  {
    id: "introduce",
    title: "Introduce Yourself",
    description: "Give a confident 2-minute self-introduction",
    icon: Mic,
    duration: 2,
    xp: 50,
    reqSessions: 0,
    prompt: "I want you to listen to my self-introduction and give me detailed feedback on confidence, clarity, vocabulary, and structure. I will now introduce myself — please listen, then evaluate and coach me.",
    tip: "Structure: Name → Background → Skills → Goal. Keep it under 2 minutes, smile in your voice!",
    category: "Speaking",
    color: "from-violet-500/20 to-violet-600/5",
    iconColor: "text-violet-400",
  },
  {
    id: "story",
    title: "Tell a Story",
    description: "Narrate an interesting story from your life",
    icon: BookOpen,
    duration: 5,
    xp: 80,
    reqSessions: 0,
    prompt: "I am going to narrate a personal story. Please listen carefully and then give me feedback on my storytelling — narrative flow, descriptive vocabulary, grammar, and engaging delivery.",
    tip: "Use the STAR method: Situation → Task → Action → Result. Add emotions and sensory details.",
    category: "Story",
    color: "from-amber-500/20 to-amber-600/5",
    iconColor: "text-amber-400",
  },
  {
    id: "describe",
    title: "Describe a Picture",
    description: "Describe an imaginary scene in vivid detail",
    icon: Lightbulb,
    duration: 3,
    xp: 60,
    reqSessions: 0,
    prompt: "Imagine a busy city street at sunset. I will now describe this scene in as much detail as possible — please evaluate my descriptive vocabulary, sentence variety, and fluency.",
    tip: "Use all 5 senses: sight, sound, smell, touch, and movement. Use vivid adjectives.",
    category: "Speaking",
    color: "from-yellow-500/20 to-yellow-600/5",
    iconColor: "text-yellow-400",
  },
  {
    id: "debate",
    title: "Debate",
    description: "Argue for or against a given topic with confidence",
    icon: Swords,
    duration: 10,
    xp: 120,
    reqSessions: 0,
    prompt: "Let's have a debate. The topic is: 'Social media does more harm than good.' I will argue FOR this statement. Please play the role of the opposing debater and challenge my arguments. After the debate, give me feedback on my argumentation, vocabulary, and persuasion skills.",
    tip: "State your point → Give 2 evidence examples → Anticipate counter-arguments → Strong conclusion.",
    category: "Debate",
    color: "from-red-500/20 to-red-600/5",
    iconColor: "text-red-400",
  },
  {
    id: "explain",
    title: "Explain a Topic",
    description: "Explain any concept clearly to a beginner",
    icon: MessageSquare,
    duration: 5,
    xp: 80,
    reqSessions: 0,
    prompt: "I am going to explain a concept of my choice as if explaining to a complete beginner. Please listen and then give me feedback on clarity, logical structure, vocabulary simplicity, and how well I communicated the idea.",
    tip: "Use the Feynman technique: simple words, analogies, and check understanding with examples.",
    category: "Speaking",
    color: "from-emerald-500/20 to-emerald-600/5",
    iconColor: "text-emerald-400",
  },
  {
    id: "news",
    title: "News Discussion",
    description: "Discuss and analyse a current news topic",
    icon: Newspaper,
    duration: 8,
    xp: 100,
    reqSessions: 0,
    prompt: "Let's have a news discussion. I will bring up a current topic and share my opinion. Please engage as a discussion partner — agree or disagree, ask follow-up questions, and after the conversation give me feedback on my communication, vocabulary, and critical thinking.",
    tip: "Share your opinion clearly, use phrases like 'In my view...', 'Studies suggest...', 'On the other hand...'",
    category: "Debate",
    color: "from-cyan-500/20 to-cyan-600/5",
    iconColor: "text-cyan-400",
  },
  {
    id: "random",
    title: "Random Conversation",
    description: "Keep a natural conversation going for 5 minutes",
    icon: Shuffle,
    duration: 5,
    xp: 70,
    reqSessions: 0,
    prompt: "Let's have a completely open and natural conversation for about 5 minutes. Start with any interesting topic you like and keep the conversation flowing. Give me feedback at the end on my spontaneity, vocabulary range, and fluency.",
    tip: "Don't overthink — just speak! It's okay to pause, self-correct, or use fillers naturally.",
    category: "Speaking",
    color: "from-sky-500/20 to-sky-600/5",
    iconColor: "text-sky-400",
  },
  {
    id: "presentation",
    title: "Presentation Practice",
    description: "Deliver a structured short presentation",
    icon: Presentation,
    duration: 10,
    xp: 150,
    reqSessions: 0,
    prompt: "I am going to deliver a short presentation (about 3–5 minutes) on a topic of my choice. Please listen as an audience member and then give me structured feedback on: opening hook, body organisation, conclusion, vocabulary, confidence, and pacing.",
    tip: "Hook → 3 key points → Summary → Call to action. Pause after key statements for impact.",
    category: "Presentation",
    color: "from-pink-500/20 to-pink-600/5",
    iconColor: "text-pink-400",
  },
  {
    id: "elevator",
    title: "Elevator Pitch",
    description: "Pitch a business idea convincingly in 60 seconds",
    icon: Rocket,
    duration: 1,
    xp: 100,
    reqSessions: 0,
    prompt: "I am going to give you a 60-second elevator pitch for a business idea or a product. Please listen and then evaluate: clarity, persuasiveness, enthusiasm, structure, and how well I handled the time constraint.",
    tip: "Problem → Solution → Unique value → Call to action. Practice until you can do it without notes.",
    category: "Presentation",
    color: "from-orange-500/20 to-orange-600/5",
    iconColor: "text-orange-400",
  },
];

// ─── Challenge Modal ──────────────────────────────────────────────────────────

function ChallengeModal({
  challenge,
  onClose,
  onStartSession,
}: {
  challenge: Challenge & { completed: boolean };
  onClose: () => void;
  onStartSession: (challenge: Challenge & { completed: boolean }) => void;
}) {
  const categoryColors: Record<string, string> = {
    Speaking: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    Debate: "bg-red-500/20 text-red-300 border-red-500/30",
    Story: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    Presentation: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: "spring", damping: 25 }}
        className="relative w-full max-w-md bg-[#111113] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header gradient strip */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${challenge.color.replace("/20", "").replace("/5", "")}`} />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/10 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6">
          {/* Icon + category */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${challenge.iconColor}`}>
              <challenge.icon className="w-6 h-6" />
            </div>
            <div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${categoryColors[challenge.category]}`}>
                {challenge.category}
              </span>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" /> {challenge.duration} min
                </span>
                <span className="flex items-center gap-1 text-xs text-amber-400">
                  <Star className="w-3 h-3" /> {challenge.xp} XP
                </span>
              </div>
            </div>
          </div>

          {/* Title & description */}
          <h2 className="text-xl font-bold mb-2">{challenge.title}</h2>
          <p className="text-sm text-muted-foreground mb-5">{challenge.description}</p>

          {/* Coaching tip */}
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-5">
            <p className="text-xs font-semibold text-primary-light mb-1">💡 Coaching Tip</p>
            <p className="text-xs text-white/80 leading-relaxed">{challenge.tip}</p>
          </div>

          {/* What happens */}
          <div className="space-y-2 mb-6">
            {[
              "AI listens to your speaking and gives real-time coaching",
              "Grammar, fluency & vocabulary all scored",
              "Earn XP upon completion",
            ].map((point, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                {point}
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => onStartSession(challenge)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/30"
          >
            {challenge.completed ? (
              <>
                <RotateCcw className="w-4 h-4" /> Redo Challenge
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Start Challenge
              </>
            )}
          </button>

          {challenge.completed && (
            <p className="text-center text-xs text-emerald-400 mt-3 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> You have already completed this challenge!
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ChallengesPage() {
  const [sessionsDone, setSessionsDone] = useState(0);
  const [selectedChallenge, setSelectedChallenge] = useState<(typeof challenges)[number] | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const stats = getProgressStats();
    setSessionsDone(stats.sessionsDone || 0);
    // Load completed challenges from localStorage
    try {
      const saved = JSON.parse(localStorage.getItem("speakintel-completed-challenges") || "[]");
      setCompletedIds(new Set(saved));
    } catch {}
  }, []);

  const challenges = challengeTemplates.map((c) => ({
    ...c,
    completed: completedIds.has(c.id),
  }));

  const filters = ["All", "Speaking", "Debate", "Story", "Presentation"];
  const filteredChallenges =
    activeFilter === "All"
      ? challenges
      : challenges.filter((c) => c.category === activeFilter);

  const completedCount = challenges.filter((c) => c.completed).length;
  const totalXP = challenges.filter((c) => c.completed).reduce((sum, c) => sum + c.xp, 0);

  const handleStartSession = (challenge: (typeof challenges)[number]) => {
    // Navigate to conversation page with challenge prompt injected as a special param
    const encoded = encodeURIComponent(challenge.prompt);
    window.location.href = `/conversation?mode=challenge&challenge=${challenge.id}&prompt=${encoded}`;
  };

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold">Daily Challenges</h1>
        <p className="text-muted-foreground mt-1">
          Complete speaking challenges to earn XP and level up
        </p>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-3 gap-3"
      >
        {[
          { label: "Completed", value: `${completedCount}/${challenges.length}`, icon: CheckCircle2, color: "text-emerald-400" },
          { label: "XP Earned", value: `${totalXP}`, icon: Star, color: "text-amber-400" },
          { label: "Streak", value: `${Math.min(completedCount, 7)}d`, icon: Flame, color: "text-orange-400" },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4 text-center">
            <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
            <p className="text-lg font-bold">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-5"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-medium">Overall Progress</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {Math.round((completedCount / challenges.length) * 100)}%
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
        {completedCount === challenges.length && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-xs text-emerald-400 mt-2 font-medium"
          >
            🎉 All challenges completed! You're a champion!
          </motion.p>
        )}
      </motion.div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === filter
                ? "bg-primary/20 border border-primary/40 text-primary-light"
                : "bg-white/5 border border-white/10 text-muted-foreground hover:border-primary/30 hover:text-white"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredChallenges.map((challenge, index) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedChallenge(challenge)}
            className={`glass-card p-5 group cursor-pointer hover:border-primary/30 transition-all hover:-translate-y-1 relative overflow-hidden ${
              challenge.completed ? "border-emerald-500/20" : ""
            }`}
          >
            {/* Hover gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${challenge.color} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />

            {/* Completed shimmer */}
            {challenge.completed && (
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-400" />
            )}

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center ${challenge.iconColor}`}>
                  <challenge.icon className="w-5 h-5" />
                </div>
                {challenge.completed ? (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
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

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {challenge.duration} min
                </div>
                <div className="flex items-center gap-1 text-xs text-primary-light opacity-0 group-hover:opacity-100 transition-opacity">
                  Start <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Challenge Detail Modal */}
      <AnimatePresence>
        {selectedChallenge && (
          <ChallengeModal
            challenge={selectedChallenge}
            onClose={() => setSelectedChallenge(null)}
            onStartSession={(ch) => {
              setSelectedChallenge(null);
              handleStartSession(ch);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
