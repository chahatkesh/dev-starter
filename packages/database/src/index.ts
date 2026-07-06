import "./load-root-env";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../generated/prisma";
import type { DatabaseConnectionConfig, DatabaseRuntime } from "./types";

type EnvironmentRecord = Record<string, string | undefined>;

const DEFAULT_DATABASE_URL =
  "postgresql://postgres:postgres@localhost:5432/dev_starter_dev";

function normalizeRuntime(value: string | undefined): DatabaseRuntime {
  if (value === "production" || value === "test" || value === "development") {
    return value;
  }

  if (!value) {
    return "development";
  }

  throw new Error(
    `Unsupported database runtime "${value}". Expected development, test, or production.`,
  );
}

export function getDatabaseConfig(
  env: EnvironmentRecord = process.env,
): DatabaseConnectionConfig {
  const runtime = normalizeRuntime(env.APP_ENV ?? env.NODE_ENV);
  const url = env.DATABASE_URL ?? "";

  return {
    runtime,
    url,
    ssl: runtime === "production",
    isConfigured: url.length > 0,
  };
}

export function getPrismaDatabaseUrl(
  env: EnvironmentRecord = process.env,
): string {
  const config = getDatabaseConfig(env);

  if (config.url) {
    return config.url;
  }

  if (config.runtime === "production") {
    throw new Error("DATABASE_URL is required in production.");
  }

  return DEFAULT_DATABASE_URL;
}

function createPrismaClient(env: EnvironmentRecord = process.env) {
  const config = getDatabaseConfig(env);
  const connectionString = getPrismaDatabaseUrl(env);
  const pool = new Pool({
    connectionString,
    ssl: config.ssl ? { rejectUnauthorized: false } : undefined,
  });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log:
      config.runtime === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export * from "../generated/prisma";
export type { DatabaseConnectionConfig, DatabaseRuntime } from "./types";
