# Clutch — Web (`clutch_web`) — CLAUDE.md

## What this repo is

Marketing and **coach portal** web app for **Clutch** (basketball analytics). This is **not** the React Native / Expo mobile app—that lives in a separate repo.

- **Public site:** Landing at `/` (`src/pages/Index.tsx`) with marketing sections, Navbar, Footer.
- **App area:** Authenticated-style flows under `/app/*` (login, dashboard, leaderboard, roster, upload, analytics archive, per-match analytics, settings). UI is mostly static/demo; navigation is real via React Router.

## Stack

| Layer | Choice |
|--------|--------|
| Build | Vite 7 |
| UI | React 18 + TypeScript |
| Styling | Tailwind CSS 3 + `tailwind.config.ts` |
| Components | shadcn/ui (Radix primitives) in `src/components/ui/` |
| Routing | `react-router-dom` v6 — routes declared in `src/App.tsx` |
| Data fetching (available) | `@tanstack/react-query` (provider in `App.tsx`; not required everywhere) |
| Tests | Vitest + Testing Library (`src/test/`) |

**There is no Supabase client, no backend API client, and no real auth in this codebase today.** Login is a placeholder (button navigates to dashboard).

## Directory layout

```
src/
├── App.tsx                 # Routes, QueryClientProvider, toasters, TooltipProvider
├── main.tsx
├── index.css               # Global CSS + CSS variables (shadcn theme)
├── assets/                 # e.g. clutch_logo.png
├── components/
│   ├── Navbar.tsx          # Landing nav (Web Version → /app/login)
│   ├── AppSidebar.tsx      # Shared coach portal sidebar (all /app pages except login)
│   ├── AppSidebarHeader.tsx
│   ├── PageTransition.tsx
│   ├── ui/                 # shadcn primitives
│   └── …                   # FeaturesGrid, Footer, etc.
├── hooks/
├── lib/utils.ts            # `cn()` helper
└── pages/
    ├── Index.tsx           # Home
    ├── NotFound.tsx
    └── app/                # Coach portal pages
        ├── LoginPage.tsx
        ├── DashboardPage.tsx
        ├── LeaderboardPage.tsx
        ├── RosterPage.tsx
        ├── UploadPage.tsx
        ├── AnalyticsPage.tsx      # Match archive (list)
        ├── MatchAnalyticsPage.tsx # Single-match analytics (`/app/analytics/:matchId`)
        ├── SettingsPage.tsx
        └── PlayerProfilePanel.tsx
```

## Routing (reference)

| Path | Page |
|------|------|
| `/` | Landing |
| `/app`, `/app/login` | Login (redirect) |
| `/app/dashboard` | Dashboard |
| `/app/leaderboard` | Leaderboard |
| `/app/roster` | Roster |
| `/app/upload` | Upload |
| `/app/analytics` | Analytics archive |
| `/app/analytics/:matchId` | Match-level analytics |
| `/app/settings` | Settings |
| `*` | NotFound |

## Conventions

1. **Secrets:** Do not commit `.env` or paste API keys into source. Confirm `.gitignore` covers env files before commits.
2. **Styling:** Prefer Tailwind utility classes and existing `components/ui/*` patterns. Theme tokens live in `tailwind.config.ts` and `src/index.css` (e.g. `background-dark`, `surface-dark`, `accent-teal`).
3. **Paths:** Use `@/` alias for `src/` (see `tsconfig`).
4. **Scope:** Keep changes focused; avoid unrelated refactors when fixing a single feature.
5. **App shell:** New `/app/*` screens should use `AppSidebar` + `AppSidebarHeader` (compact on mobile) like existing coach pages unless explicitly building a standalone layout.

## Security architecture (non-negotiable)

These constraints apply to **all code generation** and **any database or backend configuration** introduced for Clutch. They are **system-level**: do not implement insecure shortcuts; treat them as architecture, not suggestions.

### 1. Data access and row-level security (database / backend)

- **Isolate sensitive state** (subscription tier, API quotas, admin flags, internal rate-limit counters) in **restricted tables** that clients cannot mutate—enforce via RLS/policies and service roles, not app-only checks.
- **Tenant isolation:** every read policy must prevent **horizontal privilege escalation** (one tenant must never read another’s rows). Prefer explicit, testable policies over implicit trust.
- **Audits:** prioritize **adversarial edge cases** (cross-tenant IDs, policy gaps, stale tokens) over checklist-only reviews.

*This repo’s web client has no DB yet; when Supabase or another backend is added, RLS and tenant rules must be designed and reviewed with the above in mind.*

### 2. Request throttling and resource management

- **Quotas and limits are enforced only on the server.** Assume **all frontend validation is bypassable**—never rely on the browser for security boundaries.
- Use **dual-layer throttling** when implementing APIs: **per-user** limits (stored in server-controlled, non–user-writable configuration) and **IP-based** limits to reduce volumetric abuse.

*Any future API routes or serverless functions must implement throttling server-side; do not simulate “rate limits” in React state alone.*

### 3. Credentials and execution management

- **Third-party calls** (AI APIs, payments, cloud storage, email) run **only in trusted backend environments** (server, edge functions with secrets, Supabase Edge Functions with vault secrets)—**never** from the browser with privileged keys.
- **Vite / client env:** Treat `VITE_*` and any value bundled into the client as **public**. **Never** put secret API keys, service role keys, or payment secrets into frontend env vars or source.
- **Cost controls:** external integrations (AI, cloud, billing) should use **budget caps, alerts, or hard limits** where the provider supports them.

### Frontend-specific rule (this repo)

UI may hide features or show friendly errors for UX, but **authorization and entitlements must be enforced again on every protected API and database operation.** Route guards in React Router are **not** security boundaries.

## Scripts

```bash
npm install
npm run dev      # Vite dev server
npm run build    # Production build
npm run lint
npm run test     # Vitest
```

## Product context (high level)

Clutch is a basketball analytics product. This web app presents the **coach / institutional** experience (enterprise login UI, dashboards, roster, uploads, analytics archive). Copy and visuals should stay consistent with brand (orange accent `#ff6a00`, dark surfaces).

## MCP / tooling (optional)

Project may define MCP servers in `.cursor/mcp.json` or similar for docs (e.g. Supabase, Notion). **Runtime integration** of Supabase is not present in `package.json` or `src/` for this repo.

---

*Update this file when stack or routing changes materially.*
