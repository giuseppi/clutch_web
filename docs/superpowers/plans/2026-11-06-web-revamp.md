# Clutch Web Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the loader, the black ball-zoom section and the physics hero with a scripted 1v1 half-court hero, a live card and a court leaderboard, on one type family (Geist) and one motion standard.

**Architecture:** Everything the game shows is a pure function of two clock values: `t` (design seconds, 0 to 22) for the hero and `lt` (0 to 2.3) for the leaderboard. Pure modules in `src/components/landing/game/` hold the shot script, scoring, beat frames, ladder frames and the clock step. A `PlaybackProvider` advances the clock on `requestAnimationFrame` from visibility inputs, and React components render the frame for the current values. Site-wide type and motion live in `tailwind.config.ts`, `src/index.css` and `src/lib/motion.ts`.

**Tech Stack:** Vite 7, React 18, TypeScript, Tailwind 3.4, framer-motion 12, Lenis, Vitest + Testing Library (jsdom), Geist and Geist Mono from Google Fonts.

**Spec:** `docs/superpowers/specs/2026-11-06-web-revamp-design.md` (approved 2026-11-06). Visual reference: `/Users/giuseppi/dev/clutch_dir/clutch_web/.lavish/revamp/index.html`. It is gitignored, so open it by that absolute path from any worktree. Where the sketch and the spec disagree, the spec wins.

## Global Constraints

- Fonts: Geist 400, 500, 600 and Geist Mono 400, 500 only. No Inter, Inter Tight, JetBrains Mono or Material Symbols. No italics. Headings are Geist 600.
- No new dependencies. Geist loads from Google Fonts, so it needs no npm package. `matter-js` and `@types/matter-js` are removed.
- No em dash (U+2014) in site copy, in comments in files you touch, or in commits and PR bodies. Use "-", ":", "," or a period.
- Anti-goals: no full-screen black or dark surface; no pinning or scroll-jacking in the hero; the live card never changes size; no claims beyond Casual features (who shot, make or miss, 2 or 3, shot spots, MMR change).
- First names only: Giuseppi, Johnny, Andrew, Dylan.
- Motion values come from `src/lib/motion.ts`. The game and leaderboard run at `RATE = 1.25`; the entrance runs at 1x.
- Reduced motion shows the final state with no movement: framer `MotionConfig reducedMotion="user"`, CSS animations guarded by `prefers-reduced-motion`, Lenis off.
- Before every commit: `npm run lint`, `npx tsc -p tsconfig.app.json --noEmit`, `npm run test` and `npm run build` all pass with no warnings. Baseline on 2026-11-06: all clean, 6 tests, main JS bundle 611.59 kB (193.25 kB gzip).
- Git (giuseppi, 2026-11-06): one `revamp` branch with one commit or more per task, and one draft PR from `revamp` into `main`, so the Vercel Preview follows each task. Implementers commit only; the controller pushes. Never merge to `main` without giuseppi's explicit "yes, deploy". No AI attribution or co-author lines in commits or PRs. PR bodies are in giuseppi's voice: a plain opening sentence, then Why / What changed / Unchanged / Verification, no emoji.

## Review Focus

1. **A stalled frame** (tab hidden then shown, a slow phone, a GC pause): the game resumes where it was and never skips shots or jumps to the end. Test: `advance` clamps `dt` to 0.05 s (Task 3).
2. **A phone rotating or an iPhone Duo folding mid-game:** the layout switches, but the game, the entrance and the card's DOM node carry on. Tests: `layoutFor` boundaries (Task 3) and a resize test that keeps the card node and the score (Task 5).
3. **Score changes arriving faster than a flip** (8x fast-forward): the number always settles on the newest score with no leftover half layers. Test: FlipNumber overlapping changes (Task 4).
4. **A reader landing mid-page** (an `/#download` link, a reload with restored scroll, a fast scroll): with the leaderboard on screen and the card off, the game fast-forwards and the beat follows within about 4 s. With neither on screen, the game plays at normal speed. Test: `advance` from `t = 0` (Task 3).
5. **Narrow phones** (320, 360 and 375 px wide): no horizontal scroll, no clipped card text, balanced headline. Test: these sizes join the browser checks in Tasks 4 to 7.

---

## Before you start

- [ ] Create the integration branch and commit the docs:

```bash
git switch -c revamp main
git add .gitignore docs/superpowers/specs/2026-11-06-web-revamp-design.md docs/superpowers/plans/2026-11-06-web-revamp.md
git commit -m "docs: add web revamp design and plan"
git push -u origin revamp
```

- [ ] Jira: check CLUTCH once for an existing revamp epic with the brain's script (`node --no-warnings ../brain/.tools/scripts/jira.ts`). Propose one ticket for the whole revamp to giuseppi, and create it only after a yes.
- [ ] Open a draft PR from `revamp` into `main` once Task 1 is reviewed. After each task, push `revamp` so the Preview updates.

Browser sizes used by the checks (CSS px): 320×568, 360×780, 375×667, 390×844, 844×390, 466×678, 626×890, 890×626, 820×1180, 1180×820, 1024×1366, 1440×900. At every size: `document.documentElement.scrollWidth <= innerWidth` and no console errors.

---

### Task 1: Type system, copy and nav

**Files:**
- Modify: `index.html` (font links, og and twitter titles), `tailwind.config.ts:17-21`, `src/index.css` (body font, `.font-mono`, `.font-display`, `.label-mono`, new `.label`)
- Modify: `src/components/landing/{Navbar,Footer,FooterCTA,FeaturesPolaroidGrid,HowItWorksRail,PullQuote,RotatingGlobe}.tsx`, `src/pages/ContactPage.tsx`, `src/pages/NotFound.tsx`
- Modify: `src/components/landing/Navbar.test.tsx`
- Create: `src/test/siteCopy.test.ts`

**Interfaces:**
- Produces: CSS utility `.label` (Geist 500, uppercase, `letter-spacing: 0.08em`, `font-size: 0.75rem`). Tailwind `font-sans` and `font-display` are Geist; `font-mono` is Geist Mono with tabular figures. `.label-mono` stays, now in Geist Mono, for data only.

- [ ] **Step 1: Write the failing tests**

`src/test/siteCopy.test.ts` loads sources with `import.meta.glob(["/src/components/landing/**/*.tsx", "/src/pages/*.tsx", "/index.html", "!**/*.test.tsx"], { query: "?raw", import: "default", eager: true })`. It skips a `REPLACED_LATER` list: `Hero.tsx`, `BallZoom.tsx` and `AROverlay.tsx` (removed from the list in Task 4) and `Loader.tsx` (Task 5).

```ts
it("loads Geist and Geist Mono and no other family", () => {
  expect(html).toContain("family=Geist:wght@400;500;600");
  expect(html).toContain("family=Geist+Mono:wght@400;500");
  expect(html).not.toMatch(/Inter|JetBrains|Material/);
});
it.each(files)("%s has no em dash", (name, src) => expect(src).not.toContain("\u2014"));
it.each(files)("%s uses no italics or unloaded weights", (name, src) =>
  expect(src).not.toMatch(/\b(italic|font-light|font-thin|font-bold|font-extrabold)\b/));
```

In `Navbar.test.tsx`, drop the `COMING SOON` line from the anchors test and add:

```ts
it("has one Coming soon control, a link to the beta form", () => {
  renderNavbar();
  const links = screen.getAllByRole("link", { name: /coming soon/i });
  expect(links).toHaveLength(1);
  expect(links[0]).toHaveAttribute("href", "/#download");
  expect(screen.queryByRole("button", { name: /coming soon/i })).toBeNull();
});
```

- [ ] **Step 2: Run `npm run test` and confirm these fail** (fonts, em dashes, italics, the nav link count).

- [ ] **Step 3: Implement**
  - `index.html`: replace both font `<link>`s with `https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap`. Keep the two preconnects.
  - `tailwind.config.ts`: `sans` and `display` are `["Geist", "system-ui", "sans-serif"]`; `mono` is `['"Geist Mono"', "ui-monospace", "monospace"]`.
  - `src/index.css`:
    - `body` is Geist.
    - `.font-mono` is Geist Mono with `font-variant-numeric: tabular-nums`.
    - `.font-display` is Geist 600, `letter-spacing: -0.03em`, `line-height: 1`. Hero-size headings set -0.04em themselves.
    - `.label-mono` moves to Geist Mono.
    - Add `.label`.
  - **Labels:** swap `label-mono` for `label` everywhere, except text that is a number, score or stat readout.
  - **Headings:** remove `font-medium` and `font-light` from every `font-display` element, so they get 600. The decorative numerals (`FeaturesPolaroidGrid.tsx:77`, `HowItWorksRail.tsx:113`) use `font-normal`.
  - **Italics:**
    - Remove `italic` at `FeaturesPolaroidGrid.tsx:46,77`, `FooterCTA.tsx:66`, `HowItWorksRail.tsx:70,113` and `PullQuote.tsx:22`.
    - `FeaturesPolaroidGrid.tsx:46` becomes `text-brand`, since emphasis is brand orange.
    - The `not-italic` span at `PullQuote.tsx:25` becomes `text-brand`.
  - `NotFound.tsx:14`: `font-bold` becomes `font-semibold`.
  - **Navbar (C6):**
    - Delete the `COMING SOON` NavLink.
    - Replace the toast button with `<a href="/#download">COMING SOON</a>`, keeping its classes.
    - Remove `handleComingSoon` and the `sonner` import.
  - **Em dashes (C4):** use the copy below; giuseppi reviews it in the PR. Comments with an em dash get "-". Any em dash the test finds that isn't listed gets a plain rewrite, flagged in the PR body.

| Where | New text |
|---|---|
| `index.html` og:title and twitter:title | `Clutch - AI Basketball Analytics` |
| `PullQuote.tsx:24-25` | `Talent is everywhere. The cameras aren't. Clutch closes that gap, built for the leagues that <span className="text-brand">aren't</span> on TV.` |
| `PullQuote.tsx:36` | `THE CLUTCH TEAM` |
| `FooterCTA.tsx:54` | `COMING SOON · 04` |
| `FooterCTA.tsx:78` | `iOS, Android, and web are all coming soon. Be on the list when the beta opens.` |
| `FeaturesPolaroidGrid.tsx:32` | `FEATURES · 02` |
| `FeaturesPolaroidGrid.tsx:242` | `Every shot, assist, board, and turnover, extracted from the video. No clipboard, no scorer's table.` |
| `FeaturesPolaroidGrid.tsx:246` | `Performance converts into a competitive rating. Glicko-2 with custom modifiers, borrowed from chess and tuned for hoops.` |
| `FeaturesPolaroidGrid.tsx:250` | `Real-time score and game clock, derived from the play. No manual input. The AI handles it as the game happens.` |
| `HowItWorksRail.tsx:13` | `Prop it on the bleachers, a backpack, a tripod, or anywhere with a view of the court. Open the app and confirm.` |
| `HowItWorksRail.tsx:21` | `Shoot, drill, scrimmage. Every shot, board, and assist is recorded the moment it happens. No clipboard, no scorer.` |
| `HowItWorksRail.tsx:29` | `Watch Clutch track shots in real time, with no wearables and no manual input. Just your phone and the court.` |
| `HowItWorksRail.tsx:37` | `Box scores, shot charts, MMR tier, and trends across sessions, on your phone before you've finished cooling down.` |
| `HowItWorksRail.tsx:57` | `HOW IT WORKS · 03` |

- [ ] **Step 4: Run all four checks.** Expected: PASS.

- [ ] **Step 5: Browser check.** Run `npm run dev` and open `/` and `/contact` at 390×844 and 1440×900:
  - Headings are Geist 600, labels Geist 500 uppercase, and numbers Geist Mono.
  - No italics.
  - The Network panel shows only Geist and Geist Mono font files.
  - The nav has one Coming soon link, and it jumps to the beta form.

- [ ] **Step 6: Commit**

```bash
git add index.html tailwind.config.ts src/index.css src/components/landing src/pages src/test/siteCopy.test.ts
git commit -m "feat(web): Geist type system, plain-dash copy, single Coming soon link"
```

---

### Task 2: Motion module, reduced motion and demo loops

**Files:**
- Create: `src/lib/motion.ts`, `src/lib/motion.test.ts`, `src/lib/lenis.test.tsx`, `src/test/intersection.ts`, `src/components/landing/DemoVideo.tsx`, `src/components/landing/DemoVideo.test.tsx`, `src/components/landing/FeaturesPolaroidGrid.test.tsx`, `public/clutch-demo.mp4`, `public/clutch-demo-poster.jpg`
- Modify: `src/test/setup.ts`, `src/App.tsx`, `src/lib/lenis.tsx`, `src/components/landing/{SplitText,FeaturesPolaroidGrid,HowItWorksRail,PullQuote,FooterCTA}.tsx`, `src/index.css`
- Delete: `public/clutch.gif`

**Interfaces:**
- Produces:

```ts
// src/lib/motion.ts
export const EASE_RISE: [number, number, number, number];  // [0.16, 1, 0.3, 1]
export const EASE_DRAW: [number, number, number, number];  // [0.65, 0, 0.35, 1]
export const RISE: { y: 14; duration: 0.7; ease: typeof EASE_RISE };
export const STAGGER: 0.055;
export const DRAW: { duration: 0.9; ease: typeof EASE_DRAW };
export const FADE: { duration: 0.55 };
export const VALUE_CHANGE: 0.4;
export const ENTRANCE: { navbar: 0; headline: 0.08; courtLines: 0.25; body: 0.45; card: 0.6; courtFill: 0.7; key: 1.0; firstShot: 1.2 };
export const riseVariants: Variants;  // hidden { opacity: 0, y: 14 } -> visible { opacity: 1, y: 0, transition: RISE }
export function clamp01(x: number): number;
export function lerp(a: number, b: number, f: number): number;
export function easeInOutQuad(x: number): number;
export function easeInOutCubic(x: number): number;  // the curve of cubic-bezier(.65, 0, .35, 1)
export function easeOutQuart(x: number): number;    // close to cubic-bezier(.16, 1, .3, 1)
// src/test/intersection.ts (installed as window.IntersectionObserver by setup.ts)
export function setIntersection(target: Element, ratio: number): void;  // fires every observer watching target
export function resetIntersections(): void;                             // afterEach in setup.ts
// SplitText gains: delay?: number; play?: boolean (default true; used when whileInView is false)
```

- [ ] **Step 1: Write the failing tests**
  - **`motion.test.ts`:**
    - each easing maps 0 to 0 and 1 to 1, and never decreases over 0..1 in steps of 0.01;
    - `easeInOutQuad(0.5)` and `easeInOutCubic(0.5)` are 0.5;
    - `clamp01(-1)` is 0 and `clamp01(2)` is 1.
  - **`lenis.test.tsx`:** `vi.mock("lenis")`.
    - "does not start Lenis under reduced motion": matchMedia returns `matches: true` for `(prefers-reduced-motion: reduce)`, and the Lenis constructor is never called.
    - "starts Lenis once otherwise": called once.
  - **`DemoVideo.test.tsx`:** stub `HTMLMediaElement.prototype.play` (it resolves) and `pause`.
    - The video is `muted`, `loop` and `playsInline`, with `poster="/clutch-demo-poster.jpg"` and no `autoplay` attribute.
    - `setIntersection(video, 0.5)` calls `play`, and `setIntersection(video, 0)` calls `pause`.
    - Under reduced motion (mock framer's `useReducedMotion` to return true), `play` is never called.
  - **`FeaturesPolaroidGrid.test.tsx`:** "stops the globe off screen". Spy on `requestAnimationFrame`.
    - After `setIntersection(globeWrapper, 0.5)`, rAF is called.
    - After `setIntersection(globeWrapper, 0)`, the spy is cleared, and 200 ms of fake time adds no calls.
    - The globe wrapper is `getByTestId("court-globe")`.

- [ ] **Step 2: Run `npm run test` and confirm the new tests fail.**

- [ ] **Step 3: Implement**
  - `motion.ts` with the values above.
  - **IO stub** in `src/test/intersection.ts`, installed in `setup.ts`. Entries carry `target`, `isIntersecting: ratio > 0` and `intersectionRatio: ratio`.
  - `App.tsx`: wrap the tree inside the providers in `<MotionConfig reducedMotion="user">`.
  - `lenis.tsx`: return early, before creating Lenis, when `matchMedia("(prefers-reduced-motion: reduce)").matches`.
  - **`SplitText`:**
    - It rises by word, not by character: each word uses `RISE`, with `STAGGER` between words.
    - It gains `delay` and `play`.
    - Remove the per-call `stagger` and `y` overrides in callers, so every heading uses the standard.
  - **Reveals:** in FeaturesPolaroidGrid, HowItWorksRail, PullQuote and FooterCTA, replace hard-coded `duration`, `ease` and `y` with `RISE`, `FADE` and `riseVariants` (grep `ease: \[0.16` and `duration:`). Delays may stay.
  - **Globe:** in `CourtMatchingContent`, use its own `useInView(ref, { amount: 0.2 })` (not once) on a `data-testid="court-globe"` wrapper, plus `useReducedMotion()`. Pass `inView={onScreen && !reduced}` to `RotatingGlobe`, which then shows its first frame when still.
  - **Video:** `DemoVideo` replaces `DemoGifAnim` in `HowItWorksRail.tsx`.
    - It keeps the "CLUTCH · DEMO" and "● LIVE" labels and drops the "DROP clutch.gif" fallback.
    - Play and pause follow `useInView(ref, { amount: 0.3 })` (not once). Under reduced motion it stays on the poster.
    - Make the files with the commands below. The MP4 should be under 2 MB.
  - `index.css`: `@media (prefers-reduced-motion: reduce) { .animate-page-enter { animation: none; } }`.

```bash
ffmpeg -i public/clutch.gif -an -c:v libx264 -pix_fmt yuv420p -crf 26 -movflags +faststart -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" public/clutch-demo.mp4
ffmpeg -i public/clutch.gif -frames:v 1 -q:v 3 public/clutch-demo-poster.jpg
git rm public/clutch.gif
```

- [ ] **Step 4: Run all four checks.** Expected: PASS.

- [ ] **Step 5: Browser check** at 390×844 and 1440×900.
  - With DevTools Rendering set to `prefers-reduced-motion: reduce`:
    - scrolling is native;
    - reveals appear without moving;
    - the globe is still;
    - the video sits on its poster.
  - Without it:
    - headings rise word by word;
    - in the Performance panel, the globe's rAF stops once Features is off screen;
    - the video plays only while on screen.

- [ ] **Step 6: Commit**

```bash
git add src/lib src/test src/App.tsx src/components/landing src/index.css public/clutch-demo.mp4 public/clutch-demo-poster.jpg
git commit -m "feat(web): shared motion standard, reduced motion, on-screen-only demo loops"
```

---

### Task 3: Game script, clock and layout rules

Pure modules with no UI. Tasks 4 to 6 render from these.

**Files:**
- Create: `src/components/landing/game/timeline.ts`, `game.ts`, `game.test.ts`, `playback.ts`, `playback.test.ts`, `layout.ts`, `layout.test.ts`

**Interfaces:**
- Consumes: `clamp01`, `lerp`, `easeInOutQuad` from `@/lib/motion`.
- Produces:

```ts
// timeline.ts (design seconds)
export const START = 1.2, BEAT = 1.6, LAND = 0.95, SHOT_COUNT = 13;
export const GAME = START + SHOT_COUNT * BEAT;  // 22.0
export const RATE = 1.25, FF = 8, MAX_DT = 0.05;
export const L_ARRIVE = 1.05, L_REORDER = 1.6, L_END = 2.3;
// game.ts
export type PlayerId = "G" | "J";
export type Zone = "Corner 3" | "Above Break 3" | "Paint" | "Free Throw" | "Mid-Range";
export interface Shot { player: PlayerId; x: number; y: number; made: boolean }
export interface PlayerLine { pts: number; fgm: number; fga: number; tpm: number; tpa: number }
export interface GameState {
  landed: number;                              // shots resolved, 0..13
  lines: Record<PlayerId, PlayerLine>;
  leader: PlayerId | null;                     // null on a tie
  final: boolean;                              // landed === 13
  beat: { index: number; u: number } | null;   // shot in progress and seconds into its beat
  last: Shot | null;                           // most recent resolved shot
}
export interface BeatFrame {
  shooterOpacity: number;
  ball: { x: number; y: number; size: number; opacity: number } | null;  // centre, in feet
  shadow: { x: number; y: number; opacity: number } | null;
  pop: { x: number; y: number; text: string; opacity: number } | null;
  rim: { r: number; opacity: number } | null;
}
export const BRAND = "#FF6A00", INK = "#1A1A1A", TRAIL = "#4B5563";
export const PLAYERS: Record<PlayerId, { name: "Giuseppi" | "Johnny"; color: string }>;  // G brand, J ink
export const HOOP = { x: 0, y: 5.25 };
export const SHOTS: readonly Shot[];  // the spec's 13 rows, in order
export function zoneOf(x: number, y: number): Zone;
export function pointsOf(zone: Zone): 2 | 3;
export function landTime(index: number): number;  // START + index * BEAT + LAND
export function tally(landed: number): Record<PlayerId, PlayerLine>;
export function stateAt(t: number): GameState;
export function beatAt(shot: Shot, u: number): BeatFrame;
export function scoreColor(player: PlayerId, state: GameState): string;  // BRAND leader, TRAIL trailer, INK tie
// playback.ts
export interface Clock { t: number; lt: number | null }  // lt is null until the leaderboard beat starts
export interface FrameInput { dt: number; started: boolean; reduced: boolean; ladderVisible: number; cardVisible: number }
export function isFastForward(clock: Clock, input: FrameInput): boolean;
export function advance(clock: Clock, input: FrameInput): Clock;
// layout.ts
export type Layout = "split" | "medium" | "stack";
export function layoutFor(width: number, height: number): Layout;
export function useLayout(): Layout;  // from window.innerWidth and innerHeight, updated on resize
```

- [ ] **Step 1: Write the failing tests**

**`game.test.ts`:**
- `it.each` over the spec's shot table: `zoneOf(x, y)` and `pointsOf` match each row's Zone and Points.
- `tally(13)`: G `{ pts: 11, fgm: 5, fga: 7, tpm: 1, tpa: 2 }`, J `{ pts: 7, fgm: 3, fga: 6, tpm: 1, tpa: 3 }`.
- Beat boundaries:
  - `stateAt(0)` and `stateAt(START - 0.01)` have `landed` 0 and `beat` null.
  - `stateAt(START + 0.94).landed` is 0, and `stateAt(START + 0.95).landed` is 1.
  - `stateAt(START + 1.59).beat` is `{ index: 0 }`, and `stateAt(START + BEAT).beat` is `{ index: 1, u: 0 }`.
  - `stateAt(GAME)` has `final` true and `beat` null.
- `beatAt`:
  - At u = 0.1, `shooterOpacity` is 0.5.
  - At u = 0.6, there is a ball and a shadow.
  - At u = 0.95, a make has no ball, a pop with text "+2" (or "+3" for a three), and `rim.r` 0.75. A miss has its ball at `HOOP` with opacity 1 and no pop.
  - At u = 1.55, `shooterOpacity` is 0.
  - At u = 1.6, there is no ball and no pop.
- `scoreColor`:
  - At `stateAt(0)`, both players are INK.
  - After shot 1 lands, G is BRAND and J is TRAIL.
  - After shot 2, J is BRAND.
  - At `stateAt(GAME)`, G is BRAND and J is TRAIL.

**`playback.test.ts`** uses a helper `run(clock, input, seconds, fps = 60)` that steps `advance` with `dt = 1 / fps`:
- **Not started:** `t` stays 0 whatever `dt` is.
- **Rates:** `t` moves at 1x before `START` and at `RATE` after it. `t` holds at `GAME`.
- **Full game:** at 60 fps from `t = 0`, `t` reaches `GAME` between 17.80 s and 17.90 s.
- **Stalled frame** (Review Focus 1): `advance({ t: 5, lt: null }, { dt: 5, started: true, reduced: false, ladderVisible: 0, cardVisible: 1 })` gives `t = 5 + 0.05 * RATE`.
- **Fast-forward:**
  - With `ladderVisible: 0.6`, `cardVisible: 0.59` and `t < GAME`, it is on (x8).
  - It is off when `cardVisible` is 0.6.
  - It is off once `t` reaches `GAME`.
- **Landing mid-page** (Review Focus 4):
  - From `t = 0` with `ladderVisible: 0.7` and `cardVisible: 0`, `t` reaches `GAME` within 2.3 s, and `lt` then reaches `L_END` within 1.9 s more.
  - With both visibilities at 0, the game takes the normal 17.8 s.
- **Leaderboard beat:**
  - `lt` stays null until `ladderVisible >= 0.6` and `t >= GAME`.
  - It then advances at `RATE`, capped at `L_END`.
  - It keeps advancing, and never resets, after `ladderVisible` drops to 0.
- **Never rewinds:** over 2,000 frames with visibility inputs from a seeded sequence, `t` and `lt` never decrease.
- **Reduced motion:** gives `{ t: GAME, lt: L_END }` from any clock.

**`layout.test.ts`:**
- `it.each` over these sizes:
  - stack: 390×844, 466×678, 619×300;
  - split: 844×390, 890×626, 1180×820, 1440×900, 1000×800 (exactly 5/4), 1200×1600 (width 1200 or more);
  - medium: 626×890, 820×1180, 1024×1366, 999×800, 1199×1000.
- `useLayout` (with `renderHook`) changes from stack to split after `innerWidth`/`innerHeight` change to 844×390 and a `resize` event fires.

- [ ] **Step 2: Run `npm run test -- src/components/landing/game` and confirm it fails** because the modules don't exist.

- [ ] **Step 3: Implement.** Rules the signatures don't settle:
  - **`zoneOf`:** the spec's five rules, in order. Distances are from `HOOP`.
  - **`stateAt(t)`:**
    - `local = max(0, t - START)`, `k = min(13, floor(local / BEAT))`, `u = local - k * BEAT`.
    - `landed = t < START ? 0 : k + (k < 13 && u >= LAND ? 1 : 0)`.
    - `beat = t >= START && k < 13 ? { index: k, u } : null`.
  - **`beatAt(shot, u)`** (feet; `f` is local progress):
    - Shooter: `clamp01(u / 0.2) * (1 - clamp01((u - 1.25) / 0.3))`.
    - Flight, 0.25 <= u < 0.95:
      - `f = easeInOutQuad((u - 0.25) / 0.7)`;
      - ground point `g = lerp(spot, HOOP, f)`, `h = 4f(1 - f)`;
      - ball at `(g.x, g.y - 3h)`, size `1.5(1 + 0.9h)`;
      - shadow at `(g.x, g.y + 0.4)`, opacity `0.9 - 0.6h`.
    - Miss, 0.95 <= u < 1.3:
      - `f = (u - 0.95) / 0.35`, `dir = shot.x >= 0 ? -1 : 1`;
      - ball at `(HOOP.x + 3·dir·f, HOOP.y + 2.4f)`, size 1.5, opacity `1 - f`.
    - Make, u >= 0.95:
      - `f = clamp01((u - 0.95) / 0.5)`;
      - pop at `(x, y - 1.8 - 2f)`, opacity `1 - clamp01((u - 1.3) / 0.25)`;
      - rim `r = 0.75 + 2.6f`, opacity `1 - f`.
  - **`advance`:**
    - Under reduced motion, return `{ t: GAME, lt: L_END }`.
    - Otherwise:
      - `dt = min(dt, MAX_DT)`;
      - if started and `t < GAME`, `t += dt * (t < START ? 1 : RATE) * (ff ? FF : 1)`, capped at `GAME`;
      - then, if `lt` is null and `ladderVisible >= 0.6` and `t >= GAME`, `lt = 0`;
      - if `lt` is not null, `lt = min(L_END, lt + dt * RATE)`.
    - `ff = started && t < GAME && ladderVisible >= 0.6 && cardVisible < 0.6`.
  - **`layoutFor`:** `w < 620` is stack; `w / h >= 1.25 || w >= 1200` is split; anything else is medium.

- [ ] **Step 4: Run all four checks.** Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/landing/game
git commit -m "feat(web): 1v1 shot script, scoring, clock and layout rules"
```

---

### Task 4: The new hero, still

The hero shows the final state, with no motion yet. The old hero, the ball-zoom section and matter-js leave.

**Files:**
- Create in `src/components/landing/game/`: `FlipNumber.tsx`, `FlipNumber.test.tsx`, `HalfCourt.tsx`, `HalfCourt.test.tsx`, `LiveCard.tsx`, `LiveCard.test.tsx`
- Create: `src/components/landing/Hero.test.tsx`, `src/assets/game/uci-arc.webp`, `src/assets/game/ball.webp`
- Rewrite: `src/components/landing/Hero.tsx`
- Modify: `src/pages/Index.tsx` (drop `BallZoom`), `src/index.css` (flip styles; drop `glass-panel-dark` and `scanlines` once grep finds no users), `package.json` and `package-lock.json`, `src/test/siteCopy.test.ts` (drop Hero, BallZoom and AROverlay from `REPLACED_LATER`)
- Delete: `src/components/landing/BallZoom.tsx`, `src/components/landing/AROverlay.tsx`, and any asset only they or the old hero imported (grep `basketball.png` and `basketball-game.jpg` after the rewrite)

**Interfaces:**
- Consumes: Task 3 (`game.ts`, `timeline.ts`, `layout.ts`) and Task 2 (`VALUE_CHANGE`).
- Produces:

```ts
export function FlipNumber(props: { value: string; quick?: boolean; className?: string; style?: CSSProperties }): JSX.Element;
export function HalfCourt(props: { t: number }): JSX.Element;  // <svg aria-hidden="true">
export function formatCardDate(date: Date): string;            // "FRI, NOV 6"
export interface LiveCardProps {
  state: GameState; selected: PlayerId; onSelect: (p: PlayerId) => void;
  quick?: boolean; date?: Date;            // date defaults to today
  rootRef?: Ref<HTMLDivElement>;           // root has data-testid="live-card"
  mmrRef?: Ref<HTMLSpanElement>;           // the MMR chip's value
}
export function LiveCard(props: LiveCardProps): JSX.Element;
// Hero.tsx default export: Hero(props: { mmrRef?: Ref<HTMLSpanElement> })
```

- [ ] **Step 1: Write the failing tests**

**`FlipNumber.test.tsx`** (fake timers; `vi.mock("framer-motion")` keeps the real module but makes `useReducedMotion` a `vi.fn`):
- **First render:** "0" as plain text with no `.flip-half`.
- **Flip:** after a rerender to "2", there are 4 `.flip-half` layers; `.flip-out` reads "0" and `.flip-in` reads "2". After 440 ms, the text is "2" with no layers.
- **Quick:** with `quick`, it settles after 170 ms.
- **Overlapping changes** (Review Focus 3): "0" to "2", then 100 ms later "2" to "5". `.flip-out` reads "2" and `.flip-in` reads "5"; after 440 ms the text is exactly "5" with no layers.
- **Reduced motion:** a change never creates layers.

**`HalfCourt.test.tsx`:**
- The root is aria-hidden.
- At `GAME`: 8 `[data-mark="make"]`, 5 `[data-mark="miss"]` and 8 `[data-heat]`.
- At `START + 0.94` there are no marks; at `START + 0.95` there is 1.
- At `START + 0.6` the ball `<image>` is present.
- Every court line has `pathLength="1"`.

**`LiveCard.test.tsx`** (date `new Date(2026, 10, 6)`):
- `formatCardDate` gives `"FRI, NOV 6"`.
- At `stateAt(0)`:
  - the pill reads `LIVE · FRI, NOV 6`;
  - the scores are 0 and 0;
  - the caption reads `Tip-off`;
  - MMR shows `··`;
  - both Win tags exist in the DOM with `visibility: hidden`.
- After shot 9 lands (`stateAt(landTime(8))`), with Giuseppi selected:
  - the caption reads `Giuseppi · Corner 3 · Made`, with "Made" in a `text-brand` element;
  - the chips read FG `4/5`, 3PT `1/2`, FG% `80`;
  - the scores are 9 and 7.
- At `stateAt(GAME)`:
  - the pill reads `FINAL · FRI, NOV 6`;
  - the caption reads `Final 11-7 · Giuseppi wins`;
  - Giuseppi's Win tag is visible;
  - MMR shows `+14` (`#00A57C`), or `-12` when Johnny is selected, whose chips read FG `3/6`, 3PT `1/3`, FG% `50`;
  - Giuseppi's score color is `BRAND` and Johnny's is `TRAIL`.
- **Buttons:** two buttons carry `aria-pressed` matching `selected`, and clicking Johnny calls `onSelect("J")`.

**`Hero.test.tsx`:**
- The h1 reads exactly "Talent doesn't wait for a camera crew."
- The body reads exactly "Clutch turns a phone in a courtside corner into a professional-grade analytics rig, built for the leagues that aren't on TV."
- The visually hidden summary "Example 1v1 game at the UCI Anteater Recreation Center: Giuseppi wins 11 to 7." is present.
- The court is aria-hidden, and the GIUSEPPI button is pressed.
- There is no "BASKETBALL · VOL. I" or "IRVINE" text.

- [ ] **Step 2: Run `npm run test` and confirm the new tests fail.**

- [ ] **Step 3: Make the assets**

```bash
mkdir -p src/assets/game
cwebp -q 78 -resize 1200 0 ~/Downloads/uci_arc.jpg -o src/assets/game/uci-arc.webp
cwebp -q 85 -resize 96 0 src/assets/basketball.png -o src/assets/game/ball.webp
```

- [ ] **Step 4: Implement**
  - **`FlipNumber`:**
    - **Layers:** on a change, it renders an invisible sizer with the new value, plus four `.flip-half` layers:
      - new top and old bottom, still;
      - `.flip-out` (old top, moving) and `.flip-in` (new bottom, moving).
    - **Settling:** it settles to plain text after 440 ms (170 ms when `quick`). A change mid-flip restarts the flip from the last value.
    - **CSS** in `index.css`, as in the spec's "Flip-card change":
      - `.flip-num` is `perspective: 240px`, 1em tall;
      - halves have a white background and `backface-visibility: hidden`;
      - `.flip-out` is `rotateX(0 -> 90deg)` over 0.18 s with `cubic-bezier(.55, 0, 1, .45)`;
      - `.flip-in` is `rotateX(-90deg -> 0)` over 0.26 s with `cubic-bezier(.16, 1, .3, 1)` after 0.18 s;
      - `.quick` is 0.07 s and 0.1 s;
      - guard it with `prefers-reduced-motion`.
    - The sketch's `.app .num` rules are a working version.
  - **`HalfCourt`:**
    - Draw the spec's "Half court" geometry, plus heat and marks from `stateAt(t)`. The radius, gradient stops, opacities and mark sizes are in the spec's "Heat and marks".
    - Heat opacity is `clamp01((t - landTime(i)) / 0.6)`.
    - Draw the current beat from `beatAt`.
    - Marks carry `data-mark`, and heat circles carry `data-heat`.
  - **`LiveCard`:** follow the spec's "Live card" and the sketch's `.app` markup.
    - Every row has a fixed height.
    - Win tags toggle `visibility`.
    - The selected player gets a 2 px orange underline.
    - Score colors come from `scoreColor`, with a `VALUE_CHANGE` transition.
    - Scores render through `FlipNumber`.
  - **`Hero`:**
    - **Layout:** `const layout = useLayout()` sets `data-layout` on the section root. The root is capped at 1280 px with `container-type: inline-size`, and type and spacing are sized in `cqw`. Port the sketch's `[data-layout=...]` rules, which follow the spec's layout table.
      - Split uses `min-height: calc(100svh - <navbar height>)` and no `aspect-ratio`.
      - The headline uses `text-wrap: balance` in every layout.
    - **Still state:** render `HalfCourt t={GAME}` and `LiveCard state={stateAt(GAME)}`, with `selected` in local state defaulting to `"G"`. Add the key "● Giuseppi ● Johnny" and the visually hidden summary.
    - **Removed:** `FrameMount`, `OvrBadge`, `RecCenterLeaderboard`, the court drawing and the Matter.js code.
  - `Index.tsx`: remove `BallZoom`.
  - **Cleanup:**
    - Delete `BallZoom.tsx` and `AROverlay.tsx`.
    - Run `npm uninstall matter-js @types/matter-js`.
    - Grep, then drop the styles and assets that the deleted files were the last users of (expected: `glass-panel-dark`, `scanlines`, `basketball.png`, `basketball-game.jpg`). Leave alone anything that was already unused before this task.

- [ ] **Step 5: Run all four checks.** Expected: PASS. The main JS bundle is smaller than 611.59 kB.

- [ ] **Step 6: Browser check** at every size in the list.
  - The layout matches the spec's table.
  - No horizontal overflow and no console errors.
  - The headline wraps with no lone word.
  - At 320×568, card text is not clipped (the caption may ellipsize).
  - The card's bounding box is identical with Giuseppi and with Johnny selected.
  - Features follows the hero directly.

- [ ] **Step 7: Commit**

```bash
git add -A src/components/landing src/assets src/pages/Index.tsx src/index.css src/test package.json package-lock.json
git commit -m "feat(web): half-court hero with live card; remove ball zoom and matter-js"
```

---

### Task 5: Playback and entrance

The hero plays, and the loader goes.

**Files:**
- Create: `src/lib/entrance.ts`, `src/lib/entrance.test.ts`, `src/components/landing/game/PlaybackProvider.tsx`, `src/components/landing/game/PlaybackProvider.test.tsx`
- Modify: `src/components/landing/Hero.tsx`, `src/components/landing/Hero.test.tsx`, `src/components/landing/Navbar.tsx`, `src/pages/Index.tsx`, `tailwind.config.ts` (drop `obsidian` and `obsidianAlt` once grep finds no users), `src/index.css` (the stale "Mode-flip system" header comment), `src/test/siteCopy.test.ts` (remove `REPLACED_LATER`)
- Delete: `src/components/landing/Loader.tsx`

**Interfaces:**
- Consumes: `advance`, `isFastForward`, `GAME`, `L_ARRIVE` (Task 3); `ENTRANCE`, `RISE`, `DRAW`, `FADE` (Task 2); `SplitText` `play` and `delay` (Task 2).
- Produces:

```ts
// src/lib/entrance.ts
export function entranceStart(timeoutMs?: number): Promise<void>;  // document.fonts.ready or timeoutMs (default 500), whichever is first
export function useEntranceStart(): boolean;                        // remembered per page load, so remounts don't wait again
// PlaybackProvider.tsx
export interface Playback {
  t: number; lt: number | null; ff: boolean; reduced: boolean; started: boolean;
  watchCard: (el: HTMLElement | null) => void;    // ref callback; feeds cardVisible
  watchLadder: (el: HTMLElement | null) => void;  // ref callback; feeds ladderVisible
}
export const PlaybackContext: React.Context<Playback | null>;
export function PlaybackProvider(props: { children: ReactNode }): JSX.Element;
export function usePlayback(): Playback;  // throws outside the provider
// Navbar gains: animateIn?: boolean (default false; only Index passes it)
```

- [ ] **Step 1: Write the failing tests**

**`entrance.test.ts`** (fake timers):
- With no `document.fonts`, the promise resolves at 500 ms and not at 499.
- When `fonts.ready` resolves at 100 ms, it resolves at 100 ms.
- When `fonts.ready` never resolves, it resolves at 500 ms.

**`PlaybackProvider.test.tsx`:**
- **Setup:**
  - fake timers including `requestAnimationFrame`, `cancelAnimationFrame` and `performance`;
  - `vi.mock("@/lib/entrance")` so `useEntranceStart` returns true;
  - a consumer prints `t` and `lt`.
- **Final state:** after 18 s, `t` is `GAME` and `lt` is null.
- **Reduced motion:** `t` is `GAME` and `lt` is `L_END` on the first render.
- **Unmount:** no rAF callbacks run after it.

**`Hero.test.tsx`** (rendered inside `PlaybackProvider`):
- **Rotation** (Review Focus 2):
  - Start at 390×844 and advance 6 s; the score is above 0.
  - Change to 844×390 and fire `resize`.
  - `data-layout` changes from stack to split, `getByTestId("live-card")` is the same node, and the score is unchanged.
  - 13 s later, the pill reads FINAL.
- **Waits for the entrance:** with `useEntranceStart` returning false, scores stay 0 after 5 s.

- [ ] **Step 2: Run `npm run test` and confirm the new tests fail.**

- [ ] **Step 3: Implement**
  - **`PlaybackProvider`:**
    - On each rAF, `dt` comes from rAF timestamps and the clock steps with `advance`.
    - It calls `setState` only when `t`, `lt` or `ff` changed.
    - An IntersectionObserver with thresholds `[0, 0.1, 0.5, 0.6]` records `intersectionRatio` (0 when not intersecting) for the watched card and ladder.
    - `reduced` comes from framer's `useReducedMotion()`.
    - Hidden tabs get no rAF, so the game pauses, and `MAX_DT` stops a jump on return.
  - **`Hero`:**
    - It reads `usePlayback()`: `HalfCourt t={t}` and `LiveCard state={stateAt(t)} quick={ff} rootRef={watchCard}`.
    - **Entrance**, run from `started` at the `ENTRANCE` times:
      - the headline is `SplitText as="h1" whileInView={false} play={started} delay={ENTRANCE.headline}`;
      - court lines draw `pathLength` from 0 to 1 with `DRAW`;
      - body and card rise with `RISE`;
      - court fill, hoop and key fade with `FADE`.
    - Under reduced motion, every entrance element starts final (`initial={false}`).
  - **`Navbar`:** with `animateIn`, it fades and drops 8 px over 0.4 s once `useEntranceStart()` is true. Without it, nothing changes, so `/contact` is unaffected.
  - **`Index`:**
    - Remove the loader state, `AnimatePresence` and `Loader`.
    - Render `<Navbar animateIn />` and `<PlaybackProvider><Hero /></PlaybackProvider>`.
  - **Cleanup:**
    - Delete `Loader.tsx`.
    - Drop the `obsidian` tokens once they are unused.
    - Remove `REPLACED_LATER`.
    - Rewrite the stale `index.css` header comment as one line about the paper palette.

- [ ] **Step 4: Run all four checks.** Expected: PASS.

- [ ] **Step 5: Browser check** at every size in the list.
  - **Screenshots:** the entrance at 100 ms and 1.3 s, mid-shot, after a make, and the final state.
  - **Card size:** paste this in the console on load, once as is and once after clicking JOHNNY. It must return exactly one size.

```js
await new Promise((r) => { const c = document.querySelector('[data-testid="live-card"]'), s = new Set();
  const id = setInterval(() => { const b = c.getBoundingClientRect(); s.add(`${b.width.toFixed(1)}x${b.height.toFixed(1)}`); }, 100);
  setTimeout(() => { clearInterval(id); r([...s]); }, 19000); });
```

  - **Timing:** the pill turns FINAL 17.0 to 17.6 s after the entrance starts (the last make lands at 1.2 + 12 × 1.28 + 0.95 / 1.25 = 17.32 s).
  - **Flip frames:** pause every animation through the Web Animations API (`document.getAnimations()`, set `currentTime`) at 90, 175, 260 and 470 ms. The frames show the old number folding, then the new top over the old bottom, then a clean new number.
  - **Performance panel:** frames stay under 16 ms during the game.
  - **Reduced motion:** the final chart and card appear at once.

- [ ] **Step 6: Commit**

```bash
git add -A src/lib src/components/landing src/pages/Index.tsx tailwind.config.ts src/index.css src/test
git commit -m "feat(web): play the 1v1 once after a short entrance; remove the loader"
```

---

### Task 6: Leaderboard beat

**Files:**
- Create in `src/components/landing/game/`: `ladder.ts`, `ladder.test.ts`, `LadderCard.tsx`, `LadderCard.test.tsx`, `MmrToken.tsx`
- Create: `src/components/landing/Leaderboard.tsx`, `src/components/landing/GameStage.tsx`, `src/components/landing/GameStage.test.tsx`, `src/assets/ladder/{johnny,giuseppi,andrew,dylan}.webp`
- Modify: `src/pages/Index.tsx` (`<GameStage />` replaces the provider and Hero), `src/components/landing/Hero.tsx` (forces Giuseppi's chips during the flight)

**Interfaces:**
- Consumes: `usePlayback`, `watchLadder` (Task 5); `L_ARRIVE`, `L_REORDER`, `L_END` (Task 3); `easeInOutCubic`, `easeOutQuart`, `clamp01`, `lerp`, `riseVariants` (Task 2); `useLayout` (Task 3); `Hero` `mmrRef` (Task 4).
- Produces:

```ts
// ladder.ts
export type LadderId = "G" | "J" | "A" | "D";
export interface LadderPlayer { id: LadderId; name: string; photo: string;
  before: { mmr: number; record: string }; after?: { mmr: number; record: string; delta: "+14" | "-12" } }
export const LADDER: readonly LadderPlayer[];          // the spec's Data table
export const BEFORE: readonly LadderId[];              // ["J", "G", "A", "D"]
export const AFTER: readonly LadderId[];               // ["G", "J", "A", "D"]
export interface LadderRow { id: LadderId; rank: number; slot: number; mmr: number; record: string; delta: string | null; me: boolean }
export interface Point { x: number; y: number }
export interface TokenFrame { x: number; y: number; scale: number; opacity: number }
export function ladderAt(T: number): LadderRow[];      // in LADDER order (stable DOM); slot drives translateY
export function tokenAt(T: number, from: Point, to: Point): TokenFrame | null;
// LadderCard.tsx
export function LadderCard(props: { T: number; mmrRef?: Ref<HTMLSpanElement>; rootRef?: Ref<HTMLDivElement> }): JSX.Element;  // data-testid="ladder-card"
// Leaderboard.tsx default export: Leaderboard(props: { mmrRef?: Ref<HTMLSpanElement> })
// MmrToken.tsx
export function MmrToken(props: { stageRef: RefObject<HTMLElement>; fromRef: RefObject<HTMLElement>; toRef: RefObject<HTMLElement> }): JSX.Element | null;
// GameStage.tsx default export: GameStage()
```

- [ ] **Step 1: Write the failing tests**

**`ladder.test.ts`:**
- **T = 0:** ranks are J1, G2, A3, D4, with MMR 1296, 1287, 1251, 1218 and records 21-8, 23-9, 18-10, 15-11. Slots are 0 to 3 and no deltas show.
- **Counting**, at `T = L_ARRIVE + 0.2`: G's MMR is strictly between 1287 and 1301, and J's strictly between 1284 and 1296.
- **Arrived**, at `T = L_ARRIVE + 0.4`:
  - G shows 1301, `24-9`, `+14`;
  - J shows 1284, `21-9`, `-12`;
  - A and D are unchanged with a null delta.
- **Rank swap**, at halfway, `T = L_REORDER + 0.7 * (1 - 0.5 ** 0.25)`:
  - 0.001 s before it, G is rank 2;
  - 0.001 s after it, G is rank 1 with `me` true.
- **End:** at `L_END`, G's slot is 0 and J's is 1.
- **Andrew and Dylan** keep slots 2 and 3 for every T from 0 to 2.3.
- **`tokenAt`:**
  - It is null at T = 0 and at T = 1.3.
  - It equals `from` at T = 0.15 and `to` at T = 1.05.
  - At T = 0.6, with `from (0,0)` and `to (300,400)`, it is at `(225, 100)` (control `(to.x, from.y)`).
  - At T = 0.6, with `from (100,0)` and `to (120,400)`, it is at `(150, 200)` (control `(from.x + 90, mid y)`).

**`LadderCard.test.tsx`:**
- It shows the scope labels Friends, Court and City, with Court marked active (spans, not buttons).
- It shows "Court · 1V1" and "UCI Anteater Recreation Center".
- It has 4 rows with `alt=""` photos.
- At T = 0, every row has a delta cell in the DOM.
- At `L_END`, Giuseppi's row reads rank 1, `1301` and `+14`.

**`GameStage.test.tsx`** (fake timers, entrance mocked to start, the IO stub driving visibility):
- **Waits for the reader:** after 18 s with the ladder at 0, the card reads FINAL and the ladder still has Johnny at #1.
- **Plays and never rewinds:**
  - `setIntersection(ladderCard, 0.6)`; 2 s later Giuseppi is #1 with 1301.
  - Set it to 0 and then back to 0.6; nothing changes.
- **Fast-forward:**
  - On a fresh render, advance 3 s.
  - Then call `setIntersection(ladderCard, 0.7)` and `setIntersection(liveCard, 0)`.
  - Within 3 s the card reads FINAL, and 2 s after that Giuseppi is #1.
- **Chips during the flight:**
  - Click JOHNNY before the beat.
  - While `lt` is between 0 and 1.3, GIUSEPPI is pressed.
  - After the beat, clicking JOHNNY presses it again.

- [ ] **Step 2: Run `npm run test` and confirm the new tests fail.**

- [ ] **Step 3: Make the photos (96×96, about 2x their display size)**

```bash
mkdir -p src/assets/ladder && T=$(mktemp -d)
sips -s format png -z 96 96 public/johnnyf.webp --out "$T/johnny.png"
sips -s format png -z 96 96 public/giuseppip.png --out "$T/giuseppi.png"
sips -s format png -z 96 96 public/andrewe.png --out "$T/andrew.png"
sips -c 2905 2905 public/dylann.jpg --out "$T/dylan-sq.jpg" && sips -s format png -z 96 96 "$T/dylan-sq.jpg" --out "$T/dylan.png"
for n in johnny giuseppi andrew dylan; do cwebp -q 82 "$T/$n.png" -o "src/assets/ladder/$n.webp"; done
```

- [ ] **Step 4: Implement**
  - **`ladderAt(T)`:**
    - `arrived = T >= L_ARRIVE`;
    - `f = clamp01((T - L_ARRIVE) / 0.4)`;
    - `m = easeOutQuart(clamp01((T - L_REORDER) / 0.7))`;
    - `slot = lerp(BEFORE.indexOf(id), AFTER.indexOf(id), m)`;
    - `rank = (m >= 0.5 ? AFTER : BEFORE).indexOf(id) + 1`;
    - MMR counts `round(lerp(before, after, f))` once arrived; the record and delta switch on arrival;
    - `me = id === "G" && m >= 0.5`.
  - **`tokenAt`:**
    - It is null when `T <= 0 || T >= L_ARRIVE + 0.25`.
    - `u = easeInOutCubic(clamp01((T - 0.15) / (L_ARRIVE - 0.15)))`.
    - The control point is `(to.x, from.y)` when `|to.x - from.x| > 80`, otherwise `(from.x + 90, (from.y + to.y) / 2)`. The token moves on a quadratic Bezier.
    - `appear = clamp01(T / 0.15)`, `leave = clamp01((T - L_ARRIVE) / 0.25)`.
    - `opacity = appear * (1 - leave)`.
    - `scale = (0.8 + 0.2 * appear) * (1 + 0.12 * sin(PI * u)) * (1 - 0.4 * leave)`.
  - **`LadderCard`:**
    - It follows the spec's "Leaderboard card" and the sketch's `.lb-*` markup, with the live card's container style.
    - Rows sit in a fixed-height list and move by `translateY(calc(var(--slot) * 100%))`, set from `slot`.
    - Giuseppi's row gets an 8% brand tint and an orange name when `me` is true.
  - **`Leaderboard`:**
    - The copy is "Every win climbs your court's ladder." and "MMR updates the moment a game ends, and your court's leaderboard re-ranks."
    - **Layout:** split is like the hero (copy left), medium is 40/60, and stack puts the copy on top.
    - **Reveal:** it rises in with `riseVariants` once 10% visible (`viewport={{ once: true, amount: 0.1 }}`).
    - **Wiring:** `LadderCard T={lt ?? 0} rootRef={watchLadder} mmrRef={mmrRef}`.
  - **`MmrToken`:** each render, it measures the centres of `fromRef` and `toRef` relative to `stageRef` (`getBoundingClientRect`), then draws `tokenAt(lt, from, to)`.
    - It is a white pill, aria-hidden, with green Geist Mono "+14" and a soft shadow.
    - It renders nothing when `tokenAt` is null, which includes reduced motion.
  - **`GameStage`:** `<PlaybackProvider>` around a `relative` div (`stageRef`) holding `<Hero mmrRef={fromRef} />`, `<Leaderboard mmrRef={toRef} />` and `<MmrToken ... />`.
  - **`Hero`:** while `lt !== null && lt > 0 && lt < L_ARRIVE + 0.25`, `selected` is set to `"G"`.

- [ ] **Step 5: Run all four checks.** Expected: PASS.

- [ ] **Step 6: Browser check** at every size in the list.
  - The leaderboard ends with Giuseppi at #1 with 1301.
  - Scrolling to it mid-game fast-forwards the rest of the game in under 3 s.
  - Scrolling up and back never resets or rewinds anything.
  - On tall screens (1024×1366), the game plays at normal speed and the beat follows.
  - The token goes across then down on wide layouts, and swings to the side on stack.
  - Reduced motion shows the final ranking with no token.

- [ ] **Step 7: Commit**

```bash
git add -A src/components/landing src/assets/ladder src/pages/Index.tsx
git commit -m "feat(web): court leaderboard that re-ranks when the 1v1 ends"
```

---

### Task 7: Docs, brain note and release check

**Files:**
- Modify: `CLAUDE.md` (the `components/landing/` line in the directory layout; add `game/` and `src/lib/motion.ts`)
- Modify (brain repo): `../brain/products/web/overview.md`

- [ ] **Step 1: Full pass on the `revamp` Preview deploy**, at every size in the list, with and without reduced motion. Work through the spec's "Verification" list item by item, and record each result in the release PR body.
- [ ] **Step 2: Bundle check.** Record the main JS size from `npm run build`. It must be below 611.59 kB.
- [ ] **Step 3: Update `CLAUDE.md`** so the layout matches the tree, with no BallZoom or Loader.
- [ ] **Step 4: Brain note.** In `../brain/products/web/overview.md`:
  - **Pages row for `/`:** hero 1v1, leaderboard, features, how it works, pull quote, beta form, footer.
  - **Hero claim:** who shot, make or miss, 2 or 3, shot spots, live card and MMR change, backed by [[products/casual/overview]] and [[products/casual/rating-system]].
  - **Leaderboard:** add a row for the court ladder that re-ranks after a game ([[products/casual/rating-system]]).
  - **Calls to action:** the nav's Coming soon now links to the beta form.
  - **Illustrative numbers:** the 1v1 and the ladder are illustrative.
  - Add a pointer to `clutch_web/src/lib/motion.ts`, and set `updated: 2026-11-06`.
  - Commit on a brain branch and open a brain PR.
- [ ] **Step 5: Release PR.** Put the verification results in the draft PR from `revamp` to `main` and mark it ready for review. Then stop: merge only after giuseppi says "yes, deploy".
