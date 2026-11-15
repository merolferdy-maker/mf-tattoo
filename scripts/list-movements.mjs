import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const rows = await p.stockMovement.findMany({ orderBy: { createdAt: "desc" } });
console.log(`MOVEMENTS: ${rows.length}`);
for (const r of rows) console.log(`${r.createdAt.toISOString()} | type=${r.type} | itemType=${r.itemType} | itemName=${r.itemName} | qty=${r.quantity}`);
const inks = await p.inkProduct.findMany({ select: { id: true, brand: true, productName: true, colorName: true, currentQuantity: true } });
console.log("\nINKS:");
for (const i of inks) console.log(`${i.brand} ${i.colorName} (${i.productName}) qty=${i.currentQuantity} id=${i.id}`);
await p.$disconnect();
