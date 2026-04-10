import pino from "pino";

/**
 * Determine if running in development
 */
const isDevelopment = process.env.NODE_ENV === "development";

/**
 * Pino logger configuration
 * - Development: Pretty print to console
 * - Production: JSON output for log aggregation
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || (isDevelopment ? "debug" : "info"),

  // Use pino-pretty only in local development
  ...(isDevelopment
    ? {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss",
            ignore: "pid,hostname",
            singleLine: false,
          },
        },
      }
    : {}),

  // Add timestamp
  timestamp: pino.stdTimeFunctions.isoTime,

  // Base context
  base: {
    env: process.env.NODE_ENV || "development",
  },
});

/**
 * Setup function called from instrumentation.ts
 */
export function setupLogger() {
  logger.info("Logger initialized");
}

export default logger;
