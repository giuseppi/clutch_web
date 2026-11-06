import { act, render } from "@testing-library/react";
import { useReducedMotion } from "framer-motion";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setIntersection } from "@/test/intersection";
import { DemoVideo } from "./DemoVideo";

vi.mock("framer-motion", async (orig) => ({
  ...(await orig<typeof import("framer-motion")>()),
  useReducedMotion: vi.fn(() => false),
}));

const play = vi.fn(() => Promise.resolve());
const pause = vi.fn();

beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(play);
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(pause);
});

afterEach(() => {
  vi.restoreAllMocks();
  play.mockClear();
  pause.mockClear();
  vi.mocked(useReducedMotion).mockReturnValue(false);
});

const getVideo = (container: HTMLElement) => container.querySelector("video") as HTMLVideoElement;

describe("DemoVideo", () => {
  it("is muted, looping, inline, with a poster and no autoplay", () => {
    const { container } = render(<DemoVideo />);
    const video = getVideo(container);
    expect(video.muted).toBe(true);
    expect(video.loop).toBe(true);
    expect(video.hasAttribute("playsinline")).toBe(true);
    expect(video).toHaveAttribute("poster", "/clutch-demo-poster.jpg");
    expect(video.hasAttribute("autoplay")).toBe(false);
  });

  it("plays on screen and pauses off screen", () => {
    const { container } = render(<DemoVideo />);
    const video = getVideo(container);
    act(() => setIntersection(video, 0.5));
    expect(play).toHaveBeenCalled();
    act(() => setIntersection(video, 0));
    expect(pause).toHaveBeenCalled();
  });

  it("never plays under reduced motion", () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    const { container } = render(<DemoVideo />);
    act(() => setIntersection(getVideo(container), 0.5));
    expect(play).not.toHaveBeenCalled();
  });
});
