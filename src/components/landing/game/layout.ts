import { useEffect, useState } from "react";

export type Layout = "split" | "medium" | "stack";

export function layoutFor(width: number, height: number): Layout {
  if (width < 620) return "stack";
  if (width / height >= 1.25 || width >= 1200) return "split";
  return "medium";
}

export function useLayout(): Layout {
  const [layout, setLayout] = useState<Layout>(() => layoutFor(window.innerWidth, window.innerHeight));
  useEffect(() => {
    const onResize = () => setLayout(layoutFor(window.innerWidth, window.innerHeight));
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return layout;
}
