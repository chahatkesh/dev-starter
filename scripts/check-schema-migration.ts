#!/usr/bin/env tsx

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const SCHEMA_PATH = "packages/database/prisma/schema.prisma";
const MIGRATIONS_DIR = "packages/database/prisma/migrations";

type CheckMode = "pre-commit" | "ci";

type CheckResult = {
  schemaChanged: boolean;
  newMigrations: string[];
  invalidMigrations: string[];
  error?: string;
};

function execGit(args: string[], ignoreError = false): string {
  try {
    return execFileSync("git", args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch (error) {
    if (ignoreError) {
      return "";
    }

    throw error;
  }
}

function getInvalidMigrationDirectories(): string[] {
  if (!existsSync(MIGRATIONS_DIR)) {
    return [];
  }

  return readdirSync(MIGRATIONS_DIR)
    .filter((entry) => /^\d{14}_/.test(entry))
    .filter((entry) => {
      const migrationPath = join(MIGRATIONS_DIR, entry);

      if (!statSync(migrationPath).isDirectory()) {
        return false;
      }

      return !existsSync(join(migrationPath, "migration.sql"));
    });
}

function getChangedFiles(mode: CheckMode): string {
  if (mode === "pre-commit") {
    return execGit(["diff", "--cached", "--name-only"], true);
  }

  const baseBranch = process.env.GITHUB_BASE_REF || "main";
  execGit(
    ["fetch", "origin", `${baseBranch}:${baseBranch}`, "--depth=1"],
    true,
  );

  return execGit(["diff", "--name-only", `origin/${baseBranch}...HEAD`], true);
}

function getSchemaDiff(mode: CheckMode): string {
  if (mode === "pre-commit") {
    return execGit(["diff", "--cached", "--", SCHEMA_PATH], true);
  }

  const baseBranch = process.env.GITHUB_BASE_REF || "main";
  return execGit(
    ["diff", `origin/${baseBranch}...HEAD`, "--", SCHEMA_PATH],
    true,
  );
}

function getMigrationFiles(changedFiles: string): string[] {
  return changedFiles
    .split("\n")
    .map((file) => file.trim())
    .filter(
      (file) =>
        file.startsWith(`${MIGRATIONS_DIR}/`) &&
        file.endsWith("/migration.sql"),
    );
}

function checkSchemaChanges(mode: CheckMode): CheckResult {
  const result: CheckResult = {
    schemaChanged: false,
    newMigrations: [],
    invalidMigrations: getInvalidMigrationDirectories(),
  };

  if (!existsSync(SCHEMA_PATH)) {
    result.error = `Schema file not found at ${SCHEMA_PATH}`;
    return result;
  }

  const changedFiles = getChangedFiles(mode);

  if (!changedFiles.split("\n").includes(SCHEMA_PATH)) {
    return result;
  }

  const schemaDiff = getSchemaDiff(mode);

  if (!schemaDiff.trim()) {
    return result;
  }

  result.schemaChanged = true;
  result.newMigrations = getMigrationFiles(changedFiles);

  return result;
}

function formatInvalidMigrationError(invalidMigrations: string[]): string {
  const messages = [
    "",
    "Invalid migration directories detected.",
    "",
    "Each timestamped migration directory must contain a migration.sql file.",
    "Invalid directories:",
    ...invalidMigrations.map(
      (migration) => `  - ${join(MIGRATIONS_DIR, migration)}`,
    ),
    "",
    "To fix this:",
    "  1. Delete incomplete migration directories.",
    '  2. Re-run "pnpm db:migrate" to generate a valid migration.',
    "  3. Commit the resulting migration.sql file.",
    "",
  ];

  return messages.join("\n");
}

function formatMissingMigrationError(
  result: CheckResult,
  mode: CheckMode,
): string {
  const messages = [
    "",
    "Schema change detected without a migration file.",
    "",
    `Schema file changed: ${SCHEMA_PATH}`,
    `New migrations found: ${result.newMigrations.length}`,
    "",
  ];

  if (mode === "pre-commit") {
    messages.push(
      "To fix this:",
      "  1. Run: pnpm db:migrate",
      "  2. Enter a descriptive name for the migration.",
      `  3. Stage the new migration files: git add ${MIGRATIONS_DIR}`,
      "  4. Commit again.",
      "",
      'Tip: Use "pnpm db:push" only for disposable local experiments; committed schema changes need migrations.',
      "",
    );
  } else {
    messages.push(
      "CI check failed:",
      "  - Schema changes must include migration files.",
      '  - Run "pnpm db:migrate" locally before pushing.',
      "  - Ensure migration files are committed.",
      "",
    );
  }

  return messages.join("\n");
}

function main() {
  const mode: CheckMode = process.env.CI ? "ci" : "pre-commit";

  console.log(`Checking schema changes (${mode} mode)...`);

  try {
    const result = checkSchemaChanges(mode);

    if (result.error) {
      console.error(`\nError: ${result.error}\n`);
      process.exit(1);
    }

    if (result.invalidMigrations.length > 0) {
      console.error(formatInvalidMigrationError(result.invalidMigrations));
      process.exit(1);
    }

    if (!result.schemaChanged) {
      console.log("No schema changes detected.\n");
      process.exit(0);
    }

    if (result.newMigrations.length === 0) {
      console.error(formatMissingMigrationError(result, mode));
      process.exit(1);
    }

    console.log("Schema changes have corresponding migration files:");
    for (const migration of result.newMigrations) {
      console.log(`  - ${migration}`);
    }
    console.log("");
    process.exit(0);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`\nScript error: ${error.message}\n`);
    } else {
      console.error(`\nScript error: ${String(error)}\n`);
    }

    process.exit(1);
  }
}

main();
