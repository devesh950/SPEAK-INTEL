"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PenTool, Check, X, ArrowRight, Lightbulb, Send } from "lucide-react";

const grammarExercises = [
  {
    original: "He don't know nothing about it.",
    corrected: "He doesn't know anything about it.",
    rule: "Double Negative + Subject-Verb Agreement",
    explanation: "Use 'doesn't' with third-person singular subjects. Avoid double negatives — use 'anything' instead of 'nothing' with 'don't'.",
  },
  {
    original: "I have went to the store yesterday.",
    corrected: "I went to the store yesterday.",
    rule: "Tense Consistency",
    explanation: "Use simple past 'went' with 'yesterday', not present perfect 'have went'. Also, the past participle of 'go' is 'gone', not 'went'.",
  },
  {
    original: "She is more smarter than her brother.",
    corrected: "She is smarter than her brother.",
    rule: "Comparative Adjectives",
    explanation: "Don't use 'more' with adjectives that already have '-er' endings. 'Smarter' is already comparative.",
  },
  {
    original: "Each of the students have submitted their assignment.",
    corrected: "Each of the students has submitted their assignment.",
    rule: "Subject-Verb Agreement",
    explanation: "'Each' is singular and takes a singular verb 'has', not 'have'.",
  },
];

export default function GrammarPage() {
  const [inputText, setInputText] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(false);

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold">Grammar Coach</h1>
        <p className="text-muted-foreground mt-1">
          Detect and fix grammar errors with AI explanations
        </p>
      </motion.div>

      {/* Score Cards */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {[
          { label: "Tenses", score: 75 },
          { label: "Articles", score: 68 },
          { label: "Prepositions", score: 82 },
          { label: "Structure", score: 70 },
          { label: "Passive Voice", score: 60 },
          { label: "SVA", score: 85 },
        ].map((item) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="stat-card text-center"
          >
            <p className={`text-xl font-bold ${
              item.score >= 80 ? "text-emerald-400" : item.score >= 60 ? "text-amber-400" : "text-red-400"
            }`}>{item.score}%</p>
            <p className="text-[10px] text-muted-foreground mt-1">{item.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Input Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h2 className="text-sm font-medium mb-3">Check Your Grammar</h2>
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste your English text here to check grammar..."
            className="w-full h-32 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted resize-none"
          />
          <button
            onClick={() => setShowAnalysis(true)}
            className="absolute bottom-3 right-3 btn-primary text-xs !py-2 !px-4 flex items-center gap-1"
          >
            <Send className="w-3 h-3" /> Analyze
          </button>
        </div>
      </motion.div>

      {/* Grammar Exercises */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Common Corrections</h2>
        <div className="space-y-4">
          {grammarExercises.map((exercise, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-5 space-y-3"
            >
              {/* Rule Badge */}
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-medium text-amber-400">
                  {exercise.rule}
                </span>
              </div>

              {/* Original */}
              <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                <div className="flex items-center gap-2 mb-1">
                  <X className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-xs font-medium text-red-400">Incorrect</span>
                </div>
                <p className="text-sm text-muted-foreground">{exercise.original}</p>
              </div>

              {/* Corrected */}
              <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                <div className="flex items-center gap-2 mb-1">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-400">Correct</span>
                </div>
                <p className="text-sm">{exercise.corrected}</p>
              </div>

              {/* Explanation */}
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                <span className="text-xs font-medium text-primary-light">Explanation</span>
                <p className="text-sm text-muted-foreground mt-1">{exercise.explanation}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
