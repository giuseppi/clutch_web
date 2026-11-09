import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/** Product demo loop. Plays only while on screen, and stays on its poster under reduced motion. */
export const DemoVideo = () => {
  const ref = useRef<HTMLVideoElement>(null);
  const onScreen = useInView(ref, { amount: 0.3 });
  const reduced = useReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (reduced || !onScreen) {
      video.pause();
    } else {
      video.play().catch((error: unknown) => {
        // A pause that interrupts the play (a quick scroll past) is expected; anything else is not.
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.warn("[landing] The demo video could not play:", error);
      });
    }
  }, [onScreen, reduced]);

  return (
    <div className="relative h-40 step-tight:h-28 step-flat:h-24 bg-paperAlt border border-ink/10 rounded-sm overflow-hidden">
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-3 py-2 z-10">
        <span className="label text-ink text-[10px] bg-paper/90 px-2 py-0.5">CLUTCH · DEMO</span>
        <span className="label text-brand text-[10px] bg-paper/90 px-2 py-0.5">● LIVE</span>
      </div>
      <video
        ref={ref}
        src="/clutch-demo.mp4"
        poster="/clutch-demo-poster.jpg"
        aria-label="Clutch product demo"
        className="w-full h-full object-cover"
        muted
        loop
        playsInline
        preload="metadata"
      />
    </div>
  );
};
