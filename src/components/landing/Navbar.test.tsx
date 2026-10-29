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
    expect(screen.getByRole("link", { name: "COMING SOON" })).toHaveAttribute("href", "/#download");
  });
});
