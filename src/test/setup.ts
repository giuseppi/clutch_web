import "@testing-library/jest-dom/vitest";
import { installIntersectionObserver, resetIntersections } from "./intersection";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

installIntersectionObserver();

afterEach(() => {
  resetIntersections();
});
