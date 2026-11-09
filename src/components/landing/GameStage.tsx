import { useRef } from "react";
import { MmrToken } from "./game/MmrToken";
import { PlaybackProvider } from "./game/PlaybackProvider";
import Hero from "./Hero";
import Leaderboard from "./Leaderboard";

/**
 * The hero and the leaderboard on one clock. The stage is the positioned box the "+14"
 * token flies in, from the live card's MMR chip to Giuseppi's MMR on the ladder, and it
 * carries the paper grain for both, so no seam shows between them.
 */
const GameStage = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const fromRef = useRef<HTMLSpanElement>(null);
  const toRef = useRef<HTMLSpanElement>(null);

  return (
    <PlaybackProvider>
      <div ref={stageRef} data-testid="game-stage" className="paper-grain relative">
        <Hero mmrRef={fromRef} />
        <Leaderboard mmrRef={toRef} />
        <MmrToken stageRef={stageRef} fromRef={fromRef} toRef={toRef} />
      </div>
    </PlaybackProvider>
  );
};

export default GameStage;
