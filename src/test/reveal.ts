import { act } from "@testing-library/react";

/**
 * Samples a list of opacities every 16 ms for `ms`, so a test can check the order things
 * appear in without depending on exact frame timing.
 */
export async function sampleOpacities(read: () => number[], ms: number): Promise<number[][]> {
  const samples: number[][] = [];
  const until = performance.now() + ms;
  while (performance.now() < until) {
    await act(() => new Promise((r) => setTimeout(r, 16)));
    samples.push(read());
  }
  return samples;
}

/** The index of the first sample where entry `i` is above 0, or -1. */
export const firstShown = (samples: number[][], i: number) => samples.findIndex((s) => s[i] > 0);
