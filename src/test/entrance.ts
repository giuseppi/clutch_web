import { useReducedMotion } from "framer-motion";
import { useSyncExternalStore } from "react";

/*
  A stand-in for @/lib/entrance: vi.mock("@/lib/entrance", () => import("@/test/entrance")).
  The entrance has started; settleEntrance() turns useEntranceSettled true and re-renders the
  components that use it, as the real hook's state does. Like the real hook, it is true at
  once under reduced motion.
*/
let settled = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useEntranceStart(): boolean {
  return true;
}

export function useEntranceStage(): void {}

export function useEntranceSettled(): boolean {
  const now = useSyncExternalStore(subscribe, () => settled);
  const reduced = useReducedMotion() ?? false;
  return now || reduced;
}

export function settleEntrance() {
  settled = true;
  for (const listener of listeners) listener();
}

/** Back to a page load whose entrance has started but not settled. */
export function resetEntrance() {
  settled = false;
}
