import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const stmts = [
  `ALTER TABLE "PortfolioEntry" ADD COLUMN IF NOT EXISTS "sortOrder" INTEGER NOT NULL DEFAULT 0`,
];
try {
  for (const sql of stmts) {
    await p.$executeRawUnsafe(sql);
    console.log("OK:", sql);
  }
  // backfill sortOrder by sessionDate desc per user
  const users = await p.$queryRawUnsafe(`SELECT DISTINCT "userId" FROM "PortfolioEntry"`);
  for (const u of users) {
    const rows = await p.$queryRawUnsafe(`SELECT id FROM "PortfolioEntry" WHERE "userId" = $1 ORDER BY "sessionDate" DESC, id ASC`, u.userId);
    let i = 0;
    for (const r of rows) {
      await p.$executeRawUnsafe(`UPDATE "PortfolioEntry" SET "sortOrder" = $1 WHERE id = $2`, i++, r.id);
    }
  }
  console.log("backfilled");
} finally {
  await p.$disconnect();
}
