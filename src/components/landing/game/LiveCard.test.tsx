import { createRef } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { formatCardDate } from "./format";
import { BRAND, TRAIL, landTime, stateAt, type GameState, type PlayerId } from "./game";
import { LiveCard } from "./LiveCard";
import { GAME } from "./timeline";

const DAY = new Date(2026, 10, 6);

function renderCard(state: GameState, selected: PlayerId = "G") {
  const mmrRef = createRef<HTMLSpanElement>();
  const onSelect = vi.fn();
  const view = render(<LiveCard state={state} selected={selected} onSelect={onSelect} date={DAY} mmrRef={mmrRef} />);
  return { ...view, mmrRef, onSelect };
}

const button = (name: "GIUSEPPI" | "JOHNNY") => screen.getByRole("button", { name: new RegExp(name) });
const score = (name: "GIUSEPPI" | "JOHNNY") => button(name).querySelector(".flip-num") as HTMLElement;
const winTag = (name: "GIUSEPPI" | "JOHNNY") => within(button(name)).getByText("WIN");
const caption = () => screen.getByTestId("card-caption");
const chip = (label: string) => screen.getByText(label, { selector: "span" }).parentElement?.textContent;

describe("formatCardDate", () => {
  it("gives the short weekday, month and day in capitals", () => {
    expect(formatCardDate(DAY)).toBe("FRI, NOV 6");
  });
});

describe("LiveCard", () => {
  it("starts at tip-off", () => {
    const { mmrRef } = renderCard(stateAt(0));
    expect(screen.getByText("LIVE · FRI, NOV 6")).toBeInTheDocument();
    expect(score("GIUSEPPI").textContent).toBe("0");
    expect(score("JOHNNY").textContent).toBe("0");
    expect(caption()).toHaveTextContent(/^Tip-off$/);
    expect(mmrRef.current?.textContent).toBe("··");
    expect(winTag("GIUSEPPI")).toHaveStyle({ visibility: "hidden" });
    expect(winTag("JOHNNY")).toHaveStyle({ visibility: "hidden" });
  });

  it("shows the last shot and the selected player's line after shot 9", () => {
    renderCard(stateAt(landTime(8)));
    expect(caption().textContent).toBe("Giuseppi · Corner 3 · Made");
    expect(within(caption()).getByText("Made")).toHaveClass("text-brand");
    expect(chip("FG")).toBe("FG4/5");
    expect(chip("3PT")).toBe("3PT1/2");
    expect(chip("FG%")).toBe("FG%80");
    expect(score("GIUSEPPI").textContent).toBe("9");
    expect(score("JOHNNY").textContent).toBe("7");
  });

  it("shows the final, the winner and the MMR change", () => {
    const { mmrRef } = renderCard(stateAt(GAME));
    expect(screen.getByText("FINAL · FRI, NOV 6")).toBeInTheDocument();
    expect(caption().textContent).toBe("Final 11-7 · Giuseppi wins");
    expect(winTag("GIUSEPPI")).toHaveStyle({ visibility: "visible" });
    expect(winTag("JOHNNY")).toHaveStyle({ visibility: "hidden" });
    expect(mmrRef.current?.textContent).toBe("+14");
    expect(mmrRef.current).toHaveStyle({ color: "#00A57C" });
    expect(score("GIUSEPPI")).toHaveStyle({ color: BRAND });
    expect(score("JOHNNY")).toHaveStyle({ color: TRAIL });
  });

  it("shows the loser's line when Johnny is selected", () => {
    const { mmrRef } = renderCard(stateAt(GAME), "J");
    expect(mmrRef.current?.textContent).toBe("-12");
    expect(mmrRef.current).not.toHaveStyle({ color: "#00A57C" });
    expect(chip("FG")).toBe("FG3/6");
    expect(chip("3PT")).toBe("3PT1/3");
    expect(chip("FG%")).toBe("FG%50");
  });

  it("marks the selected player and reports taps", () => {
    const { onSelect } = renderCard(stateAt(GAME));
    expect(button("GIUSEPPI")).toHaveAttribute("aria-pressed", "true");
    expect(button("JOHNNY")).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(button("JOHNNY"));
    expect(onSelect).toHaveBeenCalledWith("J");
  });

  it("puts the root ref and test id on the card", () => {
    const rootRef = createRef<HTMLDivElement>();
    render(<LiveCard state={stateAt(GAME)} selected="G" onSelect={() => {}} date={DAY} rootRef={rootRef} />);
    expect(rootRef.current).toBe(screen.getByTestId("live-card"));
  });

  it("reads today's date once per mount, not on every frame", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 10, 6, 23, 59));
    const card = (t: number) => <LiveCard state={stateAt(t)} selected="G" onSelect={() => {}} />;
    const { rerender } = render(card(1));
    vi.setSystemTime(new Date(2026, 10, 7, 0, 1));
    rerender(card(2));
    expect(screen.getByText(/· FRI, NOV 6$/)).toBeInTheDocument();
    vi.useRealTimers();
  });
});
