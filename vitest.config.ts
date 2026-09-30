/**
 * vitest.config.ts
 *
 * Vitest configuration for the EventBrite test suite.
 *
 * Test structure (under __tests__/):
 *   unit/        — pure functions, no DB, no network
 *   integration/ — tests that hit the real Neon DB (.env.local required)
 *   concurrency/ — concurrent registration race condition tests
 *
 * Path aliases (@/) mirror the tsconfig paths so test imports match
 * source imports exactly — no test-only import conventions.
 *
 * Environment: node (not jsdom) — all tested code is server-side.
 * Coverage provider: v8 (no instrumentation overhead, built into Node).
 */

import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    // Shard-friendly: unit tests run first, then integration
    sequence: {
      concurrent: false,
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: [
        "lib/**/*.ts",
        "app/api/**/*.ts",
      ],
      exclude: [
        "lib/events.ts",       // static data file, not logic
        "**/*.d.ts",
        "**/__tests__/**",
      ],
      thresholds: {
        lines:     70,
        functions: 70,
        branches:  60,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
})
