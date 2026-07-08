import { describe, expect, it } from "vitest";
import {
  getDatabaseConfig,
  getPrismaDatabaseUrl,
} from "@/packages/database/src";

describe("getDatabaseConfig", () => {
  it("marks the database as unconfigured without DATABASE_URL", () => {
    expect(getDatabaseConfig({ APP_ENV: "test" })).toEqual({
      runtime: "test",
      url: "",
      ssl: false,
      isConfigured: false,
    });
  });

  it("uses production SSL for the production runtime", () => {
    expect(
      getDatabaseConfig({
        APP_ENV: "production",
        DATABASE_URL: "postgresql://example.invalid/app",
      }),
    ).toMatchObject({
      runtime: "production",
      ssl: true,
      isConfigured: true,
    });
  });

  it("falls back to the local Docker URL outside production", () => {
    expect(getPrismaDatabaseUrl({ APP_ENV: "development" })).toBe(
      "postgresql://postgres:postgres@localhost:5432/dev_starter_dev",
    );
  });

  it("requires DATABASE_URL for the production Prisma client", () => {
    expect(() => getPrismaDatabaseUrl({ APP_ENV: "production" })).toThrow(
      /DATABASE_URL is required/,
    );
  });

  it("rejects staging as a runtime contract", () => {
    expect(() => getDatabaseConfig({ APP_ENV: "staging" })).toThrow(
      /Expected development, test, or production/,
    );
  });
});
