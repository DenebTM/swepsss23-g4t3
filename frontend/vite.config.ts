import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "./dist",
  },
  server: {
    port: 3000,
  },
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./config/jest/jest-setup.ts",
    reporters: ["vitest-sonar-reporter", "default"],
    outputFile: "sonar-report.xml",
    coverage: {
      reporter: ["text", "text-summary", "html", "lcovonly"],
      exclude: [
        "node_modules/",
        "config/jest/jest-setup.ts",
        "src/tests",
        "src/api/testData.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@component-lib": path.resolve(__dirname, "./src/components/lib"),
      "~": path.resolve(__dirname, "./src"),
    },
  },
});
