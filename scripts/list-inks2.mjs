import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const rows = await p.inkProduct.findMany({ select: { id: true, userId: true, brand: true, productName: true, colorName: true, currentQuantity: true, createdAt: true } });
console.log(`INKS: ${rows.length}`);
for (const r of rows) console.log(JSON.stringify(r));
await p.$disconnect();
