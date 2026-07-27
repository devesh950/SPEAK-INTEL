"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Pause,
  Play,
  Square,
  RotateCcw,
  MessageSquare,
  X,
  ChevronUp,
  Sparkles,
  Volume2,
} from "lucide-react";

// ============================================
// TYPES
// ============================================

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  feedback?: {
    original: string;
    corrected: string;
    explanation: string;
  };
  scores?: {
    grammar: number;
    fluency: number;
    vocabulary: number;
  };
  timestamp: Date;
}

type ConversationState = "idle" | "listening" | "thinking" | "speaking";

// ============================================
// ANIMATED ORB COMPONENT
// ============================================

function AnimatedOrb({ state }: { state: ConversationState }) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow rings */}
      <motion.div
        animate={{
          scale: state === "listening" ? [1, 1.3, 1] : state === "speaking" ? [1, 1.2, 1] : 1,
          opacity: state === "idle" ? 0.3 : 0.6,
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-64 h-64 rounded-full"
        style={{
          background:
            state === "listening"
              ? "radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)"
              : state === "speaking"
              ? "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)",
        }}
      />

      <motion.div
        animate={{
          scale: state === "listening" ? [1, 1.15, 1] : state === "speaking" ? [1, 1.1, 1] : 1,
          opacity: state === "idle" ? 0.4 : 0.7,
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        className="absolute w-48 h-48 rounded-full"
        style={{
          background:
            state === "listening"
              ? "radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)",
        }}
      />

      {/* Main orb */}
      <motion.div
        animate={{
          scale:
            state === "listening"
              ? [1, 1.08, 1.02, 1.06, 1]
              : state === "speaking"
              ? [1, 1.04, 1, 1.03, 1]
              : state === "thinking"
              ? [1, 1.02, 1]
              : 1,
        }}
        transition={{
          duration: state === "listening" ? 1 : 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`relative w-36 h-36 rounded-full ${
          state === "listening"
            ? "animate-orb-listening"
            : state === "speaking"
            ? "animate-orb-pulse"
            : state === "thinking"
            ? "animate-spin-slow"
            : "animate-orb-pulse"
        }`}
        style={{
          background:
            state === "listening"
              ? "linear-gradient(135deg, #06b6d4, #7c3aed, #ec4899)"
              : state === "speaking"
              ? "linear-gradient(135deg, #7c3aed, #6d28d9, #4c1d95)"
              : state === "thinking"
              ? "linear-gradient(135deg, #f59e0b, #7c3aed, #06b6d4)"
              : "linear-gradient(135deg, #7c3aed, #6d28d9)",
        }}
      >
        {/* Inner glow */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/20 to-transparent" />

        {/* State icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          {state === "listening" ? (
            <Volume2 className="w-10 h-10 text-white/90" />
          ) : state === "thinking" ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-10 h-10 text-white/90" />
            </motion.div>
          ) : state === "speaking" ? (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <Volume2 className="w-10 h-10 text-white/90" />
            </motion.div>
          ) : (
            <Mic className="w-10 h-10 text-white/80" />
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// WAVEFORM COMPONENT
// ============================================

function Waveform({ active }: { active: boolean }) {
  return (
    <div className="flex items-center justify-center gap-1 h-12">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="wave-bar w-1 rounded-full bg-gradient-to-t from-primary to-secondary"
          style={{
            height: active ? `${20 + Math.random() * 30}px` : "4px",
          }}
          animate={{
            height: active
              ? [
                  `${10 + Math.random() * 20}px`,
                  `${30 + Math.random() * 20}px`,
                  `${10 + Math.random() * 20}px`,
                ]
              : "4px",
          }}
          transition={{
            duration: 0.4 + Math.random() * 0.3,
            repeat: active ? Infinity : 0,
            ease: "easeInOut",
            delay: i * 0.08,
          }}
        />
      ))}
    </div>
  );
}

// ============================================
// FEEDBACK CARD COMPONENT
// ============================================

function FeedbackCard({
  feedback,
}: {
  feedback: { original: string; corrected: string; explanation: string };
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 space-y-3 text-sm"
    >
      <div>
        <span className="text-xs font-medium text-red-400">You said:</span>
        <p className="text-muted-foreground mt-0.5">&ldquo;{feedback.original}&rdquo;</p>
      </div>
      <div>
        <span className="text-xs font-medium text-emerald-400">
          Better version:
        </span>
        <p className="text-white mt-0.5">&ldquo;{feedback.corrected}&rdquo;</p>
      </div>
      <div>
        <span className="text-xs font-medium text-primary-light">Why:</span>
        <p className="text-muted-foreground mt-0.5">{feedback.explanation}</p>
      </div>
    </motion.div>
  );
}

// ============================================
// MAIN CONVERSATION PAGE
// ============================================

export default function ConversationPage() {
  const [state, setState] = useState<ConversationState>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showTranscript, setShowTranscript] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Demo: Simulate conversation
  const handleMicClick = useCallback(() => {
    if (state === "idle") {
      setState("listening");
      // Simulate listening → thinking → AI response
      setTimeout(() => {
        const userMsg: Message = {
          id: Date.now().toString(),
          role: "user",
          content: "I am very excited for join this company because I think it will helping me to growing my career.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMsg]);
        setState("thinking");

        setTimeout(() => {
          const aiMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: "ai",
            content:
              "That's wonderful to hear about your enthusiasm! It's great that you're thinking about career growth. Let me help you express that more naturally. Could you tell me more about what specifically excites you about this company?",
            feedback: {
              original: "I am very excited for join this company because I think it will helping me to growing my career.",
              corrected: "I am very excited to join this company because I believe it will help me grow in my career.",
              explanation: "Use 'excited to join' (infinitive after excited), 'believe' is more professional than 'think', and 'help me grow' uses the correct verb form.",
            },
            scores: {
              grammar: 6,
              fluency: 7,
              vocabulary: 5,
            },
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, aiMsg]);
          setState("speaking");

          setTimeout(() => setState("idle"), 3000);
        }, 2000);
      }, 3000);
    } else if (state === "listening") {
      setState("idle");
    }
  }, [state]);

  const handleTextSubmit = () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setState("thinking");

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "Great practice! Keep going — you're improving with every conversation. What would you like to discuss next?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setState("idle");
    }, 2000);
  };

  const handleEndSession = () => {
    setState("idle");
    setMessages([]);
    setShowTranscript(false);
  };

  // Scroll to bottom of transcript
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed inset-0 bg-background z-20 flex flex-col">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero opacity-50" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-primary/5 blur-[200px]" />

      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-4 glass-strong border-b border-border">
        <div className="flex items-center gap-3">
          <a href="/dashboard" className="text-muted-foreground hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </a>
          <div>
            <h1 className="text-sm font-semibold">AI Conversation</h1>
            <p className="text-xs text-muted-foreground">
              {state === "listening"
                ? "Listening..."
                : state === "thinking"
                ? "Thinking..."
                : state === "speaking"
                ? "Speaking..."
                : "Tap the mic to start"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Live Scores */}
          {messages.length > 0 && (
            <div className="hidden sm:flex items-center gap-3 mr-4">
              {[
                { label: "G", score: 6, color: "text-amber-400" },
                { label: "F", score: 7, color: "text-emerald-400" },
                { label: "V", score: 5, color: "text-purple-400" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-1 text-xs"
                >
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className={`font-bold ${s.color}`}>{s.score}</span>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className={`p-2 rounded-lg transition-all ${
              showTranscript
                ? "bg-primary/20 text-primary-light"
                : "text-muted-foreground hover:text-white hover:bg-white/5"
            }`}
          >
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 relative z-10 flex">
        {/* Center: Orb + Controls */}
        <div
          className={`flex-1 flex flex-col items-center justify-center transition-all ${
            showTranscript ? "hidden sm:flex sm:w-1/2" : ""
          }`}
        >
          {/* Status text */}
          <motion.p
            key={state}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-muted-foreground mb-8"
          >
            {state === "idle" && messages.length === 0
              ? "Tap the microphone to begin"
              : state === "idle"
              ? "Ready for your next message"
              : state === "listening"
              ? "I'm listening..."
              : state === "thinking"
              ? "Processing your response..."
              : "AI Coach is speaking..."}
          </motion.p>

          {/* Animated Orb */}
          <AnimatedOrb state={state} />

          {/* Waveform */}
          <div className="mt-8">
            <Waveform active={state === "listening" || state === "speaking"} />
          </div>

          {/* Controls */}
          <div className="mt-12 flex items-center gap-6">
            {/* Pause/Resume */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsPaused(!isPaused)}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white transition-all"
            >
              {isPaused ? (
                <Play className="w-5 h-5" />
              ) : (
                <Pause className="w-5 h-5" />
              )}
            </motion.button>

            {/* Main Mic Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMicClick}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                state === "listening"
                  ? "bg-red-500 shadow-lg shadow-red-500/30"
                  : "gradient-primary shadow-lg shadow-primary/30 hover:shadow-primary/50"
              }`}
            >
              {state === "listening" ? (
                <MicOff className="w-8 h-8 text-white" />
              ) : (
                <Mic className="w-8 h-8 text-white" />
              )}
            </motion.button>

            {/* End Session */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleEndSession}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-red-400 transition-all"
            >
              <Square className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Text Input */}
          <div className="mt-8 w-full max-w-md px-4">
            <div className="flex items-center gap-2 glass rounded-xl px-4 py-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
                placeholder="Or type your message..."
                className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted"
              />
              <button
                onClick={handleTextSubmit}
                className="text-primary-light hover:text-white transition-colors"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Transcript Panel */}
        <AnimatePresence>
          {showTranscript && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className={`${
                showTranscript ? "w-full sm:w-1/2" : ""
              } h-full border-l border-border glass-strong flex flex-col`}
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="text-sm font-semibold">Transcript</h2>
                <button
                  onClick={() => setShowTranscript(false)}
                  className="sm:hidden text-muted-foreground hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground text-sm py-20">
                    <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p>Your conversation will appear here</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] space-y-2 ${
                          msg.role === "user" ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`p-3 rounded-2xl text-sm ${
                            msg.role === "user"
                              ? "bg-primary/20 text-white rounded-br-md"
                              : "glass rounded-bl-md"
                          }`}
                        >
                          {msg.content}
                        </div>

                        {/* Feedback Card */}
                        {msg.feedback && (
                          <FeedbackCard feedback={msg.feedback} />
                        )}

                        {/* Mini Scores */}
                        {msg.scores && (
                          <div className="flex gap-2">
                            {Object.entries(msg.scores).map(([key, value]) => (
                              <span
                                key={key}
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  value >= 7
                                    ? "bg-emerald-500/15 text-emerald-400"
                                    : value >= 5
                                    ? "bg-amber-500/15 text-amber-400"
                                    : "bg-red-500/15 text-red-400"
                                }`}
                              >
                                {key}: {value}/10
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
