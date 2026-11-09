import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { useReducedMotion } from "framer-motion";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetEntrance, settleEntrance } from "@/test/entrance";
import { setIntersection } from "@/test/intersection";
import { pageClock } from "./game/playbackContext";
import GameStage from "./GameStage";

vi.mock("@/lib/entrance", () => import("@/test/entrance"));

vi.mock("framer-motion", async (orig) => ({
  ...(await orig<typeof import("framer-motion")>()),
  useReducedMotion: vi.fn(() => false),
}));

beforeEach(() => {
  // A fresh page load.
  pageClock.current = { t: 0, lt: null, ff: false };
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.mocked(useReducedMotion).mockReturnValue(false);
  resetEntrance();
});

const wait = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms);
  });

const liveCard = () => screen.getByTestId("live-card");
const ladderCard = () => screen.getByTestId("ladder-card");
const pill = () => within(liveCard()).getByText(/^(LIVE|FINAL) · /).textContent ?? "";
const row = (name: string) => within(ladderCard()).getByText(name).closest("li") as HTMLElement;
const rank = (name: string) => within(row(name)).getByTestId("rank").textContent;
const mmr = (name: string) => within(row(name)).getByTestId("mmr").textContent;
const side = (name: "GIUSEPPI" | "JOHNNY") => screen.getByRole("button", { name: new RegExp(name) });
const token = () => screen.queryByTestId("mmr-token");
const showLadder = (ratio: number) => act(() => setIntersection(ladderCard(), ratio));

function rect(x: number, y: number, width: number, height: number): DOMRect {
  return { x, y, left: x, top: y, width, height, right: x + width, bottom: y + height, toJSON: () => ({}) };
}

describe("GameStage", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "requestAnimationFrame", "cancelAnimationFrame", "performance"] });
  });

  it("waits for the reader: the game ends and the ladder holds until it is in view", () => {
    render(<GameStage />);
    showLadder(0);
    wait(18_000);
    expect(pill()).toMatch(/^FINAL/);
    expect(rank("Johnny")).toBe("1");
    expect(mmr("Giuseppi")).toBe("1287");
    expect(token()).toBeNull();
  });

  it("plays the beat once the ladder is 60% visible, and never rewinds it", () => {
    render(<GameStage />);
    wait(18_000);
    showLadder(0.6);
    wait(2000);
    expect(rank("Giuseppi")).toBe("1");
    expect(mmr("Giuseppi")).toBe("1301");
    const settled = ladderCard().innerHTML;

    showLadder(0);
    wait(1000);
    showLadder(0.6);
    wait(2000);
    expect(ladderCard().innerHTML).toBe(settled);
    expect(pill()).toMatch(/^FINAL/);
  });

  it("fast-forwards the rest of the game when the ladder is in view and the card is not, then plays the beat", () => {
    render(<GameStage />);
    wait(3000);
    expect(pill()).toMatch(/^LIVE/);
    showLadder(0.7);
    act(() => setIntersection(liveCard(), 0));
    wait(3000);
    expect(pill()).toMatch(/^FINAL/);
    wait(2000);
    expect(rank("Giuseppi")).toBe("1");
    expect(mmr("Giuseppi")).toBe("1301");
  });

  it("presses Giuseppi's side during the flight and keeps it after, until the visitor picks again", () => {
    render(<GameStage />);
    wait(18_000);
    fireEvent.click(side("JOHNNY"));
    expect(side("JOHNNY")).toHaveAttribute("aria-pressed", "true");

    showLadder(0.6);
    let flight = 0;
    for (let i = 0; i < 150; i++) {
      wait(16);
      if (!token()) continue;
      flight++;
      expect(side("GIUSEPPI")).toHaveAttribute("aria-pressed", "true");
    }
    // lt runs 0 to 1.3 at RATE 1.25: about 1.04 s of frames.
    expect(flight).toBeGreaterThan(55);
    expect(token()).toBeNull();
    expect(side("GIUSEPPI")).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(side("JOHNNY"));
    expect(side("JOHNNY")).toHaveAttribute("aria-pressed", "true");
  });

  it("flies the token by transform from the card's MMR, measuring only during the flight", () => {
    render(<GameStage />);
    const stage = screen.getByTestId("game-stage");
    const from = within(liveCard()).getByText("MMR").nextElementSibling as HTMLElement;
    const to = within(row("Giuseppi")).getByTestId("mmr");
    vi.spyOn(stage, "getBoundingClientRect").mockReturnValue(rect(0, -100, 1000, 3000));
    const fromRect = vi.spyOn(from, "getBoundingClientRect").mockReturnValue(rect(80, 180, 40, 20));
    vi.spyOn(to, "getBoundingClientRect").mockReturnValue(rect(680, 890, 40, 20));

    // One act per 100 ms, so the game renders 180 times on its way to the end.
    for (let i = 0; i < 180; i++) wait(100);
    expect(pill()).toMatch(/^FINAL/);
    expect(fromRect).not.toHaveBeenCalled();

    showLadder(0.6);
    wait(16);
    const first = token() as HTMLElement;
    expect(first).toHaveAttribute("aria-hidden", "true");
    expect(first.textContent).toBe("+14");
    // Before 0.15 the token sits on the chip: its centre, relative to the stage.
    expect(first.style.transform).toMatch(/^translate\(100px, 290px\) translate\(-50%, -50%\) scale\(0\.8\d*\)$/);
    expect(Number(first.style.opacity)).toBeGreaterThan(0);
    expect(Number(first.style.opacity)).toBeLessThan(1);
    expect(fromRect).toHaveBeenCalled();

    wait(2000);
    expect(token()).toBeNull();
    fromRect.mockClear();
    wait(1000);
    expect(fromRect).not.toHaveBeenCalled();
  });

  it("starts final under reduced motion: the new order and no token", () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    render(<GameStage />);
    expect(pill()).toMatch(/^FINAL/);
    expect(rank("Giuseppi")).toBe("1");
    expect(mmr("Giuseppi")).toBe("1301");
    expect(rank("Johnny")).toBe("2");
    expect(token()).toBeNull();
  });
});

describe("Leaderboard reveal", () => {
  const realWait = (ms: number) => act(() => new Promise((r) => setTimeout(r, ms)));

  it("rises in once in view, but not before the entrance settles", async () => {
    render(<GameStage />);
    const copy = screen.getByRole("heading", { name: "Every win climbs your court's ladder." }).parentElement as HTMLElement;
    const card = ladderCard().parentElement as HTMLElement;
    const section = copy.parentElement as HTMLElement;
    expect(within(copy).getByText("MMR updates the moment a game ends, and your court's leaderboard re-ranks.")).toBeInTheDocument();
    const opacities = () => [copy, card].map((el) => Number(el.style.opacity));

    act(() => setIntersection(section, 0.2));
    await realWait(900);
    expect(opacities()).toEqual([0, 0]);

    act(() => settleEntrance());
    // framer starts observing once whileInView is set; a real observer then reports the element in view.
    act(() => setIntersection(section, 0.2));
    await realWait(900);
    for (const opacity of opacities()) expect(opacity).toBeGreaterThan(0);
  });

  it("does not wait for a settle under reduced motion, where there is no entrance", async () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    render(<GameStage />);
    const copy = screen.getByRole("heading", { name: "Every win climbs your court's ladder." }).parentElement as HTMLElement;
    act(() => setIntersection(copy.parentElement as HTMLElement, 0.2));
    await realWait(900);
    expect(Number(copy.style.opacity)).toBeGreaterThan(0);
    expect(Number((ladderCard().parentElement as HTMLElement).style.opacity)).toBeGreaterThan(0);
  });
});
