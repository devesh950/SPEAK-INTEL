/* ============================================
   SpeakIntel AI - TypeScript Types
   ============================================ */

// ---- User ----
export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  level: "beginner" | "intermediate" | "advanced";
  xp: number;
  coins: number;
  currentLevel: number;
  streak: number;
}

// ---- Conversation ----
export interface ConversationMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  audioUrl?: string;
  feedback?: AIFeedback;
  scores?: CommunicationScores;
  timestamp: Date;
}

export interface AIFeedback {
  original: string;
  corrected: string;
  explanation: string;
}

export interface CommunicationScores {
  grammar: number;
  fluency: number;
  vocabulary: number;
  confidence: number;
  pronunciation: number;
  speakingSpeed: number;
  overall: number;
}

// ---- Session ----
export interface Session {
  id: string;
  mode: SessionMode;
  role?: string;
  status: "active" | "paused" | "completed";
  duration: number;
  startedAt: Date;
  endedAt?: Date;
  scores?: CommunicationScores;
  messages: ConversationMessage[];
}

export type SessionMode = "general" | "interview" | "roleplay" | "grammar" | "pronunciation";

// ---- Interview ----
export interface InterviewRole {
  id: string;
  title: string;
  icon: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface InterviewReport {
  sessionId: string;
  role: string;
  scores: {
    confidence: number;
    technicalAccuracy: number;
    communication: number;
    grammar: number;
    vocabulary: number;
    overall: number;
  };
  strengths: string[];
  weaknesses: string[];
  improvementPlan: string[];
}

// ---- Roleplay ----
export interface RoleplayMode {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
}

// ---- Vocabulary ----
export interface VocabularyWord {
  id: string;
  word: string;
  meaning: string;
  pronunciation?: string;
  hindiTranslation?: string;
  synonyms: string[];
  antonyms: string[];
  exampleSentence?: string;
  difficulty: string;
  mastered: boolean;
}

// ---- Challenge ----
export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: string;
  duration: number; // minutes
  xpReward: number;
  completed: boolean;
}

// ---- Progress ----
export interface DailyProgress {
  date: string;
  practiceTime: number;
  sessionsCount: number;
  wordsLearned: number;
  grammarScore: number;
  fluencyScore: number;
  xpEarned: number;
}

export interface DashboardStats {
  dailyPracticeTime: number;
  currentStreak: number;
  weeklyProgress: number;
  communicationScore: number;
  completedSessions: number;
  vocabularyLearned: number;
  interviewScore: number;
}

// ---- Achievement ----
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  unlockedAt?: Date;
}

// ---- Leaderboard ----
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  image?: string;
  xp: number;
  level: number;
  streak: number;
}

// ---- WebSocket ----
export interface WSMessage {
  type: "text" | "audio" | "control" | "config";
  data?: string | Record<string, unknown>;
  action?: string;
}

export interface WSResponse {
  type: "ai_response" | "transcript" | "feedback" | "scores" | "status" | "system" | "error" | "session_end" | "config_updated";
  data: unknown;
}

// ---- Settings ----
export interface UserSettings {
  darkMode: boolean;
  language: string;
  voiceSpeed: number;
  aiVoice: string;
  theme: string;
  notificationsEnabled: boolean;
  dailyReminder: boolean;
  weeklyReport: boolean;
}

// ---- Pricing ----
export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  cta: string;
}
