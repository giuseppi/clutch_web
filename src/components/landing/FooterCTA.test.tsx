import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetEntrance, settleEntrance } from "@/test/entrance";
import { setIntersection } from "@/test/intersection";
import { firstShown, sampleOpacities } from "@/test/reveal";
import FooterCTA from "./FooterCTA";

vi.mock("@/lib/entrance", () => import("@/test/entrance"));

afterEach(() => {
  vi.restoreAllMocks();
  resetEntrance();
});

function renderSection() {
  const { container } = render(<FooterCTA />);
  const firstWord = screen.getByText("Track");
  const group = screen.getAllByRole("heading")[0].parentElement as HTMLElement;
  const formBlock = container.querySelector("form")?.parentElement as HTMLElement;
  return { group, formBlock, opacities: () => [Number(firstWord.style.opacity), Number(formBlock.style.opacity)] };
}

describe("FooterCTA", () => {
  it("waits for the entrance to settle, then reveals the headline and only after it the form", async () => {
    const { group, formBlock, opacities } = renderSection();
    // Both on screen at once, as on a load of /#download.
    act(() => {
      setIntersection(group, 1);
      setIntersection(formBlock, 1);
    });
    const before = await sampleOpacities(opacities, 600);
    expect(before.every(([head, form]) => head === 0 && form === 0)).toBe(true);

    act(() => settleEntrance());
    const after = await sampleOpacities(opacities, 1400);
    const head = firstShown(after, 0);
    const form = firstShown(after, 1);
    expect(head).toBeGreaterThanOrEqual(0);
    expect(form).toBeGreaterThan(head);
    // The form never shows while the headline is still hidden.
    expect(after.every(([h, f]) => f === 0 || h > 0)).toBe(true);
  });

  it("sends the email to the beta list and thanks the visitor", async () => {
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response());
    renderSection();
    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "a@b.co" } });
    fireEvent.click(screen.getByRole("button", { name: "GET IN TOUCH" }));

    expect(await screen.findByText(/YOU'RE ON THE LIST/)).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("docs.google.com/forms"), expect.objectContaining({ method: "POST", body: "entry.2010243805=a%40b.co" }));
  });

  it("asks the visitor to try again when the email cannot be sent, and logs why", async () => {
    const failure = new TypeError("Failed to fetch");
    vi.spyOn(globalThis, "fetch").mockRejectedValue(failure);
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    renderSection();
    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "a@b.co" } });
    fireEvent.click(screen.getByRole("button", { name: "GET IN TOUCH" }));

    expect(await screen.findByText("Something went wrong. Try again.")).toBeInTheDocument();
    expect(error).toHaveBeenCalledWith("[landing] The beta form could not send the email:", failure);
  });
});
