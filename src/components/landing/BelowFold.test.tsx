import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import BelowFold from "./BelowFold";

vi.mock("./FeaturesPolaroidGrid", () => ({ default: () => <div id="features" /> }));
vi.mock("./HowItWorksRail", () => ({ default: () => <div id="how-it-works" /> }));
vi.mock("./PullQuote", () => ({ default: () => <div /> }));
vi.mock("./FooterCTA", () => ({ default: () => <div id="download" /> }));
vi.mock("./Footer", () => ({ default: () => <footer /> }));

const scrolled: string[] = [];

function load(hash: string, type: NavigationTimingType) {
  window.history.replaceState(null, "", `/${hash}`);
  Object.defineProperty(performance, "getEntriesByType", { configurable: true, value: () => [{ type }] });
  render(<BelowFold />);
}

beforeEach(() => {
  Element.prototype.scrollIntoView = function (this: Element) {
    scrolled.push(this.id);
  };
});

afterEach(() => {
  scrolled.length = 0;
  window.history.replaceState(null, "", "/");
  delete (Element.prototype as Partial<Element>).scrollIntoView;
  delete (performance as Partial<Performance>).getEntriesByType;
});

describe("BelowFold", () => {
  it("lands a page load of /#download on the beta form once the sections exist", () => {
    load("#download", "navigate");
    expect(scrolled).toEqual(["download"]);
  });

  it("leaves a reload or a back and forward to the browser's own scroll restoration", () => {
    load("#features", "reload");
    load("#features", "back_forward");
    expect(scrolled).toEqual([]);
  });

  it("ignores a malformed hash instead of throwing", () => {
    expect(() => load("#%", "navigate")).not.toThrow();
    expect(() => load("#%E0%A4%A", "navigate")).not.toThrow();
    expect(scrolled).toEqual([]);
  });

  it("does nothing without a hash", () => {
    load("", "navigate");
    expect(scrolled).toEqual([]);
  });
});
