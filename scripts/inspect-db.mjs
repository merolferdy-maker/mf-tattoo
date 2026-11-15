import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const users = await prisma.user.findMany({ select: { id: true, email: true, name: true, createdAt: true } });
console.log("USERS:");
for (const u of users) console.log(JSON.stringify(u));

const counts = {};
for (const model of ["inkProduct", "cartridge", "consumable", "supplier", "stockMovement", "inkBatch", "machine", "preset", "washRecipe", "session", "technicalNote", "favorite"]) {
  try {
    counts[model] = await prisma[model].count();
  } catch (e) {
    counts[model] = `ERR: ${e.message}`;
  }
}
console.log("\nCOUNTS:", JSON.stringify(counts, null, 2));

for (const model of ["machine", "preset", "session", "technicalNote", "favorite", "washRecipe", "inkBatch", "supplier"]) {
  try {
    const rows = await prisma[model].findMany({ take: 20 });
    console.log(`\n=== ${model} (${rows.length}) ===`);
    for (const r of rows) console.log(JSON.stringify(r));
  } catch (e) {
    console.log(`\n=== ${model} ERROR: ${e.message}`);
  }
}

await prisma.$disconnect();
