# Contributing to Clutch

Welcome to the team. This guide gets you from zero to a fully running local environment.

---

## Prerequisites

Install these before anything else:

| Tool | Version | Download |
|---|---|---|
| Node.js | 20+ | https://nodejs.org (use nvm recommended) |
| Python | 3.11+ | https://python.org |
| Docker Desktop | Latest | https://docker.com/products/docker-desktop |
| Git | Any | https://git-scm.com |

Verify:
```bash
node -v       # should be v20.x or higher
python3 -V    # should be 3.11.x or higher
docker -v     # should show a version number
```

---

## First-Time Setup (Do This Once)

### 1. Clone the repo

```bash
git clone <YOUR_GIT_URL>
cd clutch_web
```

### 2. Install all dependencies

```bash
# Frontend (run from project root)
npm install

# Backend
cd server && npm install && cd ..

# Python worker
cd worker
python3 -m venv venv
source venv/bin/activate        # Mac/Linux
# venv\Scripts\activate         # Windows
pip install -r requirements.txt
cd ..
```

### 3. Set up your environment file

```bash
cp .env.example .env
```

Now open `.env` and fill in the three required secrets:

**Generate JWT secrets** (run this command twice to get two different strings):
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Set them in `.env`:
```env
JWT_ACCESS_SECRET=<first output>
JWT_REFRESH_SECRET=<second output>
WORKER_SECRET=worker-secret-dev
VITE_API_URL=http://localhost:3001/api/v1
```

Leave everything else (database, Redis, MinIO) exactly as-is — the defaults match Docker Compose.

> **Note:** Each engineer generates their own secrets for local dev. These secrets are not shared. Production secrets are managed separately and never committed to git.

### 4. Start infrastructure (Docker)

```bash
docker compose up -d
```

This starts three services:
- **PostgreSQL** on port `5432` (your database)
- **Redis** on port `6379` (job queue + progress tracking)
- **MinIO** on port `9000` (local S3 replacement for video storage)

Check they're all running:
```bash
docker compose ps
```
All three should show `running`.

### 5. Initialize the database

First, create a symlink so Prisma can find your environment variables. Prisma looks for `.env` in the **current working directory** — when you run commands from inside `server/`, it won't find the `.env` at the project root. The symlink fixes this permanently:

```bash
# Run from project root (one-time setup)
ln -s ../.env server/.env
```

Then run the migrations and seed:

```bash
cd server
npx prisma migrate dev --name init
npm run db:seed
cd ..
```

`migrate dev` creates all the tables. `npm run db:seed` fills the database with demo teams, players, matches, and user accounts so you can test immediately.

> **Important:** Always use `npm run db:seed`, not `npx prisma db seed`. The Prisma CLI version requires a `"prisma": { "seed": "..." }` config block to locate the seed file — without it, the command exits silently and does nothing. `npm run db:seed` calls `tsx prisma/seed.ts` directly and always works.

### 6. Start the servers

Open **3 terminal tabs/windows:**

```bash
# Tab 1 — API server (http://localhost:3001)
cd server && npm run dev

# Tab 2 — Frontend (http://localhost:8080)
npm run dev

# Tab 3 — Python worker (optional — only needed if testing video uploads)
cd worker && source venv/bin/activate && python main.py
```

### 7. Verify it's working

Docker only runs the infrastructure (database, cache, storage) — login happens in the browser, not Docker.

Open **`http://localhost:8080/app/login`** in your browser and sign in with any of these seeded accounts:

| Role | Email | Password | Default Landing Page |
|---|---|---|---|
| Coach | `coach@clutch.gg` | `clutch2026` | `/app/dashboard` |
| Scout | `scout@clutch.gg` | `clutch2026` | `/app/leaderboard` |
| Athlete | `athlete@clutch.gg` | `clutch2026` | `/app/my-profile` |

Each role gets a different default page and different navigation links. If the leaderboard and roster show real data, you're fully set up.

---

## Daily Development Workflow

After first-time setup, every day you just need:

```bash
# Start Docker (if it stopped)
docker compose up -d

# Start backend
cd server && npm run dev

# Start frontend (separate terminal)
npm run dev
```

You don't need to re-run migrations or seed unless you pull schema changes (see below).

---

## Pulling Team Changes

When you pull new commits:

```bash
git pull

# Always reinstall deps in case package.json changed
npm install
cd server && npm install && cd ..

# If schema.prisma changed, run migrations
cd server && npx prisma migrate dev && cd ..

# If seed data changed and you want to reset
cd server && npm run db:seed && cd ..
```

Check `CHANGELOG.md` (if present) or git log for notes on whether a migration is needed.

---

## Making Schema Changes

If you modify `server/prisma/schema.prisma`:

```bash
cd server
npx prisma migrate dev --name describe_your_change
# Example: --name add_player_notes_field
```

This creates a migration file in `server/prisma/migrations/`. **Commit that file** — other engineers need it to update their local databases.

After pulling a migration from someone else:
```bash
cd server && npx prisma migrate dev
```

---

## Codebase Orientation

### Frontend (`src/`)

- **`src/lib/api.ts`** — The Axios instance. All API calls go through this. It automatically attaches JWT tokens to requests and handles silent token refresh when a 401 is received.
- **`src/contexts/AuthContext.tsx`** — Global auth state. `useAuth()` gives you `user`, `isAuthenticated`, `login()`, `logout()`.
- **`src/components/AppLayout.tsx`** — The shared sidebar used by every app page. Role-aware: shows different nav links for Coach, Scout, and Athlete.
- **`src/hooks/api/`** — One file per backend domain. All data fetching lives here using React Query. If you need to call a new endpoint, add a hook here.
- **`src/pages/app/`** — One file per page. Pages import hooks, not raw Axios calls.

### Backend (`server/src/`)

The server follows a strict layered architecture:

```
Request → Route → Middleware (auth, validate) → Service → Prisma → Response
```

- **`routes/`** — Define endpoints, attach middleware, call service functions
- **`services/`** — All business logic lives here. No Prisma calls in routes.
- **`middleware/auth.ts`** — `authenticate()`, `requireRole('COACH')`, `requireWorkerSecret()`
- **`middleware/validate.ts`** — Zod schema validation for request body/query/params
- **`config/`** — Validated env vars (will throw on startup if required vars are missing)

### Python Worker (`worker/`)

- **`main.py`** — Infinite loop: `BLPOP clutch:video:pending` → process → callback to API
- **`pipeline/`** — Video processing (detector → tracker → processor). Currently stubbed.
- **`analytics/`** — Stats computation and MMR algorithm. Real math, synthetic input data.

---

## Adding a New Feature

### New API endpoint

1. Create or update a service function in `server/src/services/`
2. Add the route in `server/src/routes/` with appropriate auth middleware
3. Register the route in `server/src/index.ts` if it's a new route file
4. Add a React Query hook in `src/hooks/api/`
5. Use the hook in your page component

### New page

1. Create `src/pages/app/YourPage.tsx` — import `AppLayout` as the outer wrapper
2. Add the route in `src/App.tsx` wrapped in `<ProtectedRoute allowedRoles={[...]}>`
3. Add a nav link in `src/components/AppLayout.tsx` in the appropriate role's link array

### Schema change

1. Edit `server/prisma/schema.prisma`
2. Run `npx prisma migrate dev --name your_change_name` from `server/`
3. Update the relevant service files
4. Commit the migration file with your PR

---

## Common Issues

| Problem | Solution |
|---|---|
| `Cannot connect to database` | Docker isn't running. Run `docker compose up -d` |
| `Environment variable not found: DATABASE_URL` | Missing `.env` symlink in `server/`. Run `ln -s ../.env server/.env` from the project root |
| `JWT_ACCESS_SECRET is required` | You haven't filled in `.env` — copy from `.env.example` |
| Login returns 401 | Seed data is missing. Run `cd server && npm run db:seed` |
| Frontend shows no data | Check that the backend is running on port 3001 |
| `prisma: command not found` | Run from inside `server/` directory, or use `npx prisma` |
| Port 5432 already in use | Another Postgres is running locally. Stop it or change the Docker port |
| MinIO bucket not found | Run `docker compose down -v && docker compose up -d` to reset |
| Python `ModuleNotFoundError` | Make sure your virtualenv is activated: `source venv/bin/activate` |

---

## Useful Commands

```bash
# View all running API routes
cd server && npx ts-node -e "import './src/index'" 2>&1 | head -30

# Open database GUI (Prisma Studio)
cd server && npx prisma studio
# Opens at http://localhost:5555 — lets you view/edit tables visually

# Reset the database completely
cd server
npx prisma migrate reset    # Drops all tables, re-runs migrations, re-seeds

# Check what's in the Redis queue
docker exec -it $(docker compose ps -q redis) redis-cli LLEN clutch:video:pending

# View backend logs with timestamps
cd server && npm run dev 2>&1 | ts

# Kill whatever is running on a port (Mac/Linux)
lsof -ti:3001 | xargs kill -9   # kills port 3001
lsof -ti:8080 | xargs kill -9   # kills port 8080
```

---

## Questions?

Reach out to **Giuseppi Pelayo** or open a GitHub issue.
