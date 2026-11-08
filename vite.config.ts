import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

/*
  The landing page's sections under the leaderboard are a lazy chunk (BelowFold), which keeps
  the main JS under 500 kB. Preloading it next to the main JS lets it mount right after the
  first render, before the entrance starts, instead of dropping a frame in the entrance.
*/
const preloadBelowFold = (): Plugin => ({
  name: "preload-below-fold",
  apply: "build",
  transformIndexHtml: {
    order: "post",
    handler(_html, { bundle }) {
      const chunk = Object.values(bundle ?? {}).find((c) => c.type === "chunk" && c.name === "BelowFold");
      if (!chunk) throw new Error("preload-below-fold: the build has no BelowFold chunk");
      return [{ tag: "link", attrs: { rel: "modulepreload", crossorigin: true, href: `/${chunk.fileName}` }, injectTo: "head" }];
    },
  },
});

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), preloadBelowFold()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
