import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";

const renderNavbar = () =>
  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Navbar />
    </MemoryRouter>,
  );

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
});
