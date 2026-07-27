import { create } from "zustand";

interface ConversationMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  feedback?: {
    original: string;
    corrected: string;
    explanation: string;
  };
  scores?: Record<string, number>;
  timestamp: Date;
}

interface ConversationState {
  // Session
  sessionId: string | null;
  mode: "general" | "interview" | "roleplay" | "grammar" | "pronunciation";
  role: string | null;
  level: "beginner" | "intermediate" | "advanced";
  status: "idle" | "listening" | "thinking" | "speaking" | "paused";

  // Messages
  messages: ConversationMessage[];

  // Scores
  currentScores: Record<string, number>;

  // Actions
  setSession: (sessionId: string) => void;
  setMode: (mode: ConversationState["mode"]) => void;
  setRole: (role: string | null) => void;
  setLevel: (level: ConversationState["level"]) => void;
  setStatus: (status: ConversationState["status"]) => void;
  addMessage: (message: ConversationMessage) => void;
  updateScores: (scores: Record<string, number>) => void;
  reset: () => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
  sessionId: null,
  mode: "general",
  role: null,
  level: "intermediate",
  status: "idle",
  messages: [],
  currentScores: {},

  setSession: (sessionId) => set({ sessionId }),
  setMode: (mode) => set({ mode }),
  setRole: (role) => set({ role }),
  setLevel: (level) => set({ level }),
  setStatus: (status) => set({ status }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  updateScores: (scores) => set({ currentScores: scores }),
  reset: () =>
    set({
      sessionId: null,
      mode: "general",
      role: null,
      status: "idle",
      messages: [],
      currentScores: {},
    }),
}));
