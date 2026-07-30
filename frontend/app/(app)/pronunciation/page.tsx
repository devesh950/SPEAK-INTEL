"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, Volume2, RotateCcw, Check, X, ArrowRight } from "lucide-react";

const sentences = [
  {
    id: 1,
    text: "The quick brown fox jumps over the lazy dog.",
    difficulty: "Easy",
  },
  {
    id: 2,
    text: "She sells seashells by the seashore.",
    difficulty: "Medium",
  },
  {
    id: 3,
    text: "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
    difficulty: "Hard",
  },
  {
    id: 4,
    text: "The technological advancements have significantly improved communication.",
    difficulty: "Medium",
  },
  {
    id: 5,
    text: "Entrepreneurship requires resilience, creativity, and unwavering determination.",
    difficulty: "Hard",
  },
];

import { getProgressStats, updateRealtimeProgress, updateDetailedScores, addRecentActivity } from "@/lib/progress";
import { useRef } from "react";

export default function PronunciationPage() {
  const [currentSentence, setCurrentSentence] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [pronunciationScore, setPronunciationScore] = useState(0);
  
  const [computedScore, setComputedScore] = useState(0);
  const [wordResults, setWordResults] = useState<{ word: string; correct: boolean }[]>([]);
  const recognitionRef = useRef<any>(null);

  // Sync general progress stats on mount
  useEffect(() => {
    const stats = getProgressStats();
    setPronunciationScore(stats.detailedScores?.pronunciation || 0);
  }, []);

  const statItems = [
    { label: "Accuracy", value: pronunciationScore ? `${pronunciationScore}%` : "—", color: pronunciationScore >= 80 ? "text-emerald-400" : pronunciationScore >= 60 ? "text-amber-400" : pronunciationScore > 0 ? "text-red-400" : "text-muted-foreground" },
    { label: "Stress", value: pronunciationScore ? `${Math.min(100, Math.max(10, pronunciationScore - 6))}%` : "—", color: pronunciationScore >= 80 ? "text-cyan-400" : "text-muted-foreground" },
    { label: "Intonation", value: pronunciationScore ? `${Math.min(100, Math.max(10, pronunciationScore - 12))}%` : "—", color: pronunciationScore >= 80 ? "text-purple-400" : "text-muted-foreground" },
    { label: "Accent", value: pronunciationScore ? `${Math.min(100, Math.max(10, pronunciationScore - 8))}%` : "—", color: pronunciationScore >= 80 ? "text-amber-400" : "text-muted-foreground" },
  ];

  const sentence = sentences[currentSentence];

  const evaluatePronunciation = (spoken: string) => {
    const targetText = sentences[currentSentence].text;
    const cleanWord = (w: string) => w.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();

    const targetWords = targetText.split(/\s+/).map(cleanWord).filter(Boolean);
    const spokenWords = spoken.split(/\s+/).map(cleanWord).filter(Boolean);

    let correctCount = 0;
    const results = targetText.split(/\s+/).map((originalWord) => {
      const cleaned = cleanWord(originalWord);
      // Check if word exists in spoken phrase
      const isCorrect = spokenWords.includes(cleaned);
      if (isCorrect) {
        correctCount++;
      }
      return { word: originalWord, correct: isCorrect };
    });

    const score = targetWords.length > 0 ? Math.round((correctCount / targetWords.length) * 100) : 0;
    
    setComputedScore(score);
    setWordResults(results);
    setShowResult(true);

    if (score > 0) {
      updateRealtimeProgress("practice", 1);
      updateRealtimeProgress("session");
      updateRealtimeProgress("words", Math.min(5, Math.max(1, Math.round(targetWords.length / 3))));

      updateDetailedScores({
        pronunciation: score,
        grammar: undefined, // don't overwrite grammar
      });
      
      addRecentActivity(
        "conversation",
        `Pronunciation Practice`,
        Number((score / 10).toFixed(1)),
        "1 min"
      );

      // Refresh top badges
      const stats = getProgressStats();
      setPronunciationScore(stats.detailedScores?.pronunciation || score);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = "en-US";

        rec.onstart = () => {
          setIsRecording(true);
          setShowResult(false);
        };

        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            evaluatePronunciation(transcript);
          }
        };

        rec.onerror = (err: any) => {
          console.error("Speech recognition error:", err);
          setIsRecording(false);
          // Fallback evaluation if microphone is empty
          evaluatePronunciation("");
        };

        rec.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, [currentSentence]);

  const handleRecord = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsRecording(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.warn("Could not start speech recognition:", e);
          setIsRecording(true);
          setTimeout(() => {
            setIsRecording(false);
            evaluatePronunciation("");
          }, 3500);
        }
      } else {
        setIsRecording(true);
        setTimeout(() => {
          setIsRecording(false);
          evaluatePronunciation("");
        }, 3500);
      }
    }
  };

  const nextSentence = () => {
    setCurrentSentence((prev) => (prev + 1) % sentences.length);
    setShowResult(false);
  };

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold">Pronunciation Trainer</h1>
        <p className="text-muted-foreground mt-1">
          Listen, repeat, and perfect your pronunciation
        </p>
      </motion.div>

      {/* Score Cards */}
      <div className="grid grid-cols-4 gap-4">
        {statItems.map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="stat-card text-center"
          >
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Practice Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 text-center max-w-2xl mx-auto"
      >
        {/* Difficulty Badge */}
        <span className={`text-xs px-3 py-1 rounded-full ${
          sentence.difficulty === "Easy" ? "bg-emerald-500/15 text-emerald-400" :
          sentence.difficulty === "Medium" ? "bg-amber-500/15 text-amber-400" :
          "bg-red-500/15 text-red-400"
        }`}>
          {sentence.difficulty}
        </span>

        {/* Sentence */}
        <h2 className="text-xl sm:text-2xl font-medium mt-6 mb-2 leading-relaxed">
          {sentence.text}
        </h2>

        {/* Listen Button */}
        <button className="inline-flex items-center gap-2 text-sm text-primary-light hover:text-white transition-colors my-4">
          <Volume2 className="w-4 h-4" />
          Listen to pronunciation
        </button>

        {/* Record Button */}
        <div className="mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRecord}
            className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center transition-all ${
              isRecording
                ? "bg-red-500 shadow-lg shadow-red-500/30"
                : "gradient-primary shadow-lg shadow-primary/30"
            }`}
          >
            <Mic className="w-8 h-8 text-white" />
          </motion.button>
          <p className="text-xs text-muted-foreground mt-3">
            {isRecording ? "Recording... Click to stop" : "Tap to record your pronunciation"}
          </p>
        </div>

        {/* Result */}
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-4"
          >
            {/* Score */}
            <div className="flex justify-center flex-col items-center gap-1">
              <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-3xl font-bold text-white">{computedScore}</span>
              </div>
              <span className="text-xs text-muted-foreground mt-1">Pronunciation Score</span>
            </div>

            {/* Word-by-word feedback */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4 max-w-lg mx-auto">
              {wordResults.map((item, i) => (
                <span
                  key={i}
                  className={`px-2 py-1 rounded-lg text-sm transition-all ${
                    item.correct
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium"
                      : "bg-red-500/10 text-red-400 underline decoration-wavy border border-red-500/20"
                  }`}
                >
                  {item.word}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={() => setShowResult(false)}
                className="btn-secondary text-sm flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Try Again
              </button>
              <button
                onClick={nextSentence}
                className="btn-primary text-sm flex items-center gap-2"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Sentence List */}
      <div className="space-y-2 max-w-2xl mx-auto">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">All Sentences</h3>
        {sentences.map((s, i) => (
          <button
            key={s.id}
            onClick={() => { setCurrentSentence(i); setShowResult(false); }}
            className={`w-full text-left p-3 rounded-xl text-sm transition-all ${
              i === currentSentence ? "glass-strong border-primary/30" : "glass hover:bg-white/5"
            }`}
          >
            <span className="text-muted-foreground mr-2">#{i + 1}</span>
            {s.text}
          </button>
        ))}
      </div>
    </div>
  );
}
