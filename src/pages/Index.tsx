import { lazy, Suspense } from "react";
import Navbar from "@/components/landing/Navbar";
import GameStage from "@/components/landing/GameStage";

/** Everything under the leaderboard loads as a separate chunk, so the hero's JS stays small. */
const BelowFold = lazy(() => import("@/components/landing/BelowFold"));

/*
  Stands in for those sections until they arrive, at least as tall as they are (How It Works is
  320vh and the rest stays under 4500 px at every checked size), so a reload mid-page still
  restores its scroll position.
*/
const BELOW_FOLD_HEIGHT = "calc(320vh + 4500px)";

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
