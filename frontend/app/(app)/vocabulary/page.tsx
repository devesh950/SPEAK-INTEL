"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Search, Volume2, Star, Plus, Check, ArrowUpDown } from "lucide-react";
import { getProgressStats } from "@/lib/progress";

const sampleWords = [
  { word: "Eloquent", meaning: "Fluent or persuasive in speaking", pronunciation: "/ˈeləkwənt/", hindi: "वाक्पटु", synonyms: ["articulate", "fluent", "expressive"], antonyms: ["inarticulate", "tongue-tied"], example: "She gave an eloquent speech at the conference.", difficulty: "Advanced", mastered: false },
  { word: "Resilient", meaning: "Able to recover quickly from difficulties", pronunciation: "/rɪˈzɪliənt/", hindi: "लचीला", synonyms: ["tough", "strong", "adaptable"], antonyms: ["fragile", "weak"], example: "Resilient people bounce back from failures.", difficulty: "Intermediate", mastered: true },
  { word: "Pragmatic", meaning: "Dealing with things practically", pronunciation: "/præɡˈmætɪk/", hindi: "व्यावहारिक", synonyms: ["practical", "realistic", "sensible"], antonyms: ["idealistic", "impractical"], example: "We need a pragmatic approach to solve this issue.", difficulty: "Advanced", mastered: false },
  { word: "Diligent", meaning: "Having or showing care in work", pronunciation: "/ˈdɪlɪdʒənt/", hindi: "परिश्रमी", synonyms: ["hardworking", "industrious", "careful"], antonyms: ["lazy", "negligent"], example: "She is a diligent student who always submits her work on time.", difficulty: "Intermediate", mastered: true },
  { word: "Ambiguous", meaning: "Open to more than one interpretation", pronunciation: "/æmˈbɪɡjuəs/", hindi: "अस्पष्ट", synonyms: ["vague", "unclear", "equivocal"], antonyms: ["clear", "unambiguous"], example: "The instructions were ambiguous and confusing.", difficulty: "Advanced", mastered: false },
  { word: "Empathy", meaning: "Ability to understand others' feelings", pronunciation: "/ˈempəθi/", hindi: "सहानुभूति", synonyms: ["compassion", "understanding", "sympathy"], antonyms: ["apathy", "indifference"], example: "A good leader shows empathy towards the team.", difficulty: "Intermediate", mastered: false },
];

export default function VocabularyPage() {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [wordsLearned, setWordsLearned] = useState(0);

  useEffect(() => {
    const stats = getProgressStats();
    setWordsLearned(stats.wordsLearned || 0);
  }, []);

  const masteredCount = Math.round(wordsLearned * 0.57);
  const toReviewCount = wordsLearned - masteredCount;

  const filtered = sampleWords.filter((w) =>
    w.word.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold">Vocabulary Trainer</h1>
        <p className="text-muted-foreground mt-1">
          Build your word power with detailed analysis
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Words Learned", value: wordsLearned.toString(), color: "text-primary-light" },
          { label: "Mastered", value: masteredCount.toString(), color: "text-emerald-400" },
          { label: "To Review", value: toReviewCount.toString(), color: "text-amber-400" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="stat-card text-center"
          >
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          type="text"
          placeholder="Search words..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted"
        />
      </div>

      {/* Word Cards */}
      <div className="space-y-3">
        {filtered.map((word, index) => (
          <motion.div
            key={word.word}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card overflow-hidden"
          >
            <button
              onClick={() => setExpandedId(expandedId === word.word ? null : word.word)}
              className="w-full p-4 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  word.mastered ? "bg-emerald-500/15 text-emerald-400" : "bg-primary/15 text-primary-light"
                }`}>
                  {word.mastered ? <Check className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-semibold">{word.word}</p>
                  <p className="text-xs text-muted-foreground">{word.meaning}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  word.difficulty === "Advanced" ? "bg-red-500/15 text-red-400" : "bg-amber-500/15 text-amber-400"
                }`}>
                  {word.difficulty}
                </span>
                <ArrowUpDown className="w-4 h-4 text-muted" />
              </div>
            </button>

            {expandedId === word.word && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="px-4 pb-4 space-y-3 border-t border-border pt-3"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs text-muted-foreground">Pronunciation</span>
                    <p className="text-sm flex items-center gap-2">
                      {word.pronunciation}
                      <Volume2 className="w-4 h-4 text-primary-light cursor-pointer" />
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Hindi</span>
                    <p className="text-sm">{word.hindi}</p>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Synonyms</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {word.synonyms.map((s) => (
                      <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Antonyms</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {word.antonyms.map((a) => (
                      <span key={a} className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Example</span>
                  <p className="text-sm italic text-muted-foreground mt-0.5">&ldquo;{word.example}&rdquo;</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
