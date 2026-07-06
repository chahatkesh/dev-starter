import {
  appConfig,
  getAppEnvironment,
  type EnvironmentRecord,
} from "@/lib/app-config";

export function getRequiredEnv(
  name: string,
  env: EnvironmentRecord = process.env,
) {
  const value = env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const publicEnv = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? appConfig.name,
} as const;

export const env = {
  appEnvironment: getAppEnvironment(),
  nodeEnv: process.env.NODE_ENV ?? "development",
  databaseUrl: process.env.DATABASE_URL,
} as const;
