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

  it("has four rows with decorative photos", () => {
    render(<LadderCard T={0} />);
    const rows = within(card()).getAllByRole("listitem");
    expect(rows).toHaveLength(4);
    for (const r of rows) expect(r.querySelector("img")).toHaveAttribute("alt", "");
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
