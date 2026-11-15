import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
try {
  await p.$executeRawUnsafe('ALTER TABLE "SessionLog" ADD COLUMN IF NOT EXISTS "washType" TEXT');
  console.log("column washType ensured");
} finally {
  await p.$disconnect();
}
