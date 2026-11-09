import { lazy, Suspense } from "react";
import Navbar from "@/components/landing/Navbar";
import GameStage from "@/components/landing/GameStage";
import { holdEntrance } from "@/lib/entrance";

/** Everything under the leaderboard loads as a separate chunk, so the hero's JS stays small. */
const loadBelowFold = () => import("@/components/landing/BelowFold");
const BelowFold = lazy(loadBelowFold);

/*
  Their first paint costs a frame or two, so the entrance waits until they have mounted and
  painted: two frames after the chunk (preloaded in index.html) arrives.
*/
const twoFrames = () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
holdEntrance(loadBelowFold().then(twoFrames));

/*
  Stands in for those sections until they arrive, at least as tall as they are, so a reload
  mid-page still restores its scroll position. The How It Works rail is 320vh; everything else
  measures at most 5054 px, at 767 px wide, where the single-column layout is widest.
*/
const BELOW_FOLD_HEIGHT = "calc(320vh + 5500px)";

const Index = () => (
  <main className="min-h-screen bg-paper text-ink">
    <Navbar animateIn />
    <GameStage />
    <Suspense fallback={<div style={{ height: BELOW_FOLD_HEIGHT }} />}>
      <BelowFold />
    </Suspense>
  </main>
);

export default Index;
