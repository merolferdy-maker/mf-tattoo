import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const m = await p.stockMovement.findFirst({ where: { notes: "__test_consume__" } });
if (m) {
  await p.stockMovement.delete({ where: { id: m.id } });
  console.log("deleted test movement", m.id);
}
await p.inkProduct.update({ where: { id: "cmwi9832f0005jk07962lefkx" }, data: { currentQuantity: 5 } });
console.log("restored BLACK qty to 5");
await p.$disconnect();
