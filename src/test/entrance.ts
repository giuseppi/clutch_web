import { useSyncExternalStore } from "react";

/*
  A stand-in for @/lib/entrance: vi.mock("@/lib/entrance", () => import("@/test/entrance")).
  The entrance has started; settleEntrance() turns useEntranceSettled true and re-renders the
  components that use it, as the real hook's state does.
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

export function useEntranceSettled(): boolean {
  return useSyncExternalStore(subscribe, () => settled);
}

export function settleEntrance() {
  settled = true;
  for (const listener of listeners) listener();
}

/** Back to a page load whose entrance has started but not settled. */
export function resetEntrance() {
  settled = false;
}
