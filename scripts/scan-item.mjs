import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const models = [
  "user", "machine", "machinePreset", "presetVersion", "inkProduct", "inkBatch",
  "washCollection", "washRecipe", "washShade", "washRecipeVersion", "cartridge",
  "consumable", "supplier", "stockMovement", "technicalNote", "sessionLog",
  "favorite", "recentlyUsed",
];
let hits = 0;
for (const m of models) {
  try {
    const rows = await p[m].findMany();
    for (const r of rows) {
      for (const [k, v] of Object.entries(r)) {
        if (typeof v === "string" && v.trim().toLowerCase() === "item") {
          hits++;
          console.log(`HIT ${m}.${k} = "${v}" -> ${JSON.stringify(r)}`);
        }
      }
    }
    console.log(`${m}: ${rows.length} rows scanned`);
  } catch (e) {
    console.log(`${m}: ERROR ${e.message}`);
  }
}
console.log(`\nTOTAL EXACT "ITEM" HITS: ${hits}`);
await p.$disconnect();
