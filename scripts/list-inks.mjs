import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const rows = await p.inkProduct.findMany();
console.log(`INKS: ${rows.length}`);
for (const x of rows) console.log(JSON.stringify(x));
await p.$disconnect();
