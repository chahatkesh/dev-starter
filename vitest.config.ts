import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
      "@shared": path.resolve(__dirname, "packages/shared/src"),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    setupFiles: ["./tests/setup/vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: [
        "app/**/*.ts",
        "lib/**/*.ts",
        "packages/**/*.ts",
        "services/**/*.ts",
      ],
      exclude: ["tests/**", "**/*.d.ts"],
    },
  },
});
