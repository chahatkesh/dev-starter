import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import pg from "pg";
import { PrismaClient } from "../generated/prisma";

/**
 * Database Seeding Script
 *
 * This is a minimal seed file. Customize it based on your application needs.
 * Add your own seed data, reference data, or initial configuration here.
 */

// Load environment variables
dotenv.config({ path: "../../.env" });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting database seeding...");

  // Add your seed data here
  // Example: Create admin user, default categories, initial settings, etc.

  // Uncomment and modify as needed:
  /*
  const user = await prisma.user.create({
    data: {
      email: "admin@example.com",
      name: "Admin User",
      passwordHash: "your-hashed-password",
    },
  });
  console.log("Created user:", user.email);
  */

  console.log("Seeding completed successfully!");
}

main()
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
