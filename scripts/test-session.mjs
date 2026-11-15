import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const s = await p.sessionLog.findFirst({ where: { notes: "__test_session__" }, orderBy: { createdAt: "desc" } });
console.log("FOUND:", JSON.stringify(s));
if (s) {
  await p.sessionLog.delete({ where: { id: s.id } });
  console.log("deleted test session");
}
await p.$disconnect();
