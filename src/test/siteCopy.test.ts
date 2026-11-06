const REPLACED_LATER = ["Hero.tsx", "BallZoom.tsx", "AROverlay.tsx", "Loader.tsx"];

const sources = import.meta.glob(
  ["/src/components/landing/**/*.tsx", "/src/pages/*.tsx", "/index.html", "!**/*.test.tsx"],
  { query: "?raw", import: "default", eager: true },
) as Record<string, string>;

const html = sources["/index.html"];
const files = Object.entries(sources).filter(
  ([path]) => !REPLACED_LATER.some((name) => path.endsWith(`/${name}`)),
);

describe("site copy and type system", () => {
  it("loads Geist and Geist Mono and no other family", () => {
    expect(html).toContain("family=Geist:wght@400;500;600");
    expect(html).toContain("family=Geist+Mono:wght@400;500");
    expect(html).not.toMatch(/Inter|JetBrains|Material/);
  });

  it.each(files)("%s has no em dash", (_name, src) => {
    expect(src).not.toContain("—");
  });

  it.each(files)("%s uses no italics or unloaded weights", (_name, src) => {
    expect(src).not.toMatch(/\b(italic|font-light|font-thin|font-bold|font-extrabold)\b/);
  });
});
