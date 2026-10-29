import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ContactPage from "./ContactPage";

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={["/contact"]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ContactPage />
    </MemoryRouter>,
  );

describe("ContactPage", () => {
  it("shows the team heading", () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Meet the team");
  });

  it("names each team member", () => {
    renderPage();
    for (const name of ["Johnny Fok", "Giuseppi Pelayo", "Dylan Nguyen", "Andrew Espinosa"]) {
      expect(screen.getByRole("heading", { name })).toBeInTheDocument();
    }
  });

  it("links every team member to a LinkedIn profile in a new tab", () => {
    renderPage();
    const cards = screen.getAllByRole("link", { name: /LinkedIn Profile/i });
    expect(cards).toHaveLength(4);
    for (const card of cards) {
      expect(card).toHaveAttribute("href", expect.stringMatching(/^https:\/\/www\.linkedin\.com\/in\//));
      expect(card).toHaveAttribute("target", "_blank");
      expect(card).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("links back to the landing page", () => {
    renderPage();
    expect(screen.getByRole("link", { name: /back to home/i })).toHaveAttribute("href", "/");
  });
});
