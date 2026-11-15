import { DatabaseSync } from "node:sqlite";
const db = new DatabaseSync("prisma/dev.db");
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log("TABLES:", tables.map((t) => t.name).join(", "));
for (const { name } of tables) {
  if (name === "sqlite_sequence" || name === "_prisma_migrations") continue;
  try {
    const cols = db.prepare(`PRAGMA table_info(${name})`).all().map((c) => c.name);
    const rows = db.prepare(`SELECT * FROM ${name}`).all();
    console.log(`\n=== ${name} (${rows.length}) cols=${cols.join(",")} ===`);
    for (const r of rows.slice(0, 30)) {
      const s = JSON.stringify(r);
      if (/item/i.test(s)) console.log("MATCH:", s);
      else console.log(s.slice(0, 300));
    }
  } catch (e) {
    console.log(`ERR ${name}: ${e.message}`);
  }
}
