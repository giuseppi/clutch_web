# Clutch — Basketball Analytics Platform

> Enterprise-grade B2B SaaS platform for high school and college basketball analytics. AI-powered video processing, custom MMR/Elo ranking system, and role-based portals for coaches, scouts, and athletes.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started (Local Dev)](#getting-started-local-dev)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [User Roles](#user-roles)
- [MMR / Elo System](#mmr--elo-system)
- [Video Upload Pipeline](#video-upload-pipeline)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Seed Data & Demo Credentials](#seed-data--demo-credentials)
- [Scripts Reference](#scripts-reference)

---

## Overview

Clutch allows coaching staffs to upload game film, which is processed by an AI pipeline to extract player tracking data, compute advanced basketball statistics, and update each player's individual **MMR** (Match Making Rating) on a **0–99 scale** — similar to a video game ranking, but driven entirely by real game performance.

**Three portals in one app:**
- **Coach Portal** — Upload match film, manage roster, view full analytics breakdown
- **Scout/Recruiter Portal** — Browse universal leaderboard, filter by state/classification/position, view player profiles
- **Athlete Portal** — View personal MMR, game log, highlights, and stats

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   React Frontend                     │
│         Vite + TypeScript + Tailwind + shadcn        │
│              React Query for server state            │
└───────────────────────┬─────────────────────────────┘
                        │ HTTP / REST (Axios + JWT)
┌───────────────────────▼─────────────────────────────┐
│               Express Backend (Node.js)              │
│         Routes → Services → Prisma ORM               │
│         JWT Auth · BullMQ · Presigned S3 URLs        │
└──────┬─────────────────┬──────────────────┬──────────┘
       │                 │                  │
  PostgreSQL          Redis             AWS S3 / MinIO
  (Prisma ORM)   (BullMQ Queue +      (Video storage +
                  Job progress)        Trajectory JSON)
                        │
┌───────────────────────▼─────────────────────────────┐
│               Python Worker                          │
│     Consumes jobs via Redis BLPOP                    │
│     Stubbed RF-DETR detector + ByteTrack tracker     │
│     Computes stats → MMR delta → callbacks to API    │
└─────────────────────────────────────────────────────┘
```

**Upload flow:**
1. Coach selects a scheduled match and a video file
2. Frontend requests a presigned S3 URL from the backend (`POST /upload/presign`)
3. Frontend uploads video directly to S3/MinIO (never touches the backend)
4. Frontend calls `POST /upload/confirm` — backend creates a `VideoJob` and pushes to Redis
5. Python worker picks up the job (`BLPOP clutch:video:pending`)
6. Worker processes video, uploads trajectory JSON to S3, calls `POST /analytics/compute` with full stats
7. Backend stores stats, updates player MMR, logs EloHistory, marks match processed
8. Frontend polls `GET /jobs/:jobId` every 3 seconds until complete

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite 7, Tailwind CSS, shadcn/ui |
| State | React Query (TanStack Query v5) |
| HTTP client | Axios with JWT interceptors |
| Backend | Node.js, Express, TypeScript |
| ORM | Prisma 5 (PostgreSQL) |
| Queue | BullMQ + Redis |
| Storage | AWS S3 / MinIO (local) |
| Auth | JWT (access 15min + refresh 7d), bcrypt |
| AI Worker | Python 3.11, OpenCV, NumPy |
| CV Pipeline | RF-DETR (stubbed), ByteTrack (stubbed) |
| Infrastructure | Docker Compose (local dev) |
| Fonts | Lexend (display), system sans (body) |

---

## Getting Started (Local Dev)

> **Prerequisites:** Node.js 20+, Python 3.11+, Docker Desktop

### 1. Clone and install

```bash
git clone <YOUR_GIT_URL>
cd clutch_web

# Frontend
npm install

# Backend
cd server && npm install && cd ..

# Python worker
cd worker
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

### 2. Configure environment

```bash
cp .env.example .env
```

Open `.env` and fill in the required secrets (see [Environment Variables](#environment-variables) below). Everything else has Docker Compose defaults that work out of the box.

### 3. Start infrastructure

```bash
docker compose up -d
```

Starts PostgreSQL 16, Redis 7, and MinIO. Verify with:
```bash
docker compose ps
```

### 4. Set up the database

```bash
cd server
npx prisma migrate dev --name init
npx prisma db seed
cd ..
```

This creates all tables and seeds demo data (3 teams, 15 players, 4 matches, 3 users).

### 5. Start all services

Open **3 separate terminals:**

```bash
# Terminal 1 — Backend API (port 3001)
cd server && npm run dev

# Terminal 2 — Frontend (port 5173)
npm run dev

# Terminal 3 — Python worker (only needed for video processing)
cd worker && source venv/bin/activate && python main.py
```

Open `http://localhost:5173/app/login`.

---

## Environment Variables

Copy `.env.example` to `.env`. Variables marked **required** must be set before the app will start.

### Secrets — Generate These

```bash
# Run twice to get two different strings
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

| Variable | Required | Description |
|---|---|---|
| `JWT_ACCESS_SECRET` | ✅ | Signs 15-minute access tokens. Must be long and random. Never share. |
| `JWT_REFRESH_SECRET` | ✅ | Signs 7-day refresh tokens. Must be **different** from `JWT_ACCESS_SECRET`. |
| `WORKER_SECRET` | ✅ | Shared password between Python worker and Express API. Prevents fake processing callbacks. Any string works locally (e.g. `worker-secret-dev`). |

### Frontend

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | ✅ | URL the React app sends API requests to. Local: `http://localhost:3001/api/v1`. Production: your deployed API URL. Note: `VITE_` prefix means it's embedded in the JS bundle at build time — not secret. |

### Database (Docker defaults)

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql://clutch:clutch@localhost:5432/clutch` | Prisma connection string. Matches Docker Compose. |
| `POSTGRES_USER` | `clutch` | |
| `POSTGRES_PASSWORD` | `clutch` | |
| `POSTGRES_DB` | `clutch` | |

### Redis (Docker defaults)

| Variable | Default | Description |
|---|---|---|
| `REDIS_URL` | `redis://localhost:6379` | Used by BullMQ and job progress tracking. |

### S3 / MinIO (Docker defaults)

| Variable | Default | Description |
|---|---|---|
| `S3_BUCKET` | `clutch-videos` | Bucket for video files and trajectory JSON. |
| `S3_REGION` | `us-east-1` | |
| `S3_ENDPOINT` | `http://localhost:9000` | Points to local MinIO in dev. Remove for real AWS. |
| `AWS_ACCESS_KEY_ID` | `minioadmin` | MinIO root user in dev. Replace with real IAM key in prod. |
| `AWS_SECRET_ACCESS_KEY` | `minioadmin` | |

### Server

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | Express server port. |
| `NODE_ENV` | `development` | |
| `CORS_ORIGIN` | `http://localhost:5173` | Must match the frontend URL exactly. |

---

## Project Structure

```
clutch_web/
├── src/                          # React frontend
│   ├── components/
│   │   ├── AppLayout.tsx         # Shared sidebar + mobile header (all app pages use this)
│   │   ├── ProtectedRoute.tsx    # Role-based route guard
│   │   └── ui/                   # shadcn/ui components (60+)
│   ├── contexts/
│   │   └── AuthContext.tsx       # Global auth state, login/logout/refresh
│   ├── hooks/api/                # React Query hooks (one file per domain)
│   │   ├── useAuth.ts
│   │   ├── usePlayers.ts
│   │   ├── useMatches.ts
│   │   ├── useLeaderboard.ts
│   │   ├── useUpload.ts          # Presigned URL + job status polling
│   │   ├── useAnalytics.ts
│   │   └── useSessions.ts
│   ├── lib/
│   │   └── api.ts                # Axios instance with JWT auto-refresh interceptor
│   └── pages/app/
│       ├── LoginPage.tsx         # 3 role cards + demo credentials
│       ├── DashboardPage.tsx     # Coach home (real matches + top performers)
│       ├── LeaderboardPage.tsx   # Universal MMR rankings with filters
│       ├── UploadPage.tsx        # Two-tab: Match Film vs Practice/Session
│       ├── AnalyticsPage.tsx     # Four factors, shot chart, play tags, highlights
│       ├── RosterPage.tsx        # Team roster with player profile sheet
│       ├── SettingsPage.tsx      # Org settings wired to auth context
│       └── MyProfilePage.tsx     # Athlete portal with MMR ring + game log
│
├── server/                       # Express backend
│   ├── prisma/
│   │   ├── schema.prisma         # 11 models (User, Team, Player, Match, etc.)
│   │   └── seed.ts               # Demo data seeder
│   └── src/
│       ├── config/               # env, database, redis, s3
│       ├── middleware/           # auth (JWT), validate (Zod), errors, errorHandler
│       ├── queues/
│       │   └── videoQueue.ts     # BullMQ queue + Redis list pusher
│       ├── routes/               # auth, players, matches, sessions, leaderboard,
│       │                         # upload, jobs, analytics
│       └── services/             # Business logic layer (one file per domain)
│
├── worker/                       # Python AI worker
│   ├── pipeline/
│   │   ├── detector.py           # RF-DETR stub (returns synthetic bounding boxes)
│   │   ├── tracker.py            # ByteTrack stub (assigns consistent track IDs)
│   │   └── processor.py          # Orchestrates detection → tracking → S3 upload
│   ├── analytics/
│   │   ├── constants.py          # GIS weights, MMR bounds (BASE=50, MAX=99)
│   │   ├── stats.py              # Box score + advanced stats (eFG%, PPP, USG%, etc.)
│   │   ├── elo.py                # Custom MMR algorithm (Game Impact Score → delta)
│   │   └── game_state.py         # Trajectory events → play tags → highlights
│   ├── config.py
│   └── main.py                   # Redis BLPOP consumer loop
│
├── docker-compose.yml            # PostgreSQL, Redis, MinIO, minio-init
└── .env.example                  # Template — copy to .env and fill secrets
```

---

## User Roles

| Role | Default Route | Access |
|---|---|---|
| `COACH` | `/app/dashboard` | Dashboard, Upload Film, Analytics, Roster, Leaderboard, Settings |
| `SCOUT` | `/app/leaderboard` | Leaderboard (with full player profiles), Analytics, Settings |
| `ATHLETE` | `/app/my-profile` | My Profile (own MMR + stats + highlights), Leaderboard, Settings |

Routes are protected at the React router level (`ProtectedRoute`) and also enforced server-side via `requireRole()` middleware on all sensitive endpoints.

---

## MMR / Elo System

Players start at **MMR 50** (out of 99). After each processed match game, their MMR updates based on:

### Formula

```
Game Impact Score (GIS) = weighted sum of:
  - Points (15%)     - Rebounds (12%)    - Assists (15%)
  - Steals (10%)     - Blocks (8%)       - Turnovers (-10%)
  - eFG% (15%)       - USG% (8%)         - +/- (7%)

GIS normalized to 0–1 scale vs. position-average benchmarks

Expected Score = 1 / (1 + 10^((opponent_avg_mmr - player_mmr) / 40))

K-factor = 3.2 × (1 + 0.3 × performance_deviation)
  (higher K when performance is a big surprise vs. expectation)

MMR Delta = K × (actual_result - expected_score)
  where actual_result = 0.7 × GIS_normalized + 0.3 × win_loss

New MMR = clamp(old_mmr + delta, 0, 99)
```

### Key design decisions
- **70/30 split** between individual performance and team win/loss — a player can gain MMR from a loss if they performed significantly above their expected output
- **Max 99** — no player ever hits 100; this creates a permanent "elite" ceiling
- **Practice sessions never update MMR** — only verified match film does
- Every change is logged in `EloHistory` (append-only) for full audit trail

---

## Video Upload Pipeline

### Match Film (updates MMR)
1. Coach selects a pre-scheduled match from the dropdown
2. Selects jersey colors for team identification
3. File is uploaded directly to S3 via presigned URL
4. `POST /upload/confirm` creates a `VideoJob` (type: `MATCH`) and enqueues it
5. Python worker processes → stats computed → `POST /analytics/compute` called
6. Server runs a database transaction: saves `MatchStat` rows, creates `PlayTag` and `HighlightClip` records, updates each player's `mmr`, appends to `EloHistory`, marks match `isProcessed = true`

### Practice / Session (does NOT update MMR)
- Same upload flow but `VideoJob` type is `SESSION`
- Worker computes stats and creates `SessionStat` rows only
- No `EloHistory` entries, no MMR changes
- Used for internal coaching feedback, not public rankings

---

## API Reference

Base URL: `http://localhost:3001/api/v1`

All protected routes require `Authorization: Bearer <access_token>` header.

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | None | Create account |
| POST | `/auth/login` | None | Login, returns `accessToken` + `refreshToken` |
| POST | `/auth/refresh` | None | Exchange refresh token for new access token |
| GET | `/auth/me` | Any | Get current user + team |

### Players
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/players` | Any | List players (filter: teamId, position, gradYear, search) |
| GET | `/players/:id` | Any | Single player with career averages |
| POST | `/players` | COACH | Create player |
| PATCH | `/players/:id` | COACH | Update player |
| GET | `/players/:id/elo-history` | Any | MMR history array |
| GET | `/players/:id/stats` | Any | Career averages + recent game log |

### Matches
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/matches` | Any | List matches (filter: teamId, season) |
| GET | `/matches/scheduled` | COACH | Unprocessed matches available for upload |
| GET | `/matches/:id` | Any | Single match with stats |
| POST | `/matches` | COACH | Create scheduled match |
| PATCH | `/matches/:id` | COACH | Update match |

### Upload
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/upload/presign` | COACH | Get presigned S3 upload URL |
| POST | `/upload/confirm` | COACH | Confirm upload + trigger processing job |

### Jobs
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/jobs/:jobId` | COACH | Get job status + real-time progress |
| GET | `/jobs` | COACH | List jobs by matchId or sessionId |
| PATCH | `/jobs/:jobId/internal-update` | Worker secret | Update job progress (Python worker only) |

### Analytics
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/analytics/match/:matchId` | COACH/SCOUT | Four factors, net rating |
| GET | `/analytics/match/:matchId/tags` | COACH/SCOUT | Play tags for this match |
| POST | `/analytics/match/:matchId/tags` | COACH | Create play tag |
| PATCH | `/analytics/tags/:id` | COACH | Update play tag |
| DELETE | `/analytics/tags/:id` | COACH | Delete play tag |
| GET | `/analytics/match/:matchId/highlights` | Any | AI-generated highlight clips |
| GET | `/analytics/player/:playerId/highlights` | Any | Player's highlight clips |
| POST | `/analytics/compute` | Worker secret | Store full processing results (Python worker callback) |

### Leaderboard
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/leaderboard` | Any | Paginated rankings (filter: state, classification, gradYear, position, search) |

### Sessions
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/sessions` | COACH | List sessions (filter: type) |
| GET | `/sessions/:id` | COACH | Single session |
| POST | `/sessions` | COACH | Create session |

---

## Database Schema

11 Prisma models across 3 conceptual groups:

**Users & Teams**
- `User` — email, password hash, role (COACH/SCOUT/ATHLETE), linked to Team and optionally Player
- `Team` — name, abbreviation, level/classification, state, `visibilitySettings` JSON (coach controls what athletes can see)

**Players & Performance**
- `Player` — name, position, `mmr` (Float, default 50, max 99), stars, height/weight, linked to Team
- `EloHistory` — append-only log of every MMR change with delta and reason
- `MatchStat` / `SessionStat` — per-player box scores (pts, reb, ast, stl, blk, fg, 3pt, ft, +/-)

**Matches & Sessions**
- `Match` — scheduled matchup between two Teams, `homeScore`/`awayScore`, `isProcessed` flag
- `Session` — practice/scrimmage/training session (PRACTICE, SCRIMMAGE, TRAINING)
- `VideoJob` — tracks processing state (PENDING/PROCESSING/COMPLETED/FAILED), type (MATCH/SESSION), S3 key, progress %
- `TrajectoryLog` — S3 key for the raw trajectory JSON output from the CV pipeline
- `PlayTag` — coach-annotated or AI-detected event at a timestamp (label, statType, playerId)
- `HighlightClip` — AI-generated clip with start/end time, clipType, linked to Match and optionally Player

---

## Seed Data & Demo Credentials

Run `cd server && npx prisma db seed` to populate:

### Teams
| Name | Level | State |
|---|---|---|
| Westview Wolverines | 5A High School | CA |
| Lincoln Lions | 4A High School | CA |
| UCI Anteaters | D1 College | CA |

### Login Accounts

| Role | Email | Password |
|---|---|---|
| Coach | `coach@clutch.gg` | `clutch2026` |
| Scout | `scout@clutch.gg` | `clutch2026` |
| Athlete | `athlete@clutch.gg` | `clutch2026` |

### Seeded Content
- 15 players with varied MMR (42–72 range), positions, jersey numbers
- 4 matches (2 processed with scores, 2 upcoming/unprocessed for upload demo)
- Match stats for processed matches
- Elo history entries (initial + post-game adjustments)
- 1 practice session

---

## Scripts Reference

### Frontend (root)
```bash
npm run dev          # Start Vite dev server (port 5173)
npm run build        # Production build to dist/
npm run preview      # Preview production build locally
```

### Backend (server/)
```bash
npm run dev          # Start with ts-node-dev (hot reload, port 3001)
npm run build        # Compile TypeScript to dist/
npm run start        # Run compiled JS (production)
```

### Prisma (server/)
```bash
npx prisma migrate dev --name <name>   # Create + apply a migration
npx prisma migrate deploy              # Apply migrations in production
npx prisma db seed                     # Run seed.ts
npx prisma studio                      # Open database GUI at localhost:5555
npx prisma generate                    # Regenerate Prisma client after schema changes
```

### Docker
```bash
docker compose up -d            # Start all services in background
docker compose ps               # Check service status
docker compose logs postgres    # View PostgreSQL logs
docker compose down             # Stop services (keeps data volumes)
docker compose down -v          # Stop + delete all data volumes (full reset)
```

### Python Worker (worker/)
```bash
source venv/bin/activate        # Activate virtualenv (Mac/Linux)
venv\Scripts\activate           # Activate virtualenv (Windows)
python main.py                  # Start worker (blocks, listens on Redis)
```
