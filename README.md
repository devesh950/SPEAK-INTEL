# SpeakIntel AI

> **Your Personal AI Communication Coach** — Master English communication with AI-powered conversations, mock interviews, pronunciation training, and real-time coaching.

## 🚀 Tech Stack

### Frontend
- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS v4**
- **Framer Motion** (animations)
- **Zustand** (state management)
- **React Query** (data fetching)
- **Lucide React** (icons)

### Backend
- **FastAPI** (Python)
- **WebSocket** (real-time voice)
- **Prisma** (ORM)
- **PostgreSQL** (Supabase)
- **Redis** (Railway)

### AI
- **Google Gemini 2.0 Flash** (free tier)
- **Web Speech API** (browser STT/TTS)

### Auth
- **NextAuth.js v5** + Google OAuth

## 📦 Project Structure

```
├── frontend/           # Next.js 15 application
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── sign-in/              # Auth pages
│   │   ├── sign-up/
│   │   └── (app)/                # Protected app routes
│   │       ├── dashboard/
│   │       ├── conversation/     # Voice AI conversation
│   │       ├── interview/        # Mock interviews
│   │       ├── roleplay/         # 15 roleplay modes
│   │       ├── challenges/       # Daily challenges
│   │       ├── vocabulary/       # Vocabulary trainer
│   │       ├── pronunciation/    # Pronunciation trainer
│   │       ├── grammar/          # Grammar coach
│   │       ├── progress/         # Analytics dashboard
│   │       ├── leaderboard/      # Rankings & achievements
│   │       └── settings/         # User preferences
│   ├── components/
│   ├── hooks/
│   ├── stores/
│   ├── lib/
│   └── types/
├── backend/            # FastAPI application
│   ├── app/
│   │   ├── main.py               # FastAPI entry
│   │   ├── config.py             # Settings
│   │   ├── routers/              # REST API routes
│   │   ├── services/             # AI coach, scoring
│   │   └── websocket/            # Voice handler
│   └── prisma/
│       └── schema.prisma         # Database schema
└── .env.example
```

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.12+
- Google Gemini API key (free)
- Google OAuth credentials

### Frontend Setup

```bash
cd frontend
npm install
cp ../.env.example .env.local
# Edit .env.local with your keys
npm run dev
```

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
cp ../.env.example .env
# Edit .env with your keys
uvicorn app.main:app --reload
```

## 🎨 Features

- **🎙️ AI Voice Conversations** — ChatGPT Voice Mode-style UI with animated orb
- **💼 Mock Interviews** — 10+ roles with AI evaluation
- **🎭 15 Roleplay Modes** — Real-world scenarios
- **📝 Grammar Coach** — Real-time corrections with explanations
- **🗣️ Pronunciation Trainer** — Word-by-word feedback
- **📚 Vocabulary Builder** — With Hindi translations
- **📊 Progress Dashboard** — Charts, streaks, analytics
- **🏆 Leaderboard** — Rankings and achievements
- **⚡ Daily Challenges** — XP and gamification
- **🌙 Dark Mode** — Premium glassmorphism design

## 🚀 Deployment

### Frontend → Vercel
```bash
cd frontend
npx vercel
```

### Backend → Railway
```bash
cd backend
railway up
```

### Database → Supabase
Create a new Supabase project and use the connection string in `DATABASE_URL`.

## 📄 License

MIT
