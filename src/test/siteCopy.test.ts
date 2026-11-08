const sources = import.meta.glob(
  ["/src/components/landing/**/*.tsx", "/src/pages/*.tsx", "/index.html", "!**/*.test.tsx"],
  { query: "?raw", import: "default", eager: true },
) as Record<string, string>;

const css = import.meta.glob("/src/index.css", { query: "?raw", import: "default", eager: true })["/src/index.css"] as string;
const html = sources["/index.html"];
const files = Object.entries(sources);

describe("site copy and type system", () => {
  it("self-hosts and preloads Geist and Geist Mono and loads no other family", () => {
    const faces = css.match(/@font-face\s*{[^}]*}/g) ?? [];
    expect(faces).toHaveLength(2);
    expect(faces[0]).toMatch(/font-family: "Geist";[^}]*font-weight: 400 600;[^}]*geist-latin-wght-normal\.woff2/);
    expect(faces[1]).toMatch(/font-family: "Geist Mono";[^}]*font-weight: 400 500;[^}]*geist-mono-latin-wght-normal\.woff2/);
    for (const file of ["geist/files/geist-latin", "geist-mono/files/geist-mono-latin"]) {
      const href = `/node_modules/@fontsource-variable/${file}-wght-normal.woff2`;
      expect(html).toContain(`<link rel="preload" as="font" type="font/woff2" href="${href}" crossorigin />`);
    }
    expect(html).not.toMatch(/fonts\.googleapis|fonts\.gstatic/);
    expect(html + css).not.toMatch(/Inter|JetBrains|Material/);
  });

  it.each(files)("%s has no em dash", (_name, src) => {
    expect(src).not.toContain("—");
  });

  it.each(files)("%s uses no italics or unloaded weights", (_name, src) => {
    expect(src).not.toMatch(/\b(italic|font-light|font-thin|font-bold|font-extrabold)\b/);
  });
});
