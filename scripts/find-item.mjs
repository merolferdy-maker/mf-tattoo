import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function show(label, rows) {
  console.log(`\n=== ${label} (${rows.length}) ===`);
  for (const r of rows) console.log(JSON.stringify(r));
}

const inkContains = await prisma.inkProduct.findMany({
  where: {
    OR: [
      { brand: { contains: "item", mode: "insensitive" } },
      { productName: { contains: "item", mode: "insensitive" } },
      { colorName: { contains: "item", mode: "insensitive" } },
    ],
  },
  select: { id: true, userId: true, brand: true, productName: true, colorName: true, currentQuantity: true, createdAt: true },
});

const cartContains = await prisma.cartridge.findMany({
  where: {
    OR: [
      { brand: { contains: "item", mode: "insensitive" } },
      { productName: { contains: "item", mode: "insensitive" } },
    ],
  },
  select: { id: true, userId: true, brand: true, productName: true, configuration: true, quantity: true, createdAt: true },
});

const consContains = await prisma.consumable.findMany({
  where: {
    OR: [
      { name: { contains: "item", mode: "insensitive" } },
      { brand: { contains: "item", mode: "insensitive" } },
    ],
  },
  select: { id: true, userId: true, name: true, brand: true, category: true, quantity: true, createdAt: true },
});

const movContains = await prisma.stockMovement.findMany({
  where: { itemName: { contains: "item", mode: "insensitive" } },
  select: { id: true, userId: true, type: true, itemType: true, itemId: true, itemName: true, quantity: true, createdAt: true },
});

show("INKS containing 'item'", inkContains);
show("CARTRIDGES containing 'item'", cartContains);
show("CONSUMABLES containing 'item'", consContains);
show("STOCK MOVEMENTS containing 'item'", movContains);

console.log("\n=== ALL CONSUMABLES ===");
const allCons = await prisma.consumable.findMany({ select: { id: true, name: true, brand: true, createdAt: true } });
for (const c of allCons) console.log(JSON.stringify(c));

await prisma.$disconnect();
