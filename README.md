# 🚀 FlowPilot AI

> **Your Intelligent Project Co-Pilot** — AI-powered SaaS project management built with Next.js 14, Supabase, Clerk, Stripe, and OpenAI.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com)

---

## ✨ Features

- 🤖 **AI Co-Pilot** — Smart task suggestions, deadline risk warnings, workload balancing
- 📋 **Kanban Boards** — Drag & drop with dnd-kit, smooth animations
- 📊 **Analytics** — Charts, productivity trends, completion rates
- 🔐 **Auth** — Clerk authentication with protected routes
- 💳 **Subscriptions** — Stripe billing (Free / Pro $19 / Team $49)
- 🌗 **Dark/Light Mode** — System preference + toggle
- 🎉 **Confetti** — Animated celebration on task completion
- 📱 **Responsive** — Mobile-optimized throughout

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Auth | Clerk |
| Payments | Stripe |
| AI | OpenAI GPT-3.5 (with mock fallback) |
| Animations | Framer Motion |
| Charts | Recharts |
| DnD | dnd-kit |

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
cd flowpilot-ai
npm install
```

### 2. Environment Variables

```bash
cp .env.local.example .env.local
```

Fill in all values in `.env.local` (see section below).

### 3. Database Setup

1. Create a [Supabase](https://supabase.com) project
2. Go to SQL Editor
3. Run the contents of `database/schema.sql`

### 4. Clerk Setup

1. Create a [Clerk](https://clerk.com) application
2. Enable Email + Social OAuth providers
3. Add your keys to `.env.local`

### 5. Stripe Setup

```bash
# Install Stripe CLI
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Create products in Stripe Dashboard:
# - Pro Plan: $19/month (recurring)
# - Team Plan: $49/month (recurring)
# Add the Price IDs to .env.local
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📁 Project Structure

```
flowpilot-ai/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx              # Dashboard shell + auth + seed
│   │   ├── page.tsx                # Overview + stats + charts
│   │   ├── projects/
│   │   │   ├── page.tsx            # Projects grid
│   │   │   └── [id]/page.tsx       # Kanban board + AI copilot
│   │   ├── analytics/page.tsx
│   │   ├── billing/page.tsx
│   │   └── settings/page.tsx
│   ├── api/
│   │   └── ai-suggestions/route.ts # AI endpoint (OpenAI / mock)
│   ├── layout.tsx
│   ├── page.tsx                    # Landing page
│   └── globals.css
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── landing/                    # Hero, Features, Pricing, etc.
│   ├── dashboard/                  # Stats, Charts, Sidebar, TopBar
│   └── projects/                   # Kanban, TaskCard, AI Copilot
├── actions/
│   ├── projects.ts                 # Server actions
│   └── tasks.ts
├── lib/
│   ├── supabase.ts
│   ├── stripe.ts
│   ├── seed-data.ts
│   └── utils.ts
├── types/index.ts
├── middleware.ts                   # Clerk auth protection
├── database/schema.sql             # Full DB schema
└── .env.local.example
```

---

## 🌍 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Required Vercel Environment Variables:**
- All variables from `.env.local.example`
- Set `NEXT_PUBLIC_APP_URL` to your Vercel domain

---

## 📊 Database Schema

| Table | Key Columns |
|-------|------------|
| `users` | id, clerk_id, email, subscription_plan |
| `projects` | id, user_id, title, description, deadline, status, color |
| `tasks` | id, project_id, title, status, priority, deadline |

---

## 🤖 AI Configuration

The AI Co-Pilot works in two modes:

**Mock Mode** (default — no API key needed):
- Generates contextual suggestions based on task data
- Detects overdue tasks, high workload, risk patterns

**OpenAI Mode** (add `OPENAI_API_KEY`):
- Uses GPT-3.5-turbo for intelligent suggestions
- More nuanced and context-aware recommendations

---

## 📝 License

MIT © 2024 FlowPilot AI
