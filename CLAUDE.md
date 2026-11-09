# Clutch - Web (`clutch_web`) - CLAUDE.md

## What this repo is

Marketing and **coach portal** web app for **Clutch** (basketball analytics). This is **not** the React Native / Expo mobile app, which lives in a separate repo.

- **Public site:** Landing at `/` (`src/pages/Index.tsx`): Navbar, the hero 1v1 and court leaderboard (`GameStage`), then Features, How It Works, PullQuote, the beta form (`FooterCTA`) and Footer, which load as one lazy chunk (`BelowFold`) inside an error boundary (`LazyBoundary`), so a failed chunk leaves the hero up. Footer also ships in the main JS, since `ContactPage` imports it. A plugin in `vite.config.ts` preloads that chunk, and the entrance waits until it has painted (`holdEntrance` in `src/lib/entrance.ts`, released by `BelowFold`), within its 500 ms cap.
- **Contact page:** `/contact` (`src/pages/ContactPage.tsx`) with team cards linking to LinkedIn.
- **Coach portal (not routed):** pages under `src/pages/app/`, `src/components/app/`, `src/contexts/`, `src/hooks/api/` and `src/lib/api.ts` stay in the tree but nothing imports them. `App.tsx` redirects `/app/*` to `/`. The API shapes those pages expect are in `src/types/portal.ts` and differ from `server/` in places; reconcile before routing them again.

## Stack

| Layer | Choice |
|--------|--------|
| Build | Vite 7 |
| UI | React 18 + TypeScript |
| Styling | Tailwind CSS 3 + `tailwind.config.ts` |
| Components | shadcn/ui (Radix primitives) in `src/components/ui/` |
| Routing | `react-router-dom` v6, routes declared in `src/App.tsx` |
| Type | Geist 400-600 and Geist Mono 400-500, self-hosted from `@fontsource-variable` (latin) and preloaded in `index.html` |
| Motion | framer-motion 12 and Lenis; values and variants in `src/lib/motion.ts` |
| Data fetching (available) | `@tanstack/react-query` (provider in `App.tsx`; not required everywhere) |
| Tests | Vitest + Testing Library (setup in `src/test/setup.ts`, tests sit next to the code as `*.test.tsx`) |

**Nothing in the routed site talks to a backend.** `server/` (Express + Prisma) and `worker/` (Python) exist in the repo for the portal but are not wired to the routed pages. The portal's auth context and axios client are unrouted code.

## Directory layout

```
src/
├── App.tsx                 # Routes, QueryClientProvider, toasters, TooltipProvider, MotionConfig, Lenis
├── main.tsx
├── index.css               # Global CSS, Geist @font-face, shadcn theme variables
├── assets/                 # clutch_logo.png, game/ (court photo, ball), ladder/ (player photos)
├── components/
│   ├── landing/            # Navbar, GameStage (Hero + Leaderboard), BelowFold, LazyBoundary, FeaturesPolaroidGrid, HowItWorksRail, PullQuote, FooterCTA, Footer, SplitText, AnimatedNumber, DashedDraw, DemoVideo, RotatingGlobe (with its court data in globeData.ts)
│   │   ├── game/           # The hero 1v1 and court ladder: pure modules (game, timeline, playback, ladder, layout with the site GRID) and LiveCard, HalfCourt, FlipNumber, LadderCard, MmrToken, PlaybackProvider
│   │   └── steps/          # How It Works step animations
│   ├── app/                # AppLayout, PageTransition, ProtectedRoute (portal, not routed)
│   ├── AppSidebar*.tsx     # Portal sidebar (not routed)
│   └── ui/                 # shadcn primitives actually used: dropdown-menu, sheet, sonner, toast, toaster, tooltip
├── contexts/               # AuthContext.ts (context + useAuth), AuthProvider.tsx (portal, not routed)
├── hooks/                  # use-toast.ts, api/ (react-query hooks for the portal)
├── lib/                    # motion.ts (motion values), entrance.ts (one entrance per page load), lenis.tsx, utils.ts (cn), api.ts, supabase.ts, mmrTier.ts
├── types/portal.ts         # Shapes the portal pages expect from the API
├── test/                   # setup.ts (jest-dom, matchMedia), intersection.ts (IntersectionObserver stub), entrance.ts (stand-in for lib/entrance), siteCopy.test.ts
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
2. **Styling:** Prefer Tailwind utility classes and existing `components/ui/*` patterns. Colors are `paper`, `paperAlt`, `ink`, `inkMuted` and `brand` in `tailwind.config.ts`; `src/index.css` maps the shadcn HSL variables onto them. The portal's `background-dark`, `surface-dark` and `accent-teal` classes are no longer defined. Section content sits in `GRID` (`components/landing/game/layout.ts`) so every edge lines up with the navbar.
3. **Paths:** Use `@/` alias for `src/` (see `tsconfig`).
4. **Scope:** Keep changes focused; avoid unrelated refactors when fixing a single feature.
5. **App shell:** Portal pages wrap content in `components/app/AppLayout` + `PageTransition`. The landing and contact pages use `components/landing/Navbar` + `Footer`.
6. **Motion:** Durations and easings come from `src/lib/motion.ts`. Reduced motion shows the final state with no movement (framer `MotionConfig reducedMotion="user"`, CSS guarded by `prefers-reduced-motion`, Lenis off).

## Security architecture (non-negotiable)

These constraints apply to **all code generation** and **any database or backend configuration** introduced for Clutch. They are **system-level**: do not implement insecure shortcuts; treat them as architecture, not suggestions.

### 1. Data access and row-level security (database / backend)

- **Isolate sensitive state** (subscription tier, API quotas, admin flags, internal rate-limit counters) in **restricted tables** that clients cannot mutate; enforce via RLS/policies and service roles, not app-only checks.
- **Tenant isolation:** every read policy must prevent **horizontal privilege escalation** (one tenant must never read another’s rows). Prefer explicit, testable policies over implicit trust.
- **Audits:** prioritize **adversarial edge cases** (cross-tenant IDs, policy gaps, stale tokens) over checklist-only reviews.

*This repo’s web client has no DB yet; when Supabase or another backend is added, RLS and tenant rules must be designed and reviewed with the above in mind.*

### 2. Request throttling and resource management

- **Quotas and limits are enforced only on the server.** Assume **all frontend validation is bypassable**; never rely on the browser for security boundaries.
- Use **dual-layer throttling** when implementing APIs: **per-user** limits (stored in server-controlled, non–user-writable configuration) and **IP-based** limits to reduce volumetric abuse.

*Any future API routes or serverless functions must implement throttling server-side; do not simulate “rate limits” in React state alone.*

### 3. Credentials and execution management

- **Third-party calls** (AI APIs, payments, cloud storage, email) run **only in trusted backend environments** (server, edge functions with secrets, Supabase Edge Functions with vault secrets), **never** from the browser with privileged keys.
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

## Issue Log

- **Chrome left drawn circles and arcs slightly open.** Found 2026-11-07. Resolved 2026-11-07. Resolution: Chrome sizes a `pathLength` dash from an arc length estimate up to about 2.5% short, so the dash is cleared (`strokeDasharray: "none"`) once the draw ends (`drawShown` in `src/lib/motion.ts`).
- **framer-motion never repaints a key that appears only in `transitionEnd`.** Found 2026-11-07. Resolved 2026-11-07. Resolution: name the key in the animated target as well (`drawShown` in `src/lib/motion.ts`).
- **Headline words widened mid-entrance on slow first loads.** Found 2026-11-07. Resolved 2026-11-08. Resolution: Geist from Google Fonts arrived after the 500 ms entrance cap; Geist and Geist Mono are now self-hosted and preloaded in `index.html`, and land before the entrance starts.

## Where knowledge lives

- Company brain (Obsidian vault): `../brain/INDEX.md`. Read only what the task needs.
- This website in the brain: `../brain/products/web/overview.md` (what the site is for, what each section claims, and which product note backs each claim). Read it before changing copy or adding a section.
- What Clutch is and its products: `../brain/company/mission.md`, `../brain/products/casual/overview.md`.
- To-dos: Jira project CLUTCH (`node --no-warnings ../brain/.tools/scripts/jira.ts mine`).

## MCP / tooling (optional)

Project may define MCP servers in `.cursor/mcp.json` or similar for docs (e.g. Supabase, Notion). **Runtime integration** of Supabase is not present in `package.json` or `src/` for this repo.

---

*Update this file when stack or routing changes materially.*
