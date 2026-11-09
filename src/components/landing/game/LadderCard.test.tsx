import { createRef } from "react";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BRAND } from "./game";
import { LadderCard } from "./LadderCard";
import { L_END } from "./timeline";

const card = () => screen.getByTestId("ladder-card");
const row = (name: string) => within(card()).getByText(name).closest("li") as HTMLElement;
const cell = (name: string, id: "rank" | "mmr" | "delta") => within(row(name)).getByTestId(id);
const slot = (name: string) => row(name).style.getPropertyValue("--slot");

describe("LadderCard", () => {
  it("shows the scopes as labels with Court active", () => {
    render(<LadderCard T={0} />);
    for (const label of ["Friends", "Court", "City"]) expect(within(card()).getByText(label).tagName).toBe("SPAN");
    expect(within(card()).getByText("Court")).toHaveAttribute("data-active", "true");
    expect(within(card()).getByText("Friends")).not.toHaveAttribute("data-active");
    expect(within(card()).getByText("City")).not.toHaveAttribute("data-active");
    expect(within(card()).queryAllByRole("button")).toHaveLength(0);
  });

  it("names the board and the court", () => {
    render(<LadderCard T={0} />);
    expect(within(card()).getByText("Court · 1V1")).toBeInTheDocument();
    expect(within(card()).getByText("UCI Anteater Recreation Center")).toBeInTheDocument();
  });

  it("has four moving rows with decorative photos, hidden from screen readers", () => {
    render(<LadderCard T={0} />);
    const rows = within(card()).getAllByRole("listitem", { hidden: true }).filter((li) => li.querySelector("img"));
    expect(rows).toHaveLength(4);
    for (const r of rows) expect(r.querySelector("img")).toHaveAttribute("alt", "");
    expect(rows[0].closest("ul")).toHaveAttribute("aria-hidden", "true");
  });

  it("reads screen readers the ladder after the game, in rank order, whatever the beat", () => {
    const final = ["Giuseppi: 1301 MMR (+14), record 24-9", "Johnny: 1284 MMR (-12), record 21-9", "Andrew: 1251 MMR, record 18-10", "Dylan: 1218 MMR, record 15-11"];
    for (const T of [0, L_END]) {
      const { unmount } = render(<LadderCard T={T} />);
      const list = within(card()).getByRole("list", { name: "Court ladder after the game" });
      expect(within(list).getAllByRole("listitem").map((li) => li.textContent)).toEqual(final);
      expect(within(card()).getAllByRole("listitem")).toHaveLength(4);
      unmount();
    }
  });

  it("pairs each row's photo with its own player", () => {
    render(<LadderCard T={L_END} />);
    for (const name of ["Johnny", "Giuseppi", "Andrew", "Dylan"]) {
      expect(row(name).querySelector("img")?.getAttribute("src")).toContain(`/${name.toLowerCase()}.webp`);
    }
  });

  it("draws no divider under the row in the last slot, before and after the swap", () => {
    for (const T of [0, L_END]) {
      const { unmount } = render(<LadderCard T={T} />);
      expect(row("Dylan")).toHaveAttribute("data-last");
      for (const name of ["Johnny", "Giuseppi", "Andrew"]) expect(row(name)).not.toHaveAttribute("data-last");
      unmount();
    }
  });

  it("reserves every row's delta cell before any delta shows", () => {
    render(<LadderCard T={0} />);
    for (const name of ["Johnny", "Giuseppi", "Andrew", "Dylan"]) {
      expect(cell(name, "delta")).toBeInTheDocument();
      expect(cell(name, "delta")).toHaveStyle({ visibility: "hidden" });
    }
    expect(cell("Johnny", "rank").textContent).toBe("1");
    expect(cell("Giuseppi", "rank").textContent).toBe("2");
    expect([slot("Johnny"), slot("Giuseppi"), slot("Andrew"), slot("Dylan")]).toEqual(["0", "1", "2", "3"]);
  });

  it("ends with Giuseppi first, at 1301 and +14, tinted and in orange", () => {
    render(<LadderCard T={L_END} />);
    expect(cell("Giuseppi", "rank").textContent).toBe("1");
    expect(cell("Giuseppi", "mmr").textContent).toBe("1301");
    expect(cell("Giuseppi", "delta").textContent).toBe("+14");
    expect(cell("Giuseppi", "delta")).toHaveStyle({ visibility: "visible" });
    expect(within(row("Giuseppi")).getByText("24-9")).toBeInTheDocument();
    expect(slot("Giuseppi")).toBe("0");
    expect(row("Giuseppi")).toHaveStyle({ backgroundColor: "rgba(255, 106, 0, 0.08)" });
    expect(within(row("Giuseppi")).getByText("Giuseppi")).toHaveStyle({ color: BRAND });

    expect(cell("Johnny", "rank").textContent).toBe("2");
    expect(cell("Johnny", "mmr").textContent).toBe("1284");
    expect(cell("Johnny", "delta").textContent).toBe("-12");
    expect(slot("Johnny")).toBe("1");
  });

  it("puts the root ref on the card and the MMR ref on Giuseppi's MMR", () => {
    const rootRef = createRef<HTMLDivElement>();
    const mmrRef = createRef<HTMLSpanElement>();
    render(<LadderCard T={0} rootRef={rootRef} mmrRef={mmrRef} />);
    expect(rootRef.current).toBe(card());
    expect(mmrRef.current).toBe(cell("Giuseppi", "mmr"));
  });
});
