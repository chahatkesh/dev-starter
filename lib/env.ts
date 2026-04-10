import { z } from "zod";

const isValidUrl = (value: string) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

/**
 * Server-side environment variable validation
 *
 * IMPORTANT: This file should ONLY be imported in server-side code:
 * - API routes
 * - Server components
 * - Server actions
 * - Middleware
 *
 * Never import this in client components or client-side code.
 */

const envSchema = z.object({
  // Node Environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // Database
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .refine(isValidUrl, "DATABASE_URL must be a valid URL"),

  // Redis (optional)
  REDIS_URL: z
    .string()
    .optional()
    .refine(
      (value) => value === undefined || isValidUrl(value),
      "REDIS_URL must be a valid URL",
    ),

  // App URLs
  NEXT_PUBLIC_MAIN_APP_URL: z
    .string()
    .default("http://localhost:3000")
    .refine(isValidUrl, "NEXT_PUBLIC_MAIN_APP_URL must be a valid URL"),
  NEXT_PUBLIC_LANDING_URL: z
    .string()
    .default("http://localhost:3001")
    .refine(isValidUrl, "NEXT_PUBLIC_LANDING_URL must be a valid URL"),

  // Logging
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),

  // Email (Resend)
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),

  // Optional: External Services
  // Add your own service keys here as needed
  // STRIPE_SECRET_KEY: z.string().optional(),
  // AWS_ACCESS_KEY_ID: z.string().optional(),
  // AWS_SECRET_ACCESS_KEY: z.string().optional(),
});

/**
 * Validated and typed environment variables
 *
 * @throws {ZodError} if validation fails
 */
export const env = (() => {
  // Only validate on server-side
  if (globalThis.window !== undefined) {
    throw new TypeError(
      "env.ts should only be imported in server-side code. " +
        "Use process.env.NEXT_PUBLIC_* directly in client components.",
    );
  }

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    throw new TypeError(
      `Invalid environment variables: ${JSON.stringify(parsed.error.format())}`,
    );
  }

  return parsed.data;
})();

/**
 * Client-safe environment variables (NEXT_PUBLIC_* only)
 * Can be used in both server and client components
 */
export const publicEnv = {
  appUrl: process.env.NEXT_PUBLIC_MAIN_APP_URL || "http://localhost:3000",
  landingUrl: process.env.NEXT_PUBLIC_LANDING_URL || "http://localhost:3001",
} as const;
