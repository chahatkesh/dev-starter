import "../src/load-root-env";
import { AppStrings } from "@shared/app-strings";
import { hashPassword } from "../../../lib/auth/password";
import { prisma } from "../src";

function writeInfo(message: string) {
  process.stdout.write(`${message}\n`);
}

function getAdminSeedCredentials() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    return null;
  }

  return { email, password };
}

async function main() {
  const adminCredentials = getAdminSeedCredentials();

  if (!adminCredentials) {
    writeInfo(AppStrings.seed.skipAdminSeed);
    writeInfo(AppStrings.seed.completed);
    return;
  }

  const passwordHash = await hashPassword(adminCredentials.password);

  await prisma.user.upsert({
    where: { email: adminCredentials.email },
    update: {
      passwordHash,
      role: "ADMIN",
    },
    create: {
      email: adminCredentials.email,
      passwordHash,
      role: "ADMIN",
    },
  });

  writeInfo(AppStrings.seededAdminAccount(adminCredentials.email));
  writeInfo(AppStrings.seed.completed);
}

void main()
  .catch((error: unknown) => {
    process.stderr.write(`${AppStrings.seed.failed}\n`);

    if (error instanceof Error) {
      process.stderr.write(`${error.message}\n`);
    } else {
      process.stderr.write(`${String(error)}\n`);
    }

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
