import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Hero from "./Hero";

describe("Hero", () => {
  it("keeps the headline and body copy word for word", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Talent doesn't wait for a camera crew.");
    expect(
      screen.getByText(
        "Clutch turns a phone in a courtside corner into a professional-grade analytics rig, built for the leagues that aren't on TV.",
      ),
    ).toBeInTheDocument();
  });

  it("summarizes the hidden court for screen readers", () => {
    const { container } = render(<Hero />);
    expect(
      screen.getByText("Example 1v1 game at the UCI Anteater Recreation Center: Giuseppi wins 11 to 7."),
    ).toHaveClass("sr-only");
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("shows the final card with Giuseppi selected", () => {
    render(<Hero />);
    expect(screen.getByRole("button", { name: /GIUSEPPI/ })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /JOHNNY/ })).toHaveAttribute("aria-pressed", "false");
  });

  it("hands the MMR ref to the card", () => {
    const mmrRef = createRef<HTMLSpanElement>();
    render(<Hero mmrRef={mmrRef} />);
    expect(mmrRef.current?.textContent).toBe("+14");
  });

  it("sets the layout on the section root", () => {
    const { container } = render(<Hero />);
    expect(container.firstElementChild).toHaveAttribute("data-layout");
  });

  it("drops the eyebrow lines", () => {
    render(<Hero />);
    expect(screen.queryByText(/BASKETBALL/)).toBeNull();
    expect(screen.queryByText(/VOL\. I/)).toBeNull();
    expect(screen.queryByText(/IRVINE/)).toBeNull();
  });
});
