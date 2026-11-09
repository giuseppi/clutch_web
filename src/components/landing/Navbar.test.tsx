import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, vi } from "vitest";
import { useEntranceStart } from "@/lib/entrance";
import Navbar from "./Navbar";

vi.mock("@/lib/entrance", () => ({ useEntranceStart: vi.fn(() => false) }));

afterEach(() => {
  vi.mocked(useEntranceStart).mockClear();
  vi.mocked(useEntranceStart).mockReturnValue(false);
});

const nav = (animateIn?: boolean) => (
  <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Navbar animateIn={animateIn} />
  </MemoryRouter>
);

const renderNavbar = (animateIn?: boolean) => render(nav(animateIn));

describe("Navbar", () => {
  it("routes the brand mark home and the contact link to /contact", () => {
    renderNavbar();
    expect(screen.getByRole("link", { name: /clutch/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /contact us/i })).toHaveAttribute("href", "/contact");
  });

  it("anchors the section links to the landing page sections", () => {
    renderNavbar();
    expect(screen.getByRole("link", { name: "FEATURES" })).toHaveAttribute("href", "/#features");
    expect(screen.getByRole("link", { name: "HOW IT WORKS" })).toHaveAttribute("href", "/#how-it-works");
  });

  it("has one Coming soon control, a link to the beta form", () => {
    renderNavbar();
    const links = screen.getAllByRole("link", { name: /coming soon/i });
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", "/#download");
    expect(screen.queryByRole("button", { name: /coming soon/i })).toBeNull();
  });

  it("stays hidden until the entrance starts when it animates in", () => {
    renderNavbar(true);
    expect(useEntranceStart).toHaveBeenCalled();
    expect(screen.getByRole("navigation")).toHaveStyle({ opacity: "0" });
  });

  it("fades in once the entrance starts", async () => {
    const { rerender } = renderNavbar(true);
    expect(screen.getByRole("navigation")).toHaveStyle({ opacity: "0" });
    vi.mocked(useEntranceStart).mockReturnValue(true);
    rerender(nav(true));
    await waitFor(() => expect(screen.getByRole("navigation")).toHaveStyle({ opacity: "1" }), { timeout: 1500 });
  });

  it("starts final when it mounts after the entrance, as on a return to the page", () => {
    vi.mocked(useEntranceStart).mockReturnValue(true);
    renderNavbar(true);
    expect(screen.getByRole("navigation")).toHaveStyle({ opacity: "1" });
  });

  it("shows at once and never waits for the entrance by default", () => {
    renderNavbar();
    expect(useEntranceStart).not.toHaveBeenCalled();
    expect(screen.getByRole("navigation").getAttribute("style")).toBeNull();
  });
});
