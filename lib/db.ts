import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("❌ DATABASE_URL is missing in .env");
}

// Create pg Pool (required by PrismaPg)
const pool = new Pool({
  connectionString,
});

// Pass pg Pool → PrismaPg → PrismaClient
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ["error", "warn"], // optional but helpful
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
