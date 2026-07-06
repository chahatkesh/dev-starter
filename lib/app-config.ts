import { AppStrings } from "@shared/app-strings";

export const appConfig = {
  name: AppStrings.brand.name,
  healthPath: "/api/health",
  productionPort: 3000,
} as const;

export type AppEnvironment = "development" | "test" | "production";
export type EnvironmentRecord = Record<string, string | undefined>;

export function normalizeAppEnvironment(value: string | undefined) {
  if (value === "production" || value === "test" || value === "development") {
    return value;
  }

  if (!value) {
    return "development";
  }

  throw new Error(
    `Unsupported APP_ENV "${value}". Expected development, test, or production.`,
  );
}

export function getAppEnvironment(env: EnvironmentRecord = process.env) {
  return normalizeAppEnvironment(env.APP_ENV ?? env.NODE_ENV);
}
