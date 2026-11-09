import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Index from "./Index";

vi.mock("@/components/landing/Navbar", () => ({ default: () => <nav>navbar</nav> }));
vi.mock("@/components/landing/GameStage", () => ({ default: () => <section>hero</section> }));
// The lazy chunk's request fails, as on a flaky network or after a deploy replaced it.
vi.mock("@/components/landing/BelowFold", () => {
  throw new Error("Failed to fetch dynamically imported module");
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Index", () => {
  it("keeps the hero and logs the failure when the sections under it fail to load", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const { container } = render(<Index />);

    await waitFor(() => expect(error).toHaveBeenCalledWith(expect.stringContaining("[landing] Could not render the sections under the leaderboard"), expect.anything(), expect.anything()));
    expect(screen.getByText("hero")).toBeInTheDocument();
    expect(screen.getByText("navbar")).toBeInTheDocument();
    // The placeholder is gone too, so no empty screens are left under the hero.
    expect(container.querySelector("main")?.children).toHaveLength(2);
  });
});
