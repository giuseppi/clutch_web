import { useReducedMotion } from "framer-motion";
import { Fragment, useEffect, useState, type CSSProperties } from "react";

interface FlipNumberProps {
  value: string;
  /** Shorter flip, for fast-forward. */
  quick?: boolean;
  className?: string;
  style?: CSSProperties;
}

interface Flip {
  from: string;
  to: string;
  /** Fixed when the flip starts, so the CSS timings and the settle timer always agree. */
  quick: boolean;
  /** Remounts the halves so their CSS animations restart. */
  id: number;
}

/** Fold out (0.18 s) plus fold in (0.26 s), or 0.07 s plus 0.1 s when quick. See .flip-* in index.css. */
const FLIP_MS = 440;
const QUICK_MS = 170;

/**
 * A number that flips like a split-flap card when it changes. Four half-height layers:
 * the new top and the old bottom stay still while the old top folds away and the new
 * bottom folds into place. It settles back to plain text once the flip ends.
 */
export function FlipNumber({ value, quick = false, className, style }: FlipNumberProps) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(value);
  const [flip, setFlip] = useState<Flip | null>(null);

  if (value !== shown) {
    setShown(value);
    setFlip(reduced ? null : { from: shown, to: value, quick, id: (flip?.id ?? 0) + 1 });
  }

  useEffect(() => {
    if (!flip) return;
    const timer = window.setTimeout(() => setFlip(null), flip.quick ? QUICK_MS : FLIP_MS);
    return () => window.clearTimeout(timer);
  }, [flip]);

  const classes = ["flip-num", flip?.quick && "quick", className].filter(Boolean).join(" ");
  if (!flip) {
    return (
      <span className={classes} style={style}>
        {value}
      </span>
    );
  }
  // The halves are direct children of .flip-num: WebKit applies perspective through the DOM parent only.
  return (
    <span className={classes} style={style}>
      <span className="flip-size">{flip.to}</span>
      <Fragment key={flip.id}>
        <span aria-hidden="true" className="flip-half flip-top">
          {flip.to}
        </span>
        <span aria-hidden="true" className="flip-half flip-bottom">
          {flip.from}
        </span>
        <span aria-hidden="true" className="flip-half flip-top flip-out">
          {flip.from}
        </span>
        <span aria-hidden="true" className="flip-half flip-bottom flip-in">
          {flip.to}
        </span>
      </Fragment>
    </span>
  );
}
