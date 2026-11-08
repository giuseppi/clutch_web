import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    // CSS imports are empty in tests; let the raw index.css through for the font-face test.
    css: { include: [/\/src\/index\.css\?raw/] },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
