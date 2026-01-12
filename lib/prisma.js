import { PrismaClient } from "@prisma/client";

/**
 * Global Prisma instance
 * Prevents multiple instances in development (Next.js hot reload)
 */
const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;