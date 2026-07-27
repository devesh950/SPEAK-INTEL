# SpeakIntel AI — Free Deployment Guide

This guide walks you through deploying the entire **SpeakIntel AI** stack completely for free using modern cloud platforms.

---

## Architecture Overview (Free Tier)

- **Frontend**: Vercel (Hobby/Free Tier)
- **Backend API & WebSockets**: Render (Free Web Service)
- **Database (PostgreSQL)**: Supabase (Free Tier)

---

## Step 1: Deploy Database (Supabase)

1. Go to [Supabase](https://supabase.com) and sign up.
2. Create a new project named `speakintel-db`.
3. Go to **Project Settings** → **Database**.
4. Copy the **Transaction Connection String** (under URI format). It will look like this:
   `postgres://postgres:[YOUR-PASSWORD]@db.xxxxxx.supabase.co:5432/postgres`

---

## Step 2: Deploy Backend (Render)

1. Push your repository to **GitHub**.
2. Go to [Render](https://render.com) and log in.
3. Click **New +** → **Web Service**.
4. Connect your GitHub repository.
5. Configure the following settings:
   - **Environment**: `Docker`
   - **Instance Type**: `Free`
6. Add the following **Environment Variables**:
   - `DATABASE_URL`: Your Supabase connection string
   - `GEMINI_API_KEY`: Your Google Gemini API Key
   - `NEXTAUTH_SECRET`: A secure base64 random secret
   - `CORS_ORIGINS`: `https://[your-vercel-domain].vercel.app` (Add after deploying frontend)
7. Click **Deploy Web Service**.

---

## Step 4: Deploy Frontend (Vercel)

1. Go to [Vercel](https://vercel.com) and log in.
2. Click **Add New** → **Project** and import your GitHub repository.
3. Edit the deployment settings:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `frontend`
4. Add these **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: Your Render backend URL (`https://speakintel-backend.onrender.com`)
   - `NEXT_PUBLIC_WS_URL`: Your Render WebSocket URL (`wss://speakintel-backend.onrender.com`)
   - `NEXTAUTH_SECRET`: A secure random secret
   - `NEXTAUTH_URL`: `https://[your-vercel-domain].vercel.app`
   - `GOOGLE_CLIENT_ID`: (Optional) For Google login
   - `GOOGLE_CLIENT_SECRET`: (Optional) For Google login
5. Click **Deploy**.

---

## Step 5: Database Migrations (Prisma)

Before using the application, run the schema migration to set up the tables:

1. Open your local terminal.
2. In the backend directory, ensure you have set the `DATABASE_URL` matching your Supabase connection string.
3. Run:
   ```bash
   cd backend
   prisma db push
   ```
