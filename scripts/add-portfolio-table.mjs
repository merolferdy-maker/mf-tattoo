import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const stmts = [
  `CREATE TABLE IF NOT EXISTS "PortfolioEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "machineId" TEXT,
    "washType" TEXT,
    "notes" TEXT,
    "imageUrls" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PortfolioEntry_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE INDEX IF NOT EXISTS "PortfolioEntry_userId_idx" ON "PortfolioEntry"("userId")`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PortfolioEntry_userId_fkey') THEN
      ALTER TABLE "PortfolioEntry" ADD CONSTRAINT "PortfolioEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
  END $$`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PortfolioEntry_machineId_fkey') THEN
      ALTER TABLE "PortfolioEntry" ADD CONSTRAINT "PortfolioEntry_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
  END $$`,
];
try {
  for (const sql of stmts) {
    await p.$executeRawUnsafe(sql);
    console.log("OK:", sql.split("\n")[0].slice(0, 70));
  }
} finally {
  await p.$disconnect();
}
