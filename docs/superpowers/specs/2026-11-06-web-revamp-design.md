# Clutch web revamp: half-court hero, entrance, one type system

Date: 2026-11-06. Owner: giuseppi. Status: ready for approval. Every open question was answered on 2026-11-06 (see "Answered questions").
Visual reference: the Lavish sketch at `clutch_web/.lavish/revamp/index.html` (local only, gitignored). It runs the hero described here, including the entrance, the shot script, and the card.

## Why

The landing page feels dated and clunky in three places:
- A 2.3 s black loading screen.
- A 300vh black "ball zoom" section in a different palette, with readouts no product note backs.
- Three font families mixed with italics.

The hero's physics ball is playful, but it shows nothing Clutch measures. The revamp makes the page smoother and cleaner, and makes the hero show what Clutch actually does: track a 1v1, shot by shot, into stats.

## Goals

- The hero shows a 1v1 on a half court. Shots land as makes or misses, makes heat up the court, and a live card updates both players.
- No loading screen. The page is readable from the first frame, with one short entrance.
- One type family, Geist, with Geist Mono for numbers.
- One motion standard for the whole site, taken from this hero.
- Features follows the hero directly (100vh before Features instead of 400vh).

## Non-goals

- How It Works keeps its pinned rail (`HowItWorksRail.tsx`, 320vh). Its fonts and reveal timing change, plus the demo-loop rules under "Motion standard".
- The contact page, the unrouted portal, `server/`, `worker/`, and the OG image are out of scope. The contact page still picks up the new fonts.
- Copy rewrites beyond removing em dashes.

## Anti-goals (a failure even if it works)

- Any full-screen black or dark surface.
- Pinning or scroll-jacking in the hero.
- The live card changing size as numbers change.
- Claims beyond Casual features (who shot, make or miss, 2 or 3, shot spots, MMR change).
- Italics, or a second type family.

## Decisions (giuseppi, 2026-11-06)

1. **Hero animation:**
   - A scripted 1v1 on a half court, not physics.
   - The court sits on one side; the headline, body and live card sit on the other.
2. **Heatmap:** the round 1 style. Each make adds a soft glow at its spot, orange for one player and ink for the other.
3. **Live card:**
   - It follows the Clutch app's Recap card and Match Details score block, in the site's fonts.
   - It keeps a constant size.
   - The UCI ARC photo fills its top third. The title is "1v1 @ UCI Anteater Recreation Center".
   - No CV Verified badge and no middle status badge; the Live pill sits top left.
   - The leading player's score is orange and updates on every score.
4. **Loading screen:** removed and replaced by entrance animations.
5. **Type:** Geist + Geist Mono everywhere, including the card. The site deliberately does not use the app's fonts (General Sans and Sentient).
6. **Playback:** autoplay once after the entrance, then hold the final chart.
7. **Motion standard:** this hero's animation is the standard for the website.
8. **Cleanups C1 to C6:** all included (see Removals).
9. **No eyebrow lines** in the hero ("BASKETBALL · VOL. I", "EST. 2026 · IRVINE, CA").
10. **Key:** the court key shows only the two players. No "Filled: make · Ring: miss" text (round 5).
11. **Devices:** the hero must work on phones, tablets and iPhone Duo (round 5). See "Hero layout".
12. **First names only,** everywhere on the site: Giuseppi and Johnny on the card, key and captions (round 6). The live card's player labels read "GIUSEPPI" and "JOHNNY".
13. **Leaderboard beat:** in. It plays on its own; it is not tied to scroll (round 8, after trying a scroll-tied version in rounds 6 and 7). Scrolling up never rewinds anything (round 7). See "Leaderboard beat".
14. **Release:** one release. Build steps merge into a `revamp` branch; one merge to `main` ships it (round 7).
15. **ARC photo:** cleared to publish (round 7).
16. **Speed:** the hero game and the leaderboard play 1.25x faster than the timings in this doc (round 8). The entrance keeps its speed (the motion standard).
17. **Flip-card score:** each score change on the live card flips like a split-flap card (round 8).

## Type system

- **Font loading:** `index.html` loads Geist (400, 500, 600) and Geist Mono (400, 500). It no longer loads Inter, Inter Tight or JetBrains Mono.
  - *My call:* drop Material Symbols too. Only the unrouted portal uses it, and it gets re-added when the portal is routed again.
- **Tailwind families:** in `tailwind.config.ts`, `sans` and `display` are Geist and `mono` is Geist Mono.
- **Headings:** Geist 600 with tight tracking (about -0.04em at hero size), one weight for all headings.
- **Emphasis:** no italics anywhere; emphasis is brand orange (`text-brand`). Italics are in use today at:
  - `FeaturesPolaroidGrid.tsx:46,77`
  - `FooterCTA.tsx:66`
  - `HowItWorksRail.tsx:70,113`
  - `PullQuote.tsx:22`
- **Labels:** a new `label` utility (Geist 500, uppercase, 0.08em tracking, 0.75rem) replaces `label-mono` everywhere except data.
- **Mono:** Geist Mono with tabular figures, for numbers and data only (scores, stats, MMR).

## Motion standard

Put the values in one module (for example `src/lib/motion.ts`) and use them everywhere:

| Use | Value |
|---|---|
| Things arriving | rise 14 px plus fade, 0.7 s, `cubic-bezier(.16, 1, .3, 1)` |
| Stagger inside a group | 55 ms |
| Lines drawing in | 0.9 s, `cubic-bezier(.65, 0, .35, 1)` (stroke-dashoffset with `pathLength="1"`) |
| Plain fades | 0.5 to 0.6 s |
| Value changes (score color) | 0.4 s |

- Nothing decorative loops. Live indicators (the Live pill's dot) may.
- *My call:* product demos may loop while on screen: the `RotatingGlobe` in Features 04 (`FeaturesPolaroidGrid.tsx:228`) and the How It Works step 3 clip.
  - They pause when off screen. The globe currently uses `useInView({ once: true })` and updates React state every frame forever.
  - Under reduced motion, they show a still frame.
  - The clip is `public/clutch.gif` today (16.6 MB, about 230 frames). It becomes a short muted, looping MP4/WebM with a poster image.
- Reduced motion shows the end state with no movement. Use `MotionConfig reducedMotion="user"` for framer-motion, and guard any CSS animation with `prefers-reduced-motion`.
  - *My call:* Lenis smooth scrolling is off under reduced motion. The How It Works rail stays tied to scroll, since it only moves as fast as the reader scrolls.
- The existing scroll-in reveals use these values too. They live in `FeaturesPolaroidGrid`, `HowItWorksRail`, `PullQuote`, `FooterCTA` and `SplitText`.

## Entrance (replaces `Loader.tsx`)

Start once fonts are ready, or after 500 ms at the latest, so headline words do not reflow mid-animation. Times are from that start:

| Element | Starts | Motion |
|---|---|---|
| Navbar | 0 s | fade and drop, 0.4 s |
| Headline words | 0.08 s | rise, 55 ms apart |
| Court lines | 0.25 s | draw in |
| Body copy | 0.45 s | rise |
| Live card | 0.6 s | rise |
| Court fill and hoop | 0.7 s | fade |
| Court key | 1.0 s | fade |
| First shot | 1.2 s | shot beat begins |

## Hero layout

- **No pinning.** The fixed navbar's height is respected at the top. Content is capped at 1280 px wide and centered; type and spacing scale with the content width (the sketch uses container units on that 1280 px box).
- **Three layouts** (*my call*, round 5), chosen by viewport width and shape:

  | Layout | When | Arrangement | Height |
  |---|---|---|---|
  | Split | width ≥ 620 px and (width/height ≥ 5/4 or width ≥ 1200 px) | Two columns, about 44/56. Left: headline, body, live card. Right: half court with the key below. | At least 100svh minus the navbar, content centered. Use `min-height` without `aspect-ratio`; together they widen the box. |
  | Medium | 620 px ≤ width < 1200 px and width/height < 5/4 | Headline and body across the top. Below: court (52) and card (48) side by side, card centered on the court. | Content height, so the next section shows below. |
  | Stack | width < 620 px | Headline, body, court, key, then card. | Content height. |

  As a media query, medium is `(min-width: 620px) and (max-width: 1199px) and (max-aspect-ratio: 5/4)`.
- **Which devices get which:** split covers desktop, iPad landscape, iPhone Duo open in landscape and phones in landscape. Medium covers iPad portrait, iPad Pro 13 portrait and iPhone Duo open in portrait. Stack covers phones and iPhone Duo folded.
- **Headline:** balanced wrapping everywhere, so no word sits alone on a line.
- **Body copy:** today's copy, word for word, with its em dash replaced by a comma: "Clutch turns a phone in a courtside corner into a professional-grade analytics rig, built for the leagues that aren't on TV." (*My call:* the builder asked because the sketch had dropped "professional-grade".)
- **Removed from the hero:**
  - the eyebrow lines
  - the Matter.js ball
  - the skewed green court drawing
  - `FrameMount`, `OvrBadge` and `RecCenterLeaderboard`

## Half court

- **SVG:** in feet, `viewBox="-26.5 -1.5 53 50"`, baseline at the top, hoop centre at (0, 5.25).
- **Lines:** rgba(26,26,26,.38) at 0.16 ft wide (the outline is 0.24 ft). Each line has `pathLength="1"` so it can draw in.
  - Boundary: 50 × 47.
  - Lane: 16 wide × 19 deep, tinted rgba(26,26,26,.045).
  - Free-throw circle: radius 6 at (0, 19).
  - Three-point line: corners at x = ±22 from y = 0 to 14.2, joined by an arc of radius 23.75 around the hoop.
  - Half-court circle: radius 6 at (0, 47).
- **Colors:** court fill `#E9E5D8` (paperAlt). Backboard: ink, y = 4, x from -3 to 3. Rim: brand orange, radius 0.75.

## Shot script and scoring

Thirteen shots, fixed. Both players' names come from today's ladder; every number is illustrative.

| # | Player | x | y | Result | Zone | Points |
|---|---|---|---|---|---|---|
| 1 | Giuseppi | -8 | 14 | made | Mid-Range | 2 |
| 2 | Johnny | 22.5 | 6 | made | Corner 3 | 3 |
| 3 | Giuseppi | 0 | 30 | missed | Above Break 3 | 3 |
| 4 | Johnny | 12 | 20 | made | Mid-Range | 2 |
| 5 | Giuseppi | -4 | 9 | made | Paint | 2 |
| 6 | Johnny | -17 | 22 | missed | Above Break 3 | 3 |
| 7 | Giuseppi | 16 | 22 | made | Mid-Range | 2 |
| 8 | Johnny | 3 | 11 | made | Paint | 2 |
| 9 | Giuseppi | -22.5 | 8 | made | Corner 3 | 3 |
| 10 | Johnny | -10 | 16 | missed | Mid-Range | 2 |
| 11 | Giuseppi | 5 | 7 | missed | Paint | 2 |
| 12 | Johnny | 18 | 25 | missed | Above Break 3 | 3 |
| 13 | Giuseppi | -2 | 21 | made | Free Throw | 2 |

- **Zone rules:** evaluated in this order, the first match wins. The zone names match the app's `ZONE_DISPLAY_NAMES` (`clutch/mobile/components/charts/chartUtils.ts`).
  1. Corner 3 if y < 14.2 and |x| ≥ 22.
  2. Above Break 3 if the distance from the hoop is over 23.75.
  3. Paint if |x| < 8 and y < 19.
  4. Free Throw if y ≥ 19 and the distance from (0, 19) is under 6.
  5. Otherwise Mid-Range.
- **Points:** 3 for the two three-point zones, else 2.
- **Final:** Giuseppi 11 (FG 5/7, 3PT 1/2), Johnny 7 (FG 3/6, 3PT 1/3). Tests assert these totals.

## Shot beat (1.6 s per shot at design speed)

The timings below are design units. Playback runs at 1.25x, so a beat lasts 1.28 s and the 13 shots take about 16.6 s after the first shot at 1.2 s.


- **0 to 0.2 s:** a shooter marker fades in at the spot. It is a paper circle with a ring and initial in the player's color.
- **0.25 to 0.95 s:** the ball (`basketball.png`) travels to the rim on a quadratic ease-in-out.
  - Height is faked: the ball scales up to 1.9× and lifts 3 ft at the apex.
  - A ground shadow stays on the straight line.
- **At 0.95 s, a make:**
  - A filled mark lands at the spot.
  - A heat glow fades in over 0.6 s.
  - A "+2" or "+3" pop (Geist Mono, brand orange) rises 2 ft and fades out by about 1.55 s.
  - A rim pulse grows from radius 0.75 to 3.35 over 0.5 s.
  - The card updates.
- **At 0.95 s, a miss:**
  - The ball deflects 3 ft toward the far side and 2.4 ft down, fading out by 1.3 s.
  - A ring mark lands at the spot.
  - The card updates.
- **1.25 to 1.55 s:** the shooter marker fades out.

## Heat and marks

- **Heat:** each make adds a circle of radius 5.5 ft with a radial gradient. The heat layer uses `mix-blend-mode: multiply` and is clipped to the court.
  - Giuseppi: `#FF6A00` at opacities .55, .22 and 0 (stops 0, .45, 1).
  - Johnny: `#1A1A1A` at .3, .12 and 0.
- **Marks:**
  - A make is a filled circle in the player's color, radius 0.85, with a paper stroke 0.25 wide.
  - A miss is a ring in the player's color, radius 0.75, stroke 0.28.
- **Key under the court:** "● Giuseppi ● Johnny", nothing else.

## Live card

It follows the app's `RecapCard` and Match Details score block (`clutch/mobile/components/ui/RecapCard.tsx`, `app/(game)/match-details.tsx`), set in Geist.

- **Container:** white, 0.5 px border rgba(0,0,0,.06), radius 20, shadow `0 4px 16px rgba(0,0,0,.14)`, clipped.
- **Banner (top third):**
  - **Photo:** the ARC photo, `object-fit: cover` at 50% 38%.
    - Filter: `saturate(.5) sepia(.15) contrast(.9) brightness(1.06)`.
    - A paper (`#F0EEE5`) multiply overlay at 40%.
    - A bottom fade to white: 0 at 18%, .55 at 62%, .97 at 100%.
  - **Live pill (top left):** white at 82% with an 8 px blur. It has a pulsing orange dot and reads "LIVE · <today, e.g. FRI, NOV 6>"; at the end, the dot is grey and the label reads "FINAL · <today>".
  - **Source:** `~/Downloads/uci_arc.jpg` (supplied by giuseppi, cleared on 2026-11-06). Commit it as a web-sized image (for example WebP, about 1200 px wide) with the card step.
  - **Title:** "1v1 @ UCI Anteater Recreation Center" at the bottom left, Geist 600, at most two balanced lines.
- **Score row:**
  - Three columns: 1fr, a fixed 5.4em, 1fr.
  - Each side is a button: the player name as a small label, the score in Geist Mono 500, and a "Win" tag whose space is always reserved.
  - The middle shows only "VS".
  - The leader's score is brand orange and the trailing score is #4B5563. In a tie, both are ink. Color changes over 0.4 s.
  - **Flip-card change** (round 8): when a score changes, it flips like a split-flap card, on the digits themselves with no tile behind them.
    - It uses four half-height layers of the number: new top and old bottom stay still; old top and new bottom move.
    - Each layer has the card's white background so the halves cover each other.
    - The old top half folds away (`rotateX` 0 to 90°, 0.18 s, ease-in), then the new bottom half folds into place (-90° to 0, 0.26 s, `cubic-bezier(.16, 1, .3, 1)`). The hinge is the number's midline, with a 240 px perspective.
    - While the game fast-forwards, the flip shortens to 0.07 s plus 0.1 s. Reduced motion swaps the number with no flip.
    - The number box keeps its fixed 1em height, so the card never resizes.
  - The selected player gets a 2 px orange underline. It defaults to Giuseppi, and tapping a side switches the chips.
- **Chips:**
  - Four equal chips: FG, 3PT, FG% and MMR, all for the selected player.
  - Background: a cream gradient (135°: #FFFEF7 0, #FCF7E9 40%, #F8F1DD 75%, #F2EBD0 100%). Radius 12, with a hairline border.
  - Values are in Geist Mono.
  - MMR shows a muted "··" until the end. Then it shows "+14" in green (#00A57C) for the winner and "-12" for the loser.
- **Caption:** one line with an ellipsis, for example "Giuseppi · Corner 3 · **Made**" with "Made" in orange. At the end it reads "Final 11-7 · Giuseppi wins".
- **Constant size:** every row has a fixed height, numbers are monospaced, and the Win tag uses `visibility`, not `display`. The card's box must not change size at any point in the game, for either selected player.
- **Accessibility:** only the animated court is `aria-hidden`. The card stays in the accessibility tree, so its two player buttons (with `aria-pressed`) stay reachable; the score is not a live region. A visually hidden sentence summarizes the court: "Example 1v1 game at the UCI Anteater Recreation Center: Giuseppi wins 11 to 7."

## Playback

- The game starts at 1.2 s, plays once per page load at 1.25x (about 17.8 s in all), and holds the final chart and card.
- Scrolling back up to the hero never replays or rewinds it (*my call*, following the round 7 "never reverse" note; an earlier draft replayed it on re-entry).
- The animation pauses while the tab is hidden.
- Everything on screen is computed from one clock value, `t`, so any `t` gives the same picture. This makes tests and replays exact.
- Reduced motion renders the final state at once.

## Leaderboard beat (decided)

giuseppi's idea (round 5): when you scroll down, the winner's MMR goes into a leaderboard that ranks up the winner.
- **Round 6:** first names, profile photos, no caption line.
- **Rounds 6 and 7:** tried a scroll-tied version.
- **Round 8:** don't tie it to scroll; let it play on its own, 1.25x faster.

The section sits right after the hero, and Features follows it.

- **Section:** split like the hero (copy left, leaderboard right). Medium is 40/60. Stack puts copy over the leaderboard.
  - Headline: "Every win climbs your court's ladder."
  - Body: "MMR updates the moment a game ends, and your court's leaderboard re-ranks."
  - The section rises in (motion standard) once 10% of the leaderboard is visible.
- **Leaderboard card:** follows the app's Leaderboards screen (`clutch/mobile/app/leaderboards.tsx`) in Geist, with the live card's container style.
  - Scope chips: Friends, Court (active), City.
  - Header: a trophy icon in brand orange, "Court · 1V1", and "UCI Anteater Recreation Center" below.
  - Each row has five columns: rank (mono, muted), a round profile photo, first name over a W-L record (mono), MMR (Geist Mono 500), and a delta column whose space is always reserved.
  - Rows have a fixed height, and dividers start at the name column. There is no caption line.
- **Photos (*my call*):** the four team photos the Contact page already publishes: `public/johnnyf.webp`, `public/giuseppip.png`, `public/andrewe.png` and `public/dylann.jpg`. Serve them at about 2x the display size. giuseppi may swap in others.
- **Data (illustrative):**

  | Before | MMR | W-L | After | MMR | W-L | Delta |
  |---|---|---|---|---|---|---|
  | 1 Johnny | 1296 | 21-8 | 1 Giuseppi | 1301 | 24-9 | +14 (green) |
  | 2 Giuseppi | 1287 | 23-9 | 2 Johnny | 1284 | 21-9 | -12 (muted) |
  | 3 Andrew | 1251 | 18-10 | 3 Andrew | 1251 | 18-10 | |
  | 4 Dylan | 1218 | 15-11 | 4 Dylan | 1218 | 15-11 | |

  MMR, not the 1-99 rating, because the card's chip says MMR and the app has a "Your MMR" screen (`app/mmr-graph.tsx`). The app's Leaderboards screen shows the 1-99 rating with tiers; if the app settles on one number, the site follows it.
- **The beat:** one progress value T, from 0 to 2.3 design seconds, draws everything. It plays at 1.25x, so about 1.84 s in real time:
  - **0 to 0.15:** a "+14" token appears over the card's MMR chip, scaling from 0.8 to 1. It is a white pill with green Geist Mono text and a soft shadow. The card switches to Giuseppi's chips if Johnny's were selected.
  - **0.15 to 1.05:** the token travels to Giuseppi's MMR along a quadratic curve, eased with `cubic-bezier(.65, 0, .35, 1)`, swelling about 12% mid-flight.
    - The curve's control point is (end x, start y), so the token moves across, then down.
    - When start and end are nearly stacked (phones), the control point instead sits 90 px to the side, halfway down.
  - **1.05:** the token fades out over 0.25 s. Over 0.4 s, Giuseppi's MMR counts from 1287 to 1301 and Johnny's from 1296 to 1284. The deltas and new records appear.
  - **1.6 to 2.3:** Giuseppi and Johnny swap places, eased with a strong ease-out close to `cubic-bezier(.16, 1, .3, 1)`.
    - Rows move by transform, interpolated from T rather than by a CSS transition, so the whole beat comes from one value and tests can set any T.
    - Rank numbers swap at the halfway point. Giuseppi's row gets a brand tint at 8%, and his name turns orange.
- **When it plays:**
  - It starts once 60% of the leaderboard is visible and the game is over, then runs to the end on its own.
  - It plays once per page load. Leaving the screen doesn't reset it, and scrolling never drives or rewinds it.
- **If the reader gets there first** (*my call*, keeping giuseppi's round 6 concern about early scrollers):
  - If the leaderboard is 60% visible while the game is still playing and less than 60% of the live card is on screen, the game fast-forwards at 8x until it ends (about 2 s at most). Then the beat plays.
  - It is not tied to scroll distance; it's on or off. Every shot still lands in order, just faster.
  - On tall screens that show the card and the leaderboard together, the game plays at normal speed and the beat follows.
- **Reduced motion:** the final ranking, with no token and no movement.

## Removals and cleanups

- **C1:** the OVR badge and the ladder polaroids leave the hero (`FrameMount`, `OvrBadge` and `RecCenterLeaderboard` in `Hero.tsx`).
- **C2:** reduced-motion support, as above.
- **C3:** delete `BallZoom.tsx`, `AROverlay.tsx` and `Loader.tsx`. Remove the loader state and `AnimatePresence` from `Index.tsx`, and remove the `matter-js` dependency (83 KB minified, 26 KB gzipped).
  - Also remove the styles only they used (`glass-panel-dark`, `scanlines`, the `obsidian` tokens). Grep first.
  - `RotatingGlobe` is not dead: it renders in Features 04. It stays, under the demo-loop rules in "Motion standard".
- **C4:** no em dashes in site copy. They appear in `PullQuote.tsx:24,36`, `FooterCTA.tsx:54,78`, `FeaturesPolaroidGrid.tsx:32,242,246,250`, `HowItWorksRail.tsx:13,21,29,37,57`, and the `index.html` titles. Rewrite them as plain sentences with the same meaning; giuseppi reviews the wording in the PR.
- **C5:** the phone headline breaks cleanly, and the stack order is as above.
- **C6:** the nav keeps one "Coming soon": the button. Drop the `COMING SOON` NavLink, and update `Navbar.test.tsx`.
  - *My call:* the button links to `/#download` (the beta form) instead of showing a toast, so the link's job isn't lost.

## Constraints

- **Stack:** Vite 7, React 18, TypeScript strict, Tailwind 3, framer-motion 12, and Lenis smooth scroll.
- **Dependencies:** only Geist itself, via Google Fonts or `@fontsource`.
- **Repo:** `giuseppi/clutch_web` (public; origin is personal, so the brain hooks stay off). Every merge to `main` deploys to production on Vercel; PR branches get Preview deploys.
  - One PR per build step into a `revamp` branch, each reviewed on its Vercel Preview deploy.
  - One merge from `revamp` to `main` ships everything, only after giuseppi's explicit "yes, deploy".
- **Jira (*my call*):** before creating anything, check CLUTCH for an existing revamp epic. Then use one ticket per build step, and confirm the list with giuseppi before creating it.
- **Checks:** lint, typecheck (`npx tsc -p tsconfig.app.json --noEmit`), Vitest and build must pass.
- **Brain:** update `brain/products/web/overview.md`. The hero claims change to who shot, make or miss, 2 or 3, shot spots, live card and MMR change. Remove the ball-zoom section, and add a pointer to the motion module.

## Left to the builder

- Component split and file layout (for example `hero/game.ts` for the script and pure functions, plus `HalfCourt` and `LiveCard` components).
- Whether frames run on `requestAnimationFrame` or framer-motion's `useAnimationFrame`.
- Exact pixel sizes and breakpoints, within the proportions above.
- Image format and compression for the ARC photo (for example WebP around 1200 px wide).
- How the section reveals are retuned, as long as they use the motion module.

## Answered questions (giuseppi, 2026-11-06)

1. **Leaderboard beat:** in, playing on its own (round 8). Not tied to scroll, and nothing rewinds.
2. **Release path:** one release through a `revamp` integration branch.
3. **ARC photo:** cleared to publish.

## Verification

- **Unit tests (Vitest):**
  - each shot's zone and points
  - the totals after 13 shots (11-7, FG 5/7 and 3/6, 3PT 1/2 and 1/3)
  - the state at beat boundaries (0.95 s and 1.6 s)
  - the leader color for leads, ties and the final
- **Browser, at these CSS viewport sizes:**
  - iPhone: 390×844, and 844×390 in landscape.
  - iPhone Duo: folded 466×678; open 626×890, and 890×626 in landscape. These are estimated from the panel resolution at 3x, since Apple hasn't published point sizes, so recheck them when it does.
  - iPad: 820×1180, and 1180×820 in landscape.
  - iPad Pro 13: 1024×1366.
  - Desktop: 1440×900.

  At each size:
  - Screenshots of the entrance at 100 ms and at 1.3 s.
  - Screenshots mid-shot, after a make, and at the final state.
  - The card's box measured identical at every shot for both selected players.
  - No console errors and no horizontal overflow.
  - The leaderboard ends with Giuseppi at #1 with 1301. Scrolling to it mid-game fast-forwards the rest of the game (under 3 s). Scrolling up and back never resets or rewinds it.
  - The full game takes about 17.8 s from the start of the entrance.
  - Score flip frames, frozen through the Web Animations API at 90, 175, 260 and 470 ms: they show the old number folding, then the new top half over the old bottom half, then a clean new number.
- **Performance:** frames stay under 16 ms during the game (Chrome performance panel), and the bundle shrinks after `matter-js` is removed.
- **Reduced motion:** with it on, the page shows the final chart with no movement.
