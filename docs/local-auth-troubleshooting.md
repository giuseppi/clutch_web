# Local auth not working — checklist

## 1. Database must be migrated **and** seeded

If you never ran migrations, Postgres is empty: the API will log **`The table public.users does not exist`** (Prisma **P2021**). Login always fails — it’s not your password.

If you ever hit **Ctrl+C** during `npx prisma migrate dev`, you may also have **no tables** or **no users**. Login will fail with “Invalid email or password” or a **500** from the API.

From the repo root, with Docker running (`docker compose up -d`):

```bash
cd server
npx prisma migrate deploy
npx prisma db seed
```

`migrate deploy` is non-interactive (good for “it hung before” situations). After seed completes, you should see log lines like “Users created”.

## 2. Seeded test accounts (password for all: `clutch2026`)

| Email              | Role    |
|--------------------|---------|
| `coach@clutch.gg`  | COACH   |
| `scout@clutch.gg`  | SCOUT   |
| `athlete@clutch.gg`| ATHLETE |

## 3. `npm run dev` looks “stuck” after `tsx watch src/index.ts`

That line **is normal** — `tsx watch` compiles TypeScript on first run (can take **10–30s** on a slow disk). You should then see:

- `[clutch-api] modules loaded, creating app…`
- `[clutch-api] binding port 3001…`
- `🏀 Clutch API server running on http://localhost:3001`

If **nothing** appears for a long time, try **without** watch (easier to see errors):

```bash
cd server
npx tsx src/index.ts
```

If you see `modules loaded` but not `binding port`, an import is still blocking (say something in chat). If you see **no** `modules loaded`, the hang is while loading a dependency (often Redis/BullMQ before our lazy-init fixes).

## 4. Confirm the API is actually up

In a terminal:

```bash
curl -s http://localhost:3001/health
```

Expect JSON with `"status":"ok"`. If this fails, the frontend cannot log in.

You should also see in the **server** terminal:

`Clutch API server running on http://localhost:3001`

## 5. Frontend URL and env

- Vite is on **`http://localhost:8080`** (from your `npm run dev` output).
- **`VITE_API_URL`** in the **root** `.env` should be:
  `http://localhost:3001/api/v1`
- **`CORS_ORIGIN`** in **`server/.env`** must match the browser origin exactly:
  `http://localhost:8080`

Restart **`npm run dev`** (frontend) after changing any `VITE_*` variable.

## 6. Local vs Supabase auth

- **Local:** Leave **`VITE_SUPABASE_URL`** and **`VITE_SUPABASE_ANON_KEY`** **unset** in the root `.env`. Login uses `POST /api/v1/auth/login` on your Express server.
- **Server:** If **`SUPABASE_URL`** is set in `server/.env`, the Express **`/login`** route is **not registered** (by design). For local JWT login, do **not** set `SUPABASE_URL` on the server.

## 7. Browser debugging

Open DevTools → **Network**, submit login, and inspect the request to `.../auth/login`:

| Symptom | Likely cause |
|--------|----------------|
| `(failed)` or CORS error | API down, wrong `VITE_API_URL`, or `CORS_ORIGIN` mismatch |
| **404** on `/auth/login` | `SUPABASE_URL` set on server (routes disabled) |
| **401** / invalid credentials | Wrong email/password, or **seed not run** |
| **500** | DB error — run migrations + check server terminal logs |
