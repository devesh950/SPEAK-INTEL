export interface DetailedScores {
  grammar: number;
  fluency: number;
  vocabulary: number;
  confidence: number;
  pronunciation: number;
  speakingSpeed: number;
  listening: number;
  overall: number;
}

export interface UserStats {
  dailyPractice: number;
  currentStreak: number;
  weeklyProgress: number;
  communicationScore: number;
  sessionsDone: number;
  wordsLearned: number;
  interviewScore: number;
  detailedScores: DetailedScores;
}

export interface RecentActivity {
  type: "conversation" | "interview" | "challenge" | "grammar";
  title: string;
  score: number;
  duration: string;
  time: string;
}

export const DEFAULT_DETAILED_SCORES: DetailedScores = {
  grammar: 0,
  fluency: 0,
  vocabulary: 0,
  confidence: 0,
  pronunciation: 0,
  speakingSpeed: 0,
  listening: 0,
  overall: 0,
};

export const DEFAULT_STATS: UserStats = {
  dailyPractice: 0,
  currentStreak: 0,
  weeklyProgress: 0,
  communicationScore: 0.0,
  sessionsDone: 0,
  wordsLearned: 0,
  interviewScore: 0.0,
  detailedScores: DEFAULT_DETAILED_SCORES,
};

export const getProgressStats = (): UserStats => {
  if (typeof window === "undefined") return DEFAULT_STATS;
  try {
    const statsString = localStorage.getItem("speakintel-stats");
    if (!statsString) {
      localStorage.setItem("speakintel-stats", JSON.stringify(DEFAULT_STATS));
      return DEFAULT_STATS;
    }
    const parsed = JSON.parse(statsString);
    // Ensure detailedScores exists
    if (!parsed.detailedScores) {
      parsed.detailedScores = DEFAULT_DETAILED_SCORES;
    }
    return parsed;
  } catch (e) {
    return DEFAULT_STATS;
  }
};

export const resetProgressStats = (): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("speakintel-stats", JSON.stringify(DEFAULT_STATS));
  localStorage.removeItem("speakintel-activities");
};

export const getRecentActivities = (): RecentActivity[] => {
  if (typeof window === "undefined") return [];
  try {
    const actString = localStorage.getItem("speakintel-activities");
    return actString ? JSON.parse(actString) : [];
  } catch (e) {
    return [];
  }
};

export const addRecentActivity = (
  type: "conversation" | "interview" | "challenge" | "grammar",
  title: string,
  score: number,
  duration: string
): void => {
  if (typeof window === "undefined") return;
  try {
    const activities = getRecentActivities();
    const newActivity: RecentActivity = {
      type,
      title,
      score,
      duration,
      time: "Just now",
    };
    
    // Keep max 5 activities
    const updated = [newActivity, ...activities].slice(0, 5);
    localStorage.setItem("speakintel-activities", JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to add activity", e);
  }
};

export const updateDetailedScores = (scores: Partial<DetailedScores>) => {
  if (typeof window === "undefined") return;
  try {
    const stats = getProgressStats();
    if (!stats.detailedScores) {
      stats.detailedScores = { ...DEFAULT_DETAILED_SCORES };
    }
    
    Object.keys(scores).forEach((key) => {
      const k = key as keyof DetailedScores;
      const val = scores[k];
      if (val !== undefined && val > 0) {
        if (stats.detailedScores[k] === 0) {
          stats.detailedScores[k] = Math.round(val);
        } else {
          stats.detailedScores[k] = Math.round((stats.detailedScores[k] * 2 + val) / 3);
        }
      }
    });
    
    // Compute overall dynamically
    const scoreValues = [
      stats.detailedScores.grammar,
      stats.detailedScores.fluency,
      stats.detailedScores.vocabulary,
      stats.detailedScores.confidence,
      stats.detailedScores.pronunciation,
      stats.detailedScores.speakingSpeed,
      stats.detailedScores.listening,
    ].filter((s) => s > 0);
    
    if (scoreValues.length > 0) {
      stats.detailedScores.overall = Math.round(
        scoreValues.reduce((sum, s) => sum + s, 0) / scoreValues.length
      );
    }
    
    localStorage.setItem("speakintel-stats", JSON.stringify(stats));
  } catch (e) {
    console.error("Failed to update detailed scores", e);
  }
};

export const updateRealtimeProgress = (type: "practice" | "session" | "score" | "words" | "interview", value?: number) => {
  if (typeof window === "undefined") return;
  try {
    const stats = getProgressStats();
    
    if (type === "practice") {
      stats.dailyPractice += value || 1;
      stats.weeklyProgress = Math.min(100, Math.round((stats.dailyPractice / 50) * 100));
    } else if (type === "session") {
      stats.sessionsDone += 1;
      if (stats.currentStreak === 0) {
        stats.currentStreak = 1;
      }
    } else if (type === "words") {
      stats.wordsLearned += value || 3;
    } else if (type === "score") {
      if (value) {
        if (stats.communicationScore === 0) {
          stats.communicationScore = Number(value.toFixed(1));
        } else {
          stats.communicationScore = Number(((stats.communicationScore * 4 + value) / 5).toFixed(1));
        }
      }
    } else if (type === "interview") {
      if (value) {
        if (stats.interviewScore === 0) {
          stats.interviewScore = Number(value.toFixed(1));
        } else {
          stats.interviewScore = Number(((stats.interviewScore * 2 + value) / 3).toFixed(1));
        }
      }
    }
    
    localStorage.setItem("speakintel-stats", JSON.stringify(stats));
  } catch (e) {
    console.error("Failed to update progress stats", e);
  }
};
