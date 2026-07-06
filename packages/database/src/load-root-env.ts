import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const repoRoot = path.resolve(packageRoot, "../..");
const envPath = path.join(repoRoot, ".env");

if (existsSync(envPath)) {
  config({ path: envPath });
}
