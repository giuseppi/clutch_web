import { useEffect, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  inView: boolean;
  delay?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

/**
 * Counts from 0 → value with cubic ease-out when `inView` becomes true.
 * Uses requestAnimationFrame; cancels on unmount or when value changes.
 */
export const AnimatedNumber = ({
  value,
  decimals = 1,
  inView,
  delay = 0,
  duration = 1400,
  prefix = "",
  suffix = "",
}: AnimatedNumberProps) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame: number;
    const timeout = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(eased * value);
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [inView, value, delay, duration]);

  return (
    <>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </>
  );
};
