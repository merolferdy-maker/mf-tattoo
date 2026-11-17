import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
try {
  await p.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "backgroundImage" TEXT`);
  console.log("OK: backgroundImage column added");
} finally {
  await p.$disconnect();
}