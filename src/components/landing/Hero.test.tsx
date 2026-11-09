import { createRef, type Ref } from "react";
import { act, render, screen } from "@testing-library/react";
import { useReducedMotion } from "framer-motion";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useEntranceStart } from "@/lib/entrance";
import { pageClock } from "./game/playbackContext";
import { PlaybackProvider } from "./game/PlaybackProvider";
import Hero from "./Hero";

vi.mock("@/lib/entrance", () => ({ useEntranceStart: vi.fn(() => true), useEntranceSettled: () => true, useEntranceStage: () => {} }));

vi.mock("framer-motion", async (orig) => ({
  ...(await orig<typeof import("framer-motion")>()),
  useReducedMotion: vi.fn(() => false),
}));

const BODY =
  "Clutch turns a phone in a courtside corner into a professional-grade analytics rig, built for the leagues that aren't on TV.";

const { innerWidth, innerHeight } = window;

function setWindow(width: number, height: number) {
  window.innerWidth = width;
  window.innerHeight = height;
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "requestAnimationFrame", "cancelAnimationFrame", "performance"] });
  // A fresh page load.
  pageClock.current = { t: 0, lt: null, ff: false };
});

afterEach(() => {
  vi.useRealTimers();
  setWindow(innerWidth, innerHeight);
  vi.mocked(useEntranceStart).mockReturnValue(true);
  vi.mocked(useReducedMotion).mockReturnValue(false);
});

function renderHero(mmrRef?: Ref<HTMLSpanElement>) {
  return render(
    <PlaybackProvider>
      <Hero mmrRef={mmrRef} />
    </PlaybackProvider>,
  );
}

const wait = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms);
  });

/** The score a side shows, or is flipping to. */
function score(name: "GIUSEPPI" | "JOHNNY") {
  const num = screen.getByRole("button", { name: new RegExp(name) }).querySelector(".flip-num") as HTMLElement;
  return Number((num.querySelector(".flip-size") ?? num).textContent);
}

const pill = () => screen.getByText(/^(LIVE|FINAL) · /).textContent ?? "";

/** The headline words, body, card and key: the entrance's HTML elements. */
function entranceElements(container: HTMLElement) {
  const words = [...container.querySelectorAll("h1 span.inline-block")] as HTMLElement[];
  expect(words).toHaveLength(7);
  const body = screen.getByText(/^Clutch turns a phone/);
  const card = screen.getByTestId("live-card").parentElement as HTMLElement;
  const key = screen.getByText("Johnny").parentElement as HTMLElement;
  return [...words, body, card, key];
}

/** The court's entrance: its lines (drawn by dash offset), and the floor and hoop groups (framer sets SVG opacity as an attribute). */
function court(container: HTMLElement) {
  const lines = [...container.querySelectorAll("[data-court-line]")];
  expect(lines).toHaveLength(5);
  const floor = container.querySelector(".fill-paperAlt")?.parentElement as Element;
  const hoop = container.querySelector("[data-backboard]")?.parentElement as Element;
  return { lines, groups: [floor, hoop] };
}

describe("Hero", () => {
  it("keeps the headline and body copy word for word", () => {
    renderHero();
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Talent doesn't wait for a camera crew.");
    expect(screen.getByText(/^Clutch turns a phone/).textContent).toBe(BODY);
  });

  it("keeps professional-grade on one line", () => {
    renderHero();
    expect(screen.getByText("professional-grade")).toHaveClass("whitespace-nowrap");
  });

  it("summarizes the hidden court for screen readers", () => {
    const { container } = renderHero();
    expect(
      screen.getByText("Example 1v1 game at the UCI Anteater Recreation Center: Giuseppi wins 11 to 7."),
    ).toHaveClass("sr-only");
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("selects Giuseppi by default", () => {
    renderHero();
    expect(screen.getByRole("button", { name: /GIUSEPPI/ })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /JOHNNY/ })).toHaveAttribute("aria-pressed", "false");
  });

  it("hands the MMR ref to the card", () => {
    const mmrRef = createRef<HTMLSpanElement>();
    renderHero(mmrRef);
    expect(mmrRef.current?.textContent).toBe("··");
    wait(18_000);
    expect(mmrRef.current?.textContent).toBe("+14");
  });

  it.each([
    [1440, 900, "split"],
    [820, 1180, "medium"],
    [390, 844, "stack"],
  ])("sets data-layout on the section root at %i x %i to %s", (width, height, layout) => {
    setWindow(width, height);
    const { container } = renderHero();
    expect(container.firstElementChild).toHaveAttribute("data-layout", layout);
  });

  it("drops the eyebrow lines", () => {
    renderHero();
    expect(screen.queryByText(/BASKETBALL/)).toBeNull();
    expect(screen.queryByText(/VOL\. I/)).toBeNull();
    expect(screen.queryByText(/IRVINE/)).toBeNull();
  });
});

describe("Hero playback", () => {
  it("keeps the game, the score and the card node when a phone rotates mid-game", () => {
    setWindow(390, 844);
    const { container } = renderHero();
    expect(container.firstElementChild).toHaveAttribute("data-layout", "stack");
    wait(6000);
    const scores = [score("GIUSEPPI"), score("JOHNNY")];
    expect(scores[0]).toBeGreaterThan(0);
    expect(pill()).toMatch(/^LIVE/);
    const card = screen.getByTestId("live-card");

    act(() => {
      setWindow(844, 390);
      window.dispatchEvent(new Event("resize"));
    });
    expect(container.firstElementChild).toHaveAttribute("data-layout", "split");
    expect(screen.getByTestId("live-card")).toBe(card);
    expect([score("GIUSEPPI"), score("JOHNNY")]).toEqual(scores);

    wait(13_000);
    expect(pill()).toMatch(/^FINAL/);
    expect(screen.getByTestId("live-card")).toBe(card);
  });

  it("waits for the entrance before the first shot", () => {
    vi.mocked(useEntranceStart).mockReturnValue(false);
    renderHero();
    wait(5000);
    expect([score("GIUSEPPI"), score("JOHNNY")]).toEqual([0, 0]);
    expect(pill()).toMatch(/^LIVE/);
  });

  it("hides the entrance elements until the entrance starts", () => {
    vi.mocked(useEntranceStart).mockReturnValue(false);
    const { container } = renderHero();
    for (const el of entranceElements(container)) expect(el).toHaveStyle({ opacity: "0" });
    const { lines, groups } = court(container);
    for (const line of lines) expect(line).toHaveAttribute("stroke-dashoffset", "1");
    for (const group of groups) expect(group).toHaveAttribute("opacity", "0");
  });

  it("shows every entrance element and the final card at once under reduced motion", () => {
    vi.mocked(useEntranceStart).mockReturnValue(false);
    vi.mocked(useReducedMotion).mockReturnValue(true);
    const { container } = renderHero();
    expectSettled(container);
    expect(pill()).toMatch(/^FINAL/);
    expect([score("GIUSEPPI"), score("JOHNNY")]).toEqual([11, 7]);
  });

  it("resumes the game and skips the entrance when it mounts again in the same page load", () => {
    const first = renderHero();
    wait(6000);
    const scores = [score("GIUSEPPI"), score("JOHNNY")];
    expect(scores[0]).toBeGreaterThan(0);
    first.unmount();

    const { container } = renderHero();
    expectSettled(container);
    expect([score("GIUSEPPI"), score("JOHNNY")]).toEqual(scores);
    expect(pill()).toMatch(/^LIVE/);
  });
});

/** Every entrance element in its final state: risen, faded in, and lines drawn with no dash left. */
function expectSettled(container: HTMLElement) {
  for (const el of entranceElements(container)) expect(el).toHaveStyle({ opacity: "1" });
  const { lines, groups } = court(container);
  for (const line of lines) {
    expect(line).toHaveAttribute("stroke-dashoffset", "0");
    expect(line).toHaveAttribute("stroke-dasharray", "none");
  }
  for (const group of groups) expect(group).toHaveAttribute("opacity", "1");
}
