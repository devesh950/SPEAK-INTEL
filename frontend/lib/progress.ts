export interface UserStats {
  dailyPractice: number;
  currentStreak: number;
  weeklyProgress: number;
  communicationScore: number;
  sessionsDone: number;
  wordsLearned: number;
  interviewScore: number;
}

export const DEFAULT_STATS: UserStats = {
  dailyPractice: 0,
  currentStreak: 0,
  weeklyProgress: 0,
  communicationScore: 0.0,
  sessionsDone: 0,
  wordsLearned: 0,
  interviewScore: 0.0,
};

export const getProgressStats = (): UserStats => {
  if (typeof window === "undefined") return DEFAULT_STATS;
  try {
    const statsString = localStorage.getItem("speakintel-stats");
    if (!statsString) {
      localStorage.setItem("speakintel-stats", JSON.stringify(DEFAULT_STATS));
      return DEFAULT_STATS;
    }
    return JSON.parse(statsString);
  } catch (e) {
    return DEFAULT_STATS;
  }
};

export const resetProgressStats = (): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("speakintel-stats", JSON.stringify(DEFAULT_STATS));
};

export const updateRealtimeProgress = (type: "practice" | "session" | "score" | "words" | "interview", value?: number) => {
  if (typeof window === "undefined") return;
  try {
    const stats = getProgressStats();
    
    if (type === "practice") {
      stats.dailyPractice += value || 1; // add practice minutes
      // target is 50 minutes of practice weekly
      stats.weeklyProgress = Math.min(100, Math.round((stats.dailyPractice / 50) * 100));
    } else if (type === "session") {
      stats.sessionsDone += 1;
      // update streak if they do a session
      if (stats.currentStreak === 0) {
        stats.currentStreak = 1;
      }
    } else if (type === "words") {
      stats.wordsLearned += value || 3;
    } else if (type === "score") {
      if (value) {
        // running average of communication score
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
