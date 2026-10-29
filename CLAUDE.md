# Clutch — Web (`clutch_web`) — CLAUDE.md

## What this repo is

Marketing and **coach portal** web app for **Clutch** (basketball analytics). This is **not** the React Native / Expo mobile app—that lives in a separate repo.

- **Public site:** Landing at `/` (`src/pages/Index.tsx`) with marketing sections, Navbar, Footer.
- **Contact page:** `/contact` (`src/pages/ContactPage.tsx`) with team cards linking to LinkedIn.
- **Coach portal (not routed):** pages under `src/pages/app/`, `src/components/app/`, `src/contexts/`, `src/hooks/api/` and `src/lib/api.ts` stay in the tree but nothing imports them. `App.tsx` redirects `/app/*` to `/`. The API shapes those pages expect are in `src/types/portal.ts` and differ from `server/` in places; reconcile before routing them again.

## Stack

| Layer | Choice |
|--------|--------|
| Build | Vite 7 |
| UI | React 18 + TypeScript |
| Styling | Tailwind CSS 3 + `tailwind.config.ts` |
| Components | shadcn/ui (Radix primitives) in `src/components/ui/` |
| Routing | `react-router-dom` v6 — routes declared in `src/App.tsx` |
| Data fetching (available) | `@tanstack/react-query` (provider in `App.tsx`; not required everywhere) |
| Tests | Vitest + Testing Library (setup in `src/test/setup.ts`, tests sit next to the code as `*.test.tsx`) |

**Nothing in the routed site talks to a backend.** `server/` (Express + Prisma) and `worker/` (Python) exist in the repo for the portal but are not wired to the routed pages. The portal's auth context and axios client are unrouted code.

## Directory layout

```
src/
├── App.tsx                 # Routes, QueryClientProvider, toasters, TooltipProvider
├── main.tsx
├── index.css               # Global CSS + CSS variables (shadcn theme)
├── assets/                 # clutch_logo.png, basketball.png
├── components/
│   ├── landing/            # Navbar, Hero, BallZoom, FeaturesPolaroidGrid, HowItWorksRail, PullQuote, FooterCTA, Footer, Loader
│   ├── app/                # AppLayout, PageTransition, ProtectedRoute (portal, not routed)
│   └── ui/                 # shadcn primitives actually used: dropdown-menu, sheet, sonner, toast, toaster, tooltip
├── contexts/               # AuthContext.ts (context + useAuth), AuthProvider.tsx (portal, not routed)
├── hooks/                  # use-toast.ts, api/ (react-query hooks for the portal)
├── lib/                    # utils.ts (cn), lenis.tsx, api.ts, supabase.ts, mmrTier.ts
├── types/portal.ts         # Shapes the portal pages expect from the API
├── test/setup.ts           # Vitest setup (jest-dom, matchMedia stub)
└── pages/
    ├── Index.tsx           # Landing
    ├── ContactPage.tsx     # /contact
    ├── NotFound.tsx
    └── app/                # Coach portal pages (not routed)
```

## Routing (reference)

| Path | Page |
|------|------|
| `/` | Landing |
| `/contact` | Contact (team) |
| `/app/*` | Redirects to `/` (portal disabled) |
| `*` | NotFound |

## Conventions

1. **Secrets:** Do not commit `.env` or paste API keys into source. Confirm `.gitignore` covers env files before commits.
2. **Styling:** Prefer Tailwind utility classes and existing `components/ui/*` patterns. Theme tokens live in `tailwind.config.ts` and `src/index.css` (e.g. `background-dark`, `surface-dark`, `accent-teal`).
3. **Paths:** Use `@/` alias for `src/` (see `tsconfig`).
4. **Scope:** Keep changes focused; avoid unrelated refactors when fixing a single feature.
5. **App shell:** Portal pages wrap content in `components/app/AppLayout` + `PageTransition`. The landing and contact pages use `components/landing/Navbar` + `Footer`.

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
npx tsc -p tsconfig.app.json --noEmit   # typecheck (lint and build do not)
npm run test     # Vitest
```

## Product context (high level)

Clutch is an AI basketball analytics platform with two products: Casual (the mobile app for pickup players) and Professional (institutional). This site markets Casual: a landing page plus a contact page. The coach / institutional portal pages are unrouted (see above). Brand: orange accent `#ff6a00` on the cream paper palette (`bg-paper`, `text-ink` tokens in `tailwind.config.ts`); the dark surfaces belong to the unrouted portal.

## Where knowledge lives

- Company brain (Obsidian vault): `../brain/INDEX.md`. Read only what the task needs.
- This website in the brain: `../brain/products/web/overview.md` (what the site is for, what each section claims, and which product note backs each claim). Read it before changing copy or adding a section.
- What Clutch is and its products: `../brain/company/mission.md`, `../brain/products/casual/overview.md`.
- To-dos: Jira project CLUTCH (`node --no-warnings ../brain/.tools/scripts/jira.ts mine`).

## MCP / tooling (optional)

Project may define MCP servers in `.cursor/mcp.json` or similar for docs (e.g. Supabase, Notion). **Runtime integration** of Supabase is not present in `package.json` or `src/` for this repo.

---

*Update this file when stack or routing changes materially.*
