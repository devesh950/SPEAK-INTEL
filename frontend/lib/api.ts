const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface FetchOptions extends RequestInit {
  token?: string;
}

async function fetchAPI(endpoint: string, options: FetchOptions = {}) {
  const { token, ...fetchOptions } = options;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// ---- Conversation API ----

export async function sendMessage(
  message: string,
  history: { role: string; content: string }[],
  mode: string = "general",
  role?: string,
  level: string = "intermediate"
) {
  return fetchAPI("/api/conversations/chat", {
    method: "POST",
    body: JSON.stringify({ message, history, mode, role, level }),
  });
}

export async function getConversationHistory(sessionId: string) {
  return fetchAPI(`/api/conversations/history/${sessionId}`);
}

export async function listSessions() {
  return fetchAPI("/api/conversations/sessions");
}

// ---- Interview API ----

export async function getInterviewRoles() {
  return fetchAPI("/api/interviews/roles");
}

export async function startInterview(role: string, level: string = "intermediate", resumeText?: string) {
  return fetchAPI("/api/interviews/start", {
    method: "POST",
    body: JSON.stringify({ role, level, resume_text: resumeText }),
  });
}

export async function getInterviewReport(sessionId: string) {
  return fetchAPI(`/api/interviews/report/${sessionId}`);
}

// ---- Vocabulary API ----

export async function analyzeWord(word: string) {
  return fetchAPI(`/api/vocabulary/analyze/${word}`);
}

export async function getVocabularyNotebook() {
  return fetchAPI("/api/vocabulary/notebook");
}

export async function saveWord(word: string) {
  return fetchAPI(`/api/vocabulary/save/${word}`, { method: "POST" });
}

// ---- Progress API ----

export async function getProgressDashboard() {
  return fetchAPI("/api/progress/dashboard");
}

export async function getLeaderboard() {
  return fetchAPI("/api/progress/leaderboard");
}

export async function getAchievements() {
  return fetchAPI("/api/progress/achievements");
}
