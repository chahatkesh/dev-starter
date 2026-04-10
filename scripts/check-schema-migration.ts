#!/usr/bin/env tsx

/**
 * Schema Migration Check
 *
 * This script verifies that schema changes are accompanied by migration files.
 * It prevents accidental schema modifications without proper versioning.
 *
 * Usage:
 *   - In pre-commit hook: Checks staged schema changes
 *   - In CI/CD: Checks all schema changes in the branch
 */

import { execSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const SCHEMA_PATH = "packages/database/prisma/schema.prisma";
const MIGRATIONS_DIR = "packages/database/prisma/migrations";

interface CheckResult {
  schemaChanged: boolean;
  newMigrations: string[];
  error?: string;
}

function execCommand(command: string, ignoreError = false): string {
  try {
    return execSync(command, { encoding: "utf-8", stdio: "pipe" }).trim();
  } catch (error) {
    if (ignoreError) return "";
    throw error;
  }
}

function _getLatestMigrationTime(): number | null {
  if (!existsSync(MIGRATIONS_DIR)) {
    return null;
  }

  const migrations = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.match(/^\d{14}_/))
    .map((f) => {
      const stats = statSync(join(MIGRATIONS_DIR, f));
      return { name: f, time: stats.mtimeMs };
    })
    .sort((a, b) => b.time - a.time);

  return migrations.length > 0 ? migrations[0].time : null;
}

function checkSchemaChanges(mode: "pre-commit" | "ci"): CheckResult {
  const result: CheckResult = {
    schemaChanged: false,
    newMigrations: [],
  };

  // Check if schema file exists
  if (!existsSync(SCHEMA_PATH)) {
    result.error = `Schema file not found at ${SCHEMA_PATH}`;
    return result;
  }

  // Get schema changes
  let schemaDiff: string;

  if (mode === "pre-commit") {
    // Check staged changes
    const stagedFiles = execCommand("git diff --cached --name-only", true);
    if (!stagedFiles.includes(SCHEMA_PATH)) {
      return result; // Schema not in staged files
    }

    schemaDiff = execCommand(`git diff --cached ${SCHEMA_PATH}`, true);
  } else {
    // CI mode: Check changes from base branch
    const baseBranch = process.env.GITHUB_BASE_REF || "main";

    // Fetch base branch for comparison
    execCommand(`git fetch origin ${baseBranch}:${baseBranch} --depth=1`, true);

    schemaDiff = execCommand(
      `git diff origin/${baseBranch}...HEAD ${SCHEMA_PATH}`,
      true,
    );
  }

  if (!schemaDiff || schemaDiff.trim() === "") {
    return result; // No schema changes
  }

  // Schema has changed
  result.schemaChanged = true;

  if (mode === "pre-commit") {
    // Check if any migration files are staged
    const stagedFiles = execCommand("git diff --cached --name-only", true);
    const stagedMigrations = stagedFiles
      .split("\n")
      .filter(
        (f) => f.startsWith(MIGRATIONS_DIR) && f.includes("/migration.sql"),
      );

    result.newMigrations = stagedMigrations;
  } else {
    // CI mode: Check for new migration directories
    if (existsSync(MIGRATIONS_DIR)) {
      // Get migrations from the diff
      const baseBranch = process.env.GITHUB_BASE_REF || "main";
      const newFiles = execCommand(
        `git diff --name-only origin/${baseBranch}...HEAD`,
        true,
      );

      const newMigrationDirs = newFiles
        .split("\n")
        .filter(
          (f) => f.startsWith(MIGRATIONS_DIR) && f.includes("/migration.sql"),
        )
        .map((f) => f.split("/")[3]); // Extract migration directory name

      result.newMigrations = [...new Set(newMigrationDirs)];
    }
  }

  return result;
}

function formatError(result: CheckResult, mode: "pre-commit" | "ci"): string {
  const messages: string[] = [];

  messages.push("\n❌ Schema change detected without migration file!\n");
  messages.push(`Schema file changed: ${SCHEMA_PATH}`);
  messages.push(`New migrations found: ${result.newMigrations.length}\n`);

  if (mode === "pre-commit") {
    messages.push("To fix this:");
    messages.push("  1. Run: pnpm db:migrate");
    messages.push("  2. Enter a descriptive name for your migration");
    messages.push(
      "  3. Stage the new migration files: git add packages/database/prisma/migrations",
    );
    messages.push("  4. Commit again\n");
    messages.push(
      '💡 Tip: Never use "pnpm db:push" - always create migrations!\n',
    );
  } else {
    messages.push("CI Check Failed:");
    messages.push("  - Schema changes must include migration files");
    messages.push('  - Run "pnpm db:migrate" locally before pushing');
    messages.push("  - Ensure migration files are committed\n");
  }

  return messages.join("\n");
}

function main() {
  const mode = process.env.CI ? "ci" : "pre-commit";

  console.log(`🔍 Checking schema changes (${mode} mode)...`);

  try {
    const result = checkSchemaChanges(mode);

    if (result.error) {
      console.error(`\n❌ Error: ${result.error}\n`);
      process.exit(1);
    }

    if (!result.schemaChanged) {
      console.log("✅ No schema changes detected\n");
      process.exit(0);
    }

    if (result.schemaChanged && result.newMigrations.length === 0) {
      console.error(formatError(result, mode));
      process.exit(1);
    }

    console.log("✅ Schema changes have corresponding migration files:");
    for (const migration of result.newMigrations) {
      console.log(`   - ${migration}`);
    }
    console.log("");
    process.exit(0);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`\n❌ Script error: ${error.message}\n`);
    }
    process.exit(1);
  }
}

main();
