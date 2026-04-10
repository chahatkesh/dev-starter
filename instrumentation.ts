/**
 * Instrumentation hooks for runtime setup
 * This file runs when the Node.js process starts
 */

export async function register() {
  // Only run in Node.js runtime, not in Edge
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./lib/env");
    if (process.env.NODE_ENV === "development") {
      const { setupLogger } = await import("./lib/logger");
      setupLogger();
    }
  }
}
