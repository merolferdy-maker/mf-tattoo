import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const users = await p.user.findMany({ select: { id: true, email: true, name: true } });
console.log("USERS:", JSON.stringify(users));
for (const u of users) {
  console.log(`\n===== USER ${u.email} (${u.id}) =====`);
  const machines = await p.machine.findMany({ where: { userId: u.id }, select: { id: true, brand: true, model: true, customName: true } });
  console.log(`MACHINES (${machines.length}):`, JSON.stringify(machines));
  const inks = await p.inkProduct.findMany({ where: { userId: u.id }, select: { id: true, brand: true, productName: true, colorName: true } });
  console.log(`INKS (${inks.length}):`, JSON.stringify(inks));
  const carts = await p.cartridge.findMany({ where: { userId: u.id }, select: { id: true, brand: true, productName: true } });
  console.log(`CARTRIDGES (${carts.length}):`, JSON.stringify(carts));
  const cons = await p.consumable.findMany({ where: { userId: u.id }, select: { id: true, name: true, brand: true } });
  console.log(`CONSUMABLES (${cons.length}):`, JSON.stringify(cons));
  const sups = await p.supplier.findMany({ where: { userId: u.id }, select: { id: true, name: true } });
  console.log(`SUPPLIERS (${sups.length}):`, JSON.stringify(sups));
  const movs = await p.stockMovement.findMany({ where: { userId: u.id }, select: { id: true, type: true, itemType: true, itemName: true, quantity: true } });
  console.log(`MOVEMENTS (${movs.length}):`, JSON.stringify(movs));
  const presets = await p.machinePreset.findMany({ where: { userId: u.id }, select: { id: true, name: true, category: true } });
  console.log(`PRESETS (${presets.length}):`, JSON.stringify(presets));
  const notes = await p.technicalNote.findMany({ where: { userId: u.id }, select: { id: true, title: true } });
  console.log(`NOTES (${notes.length}):`, JSON.stringify(notes));
  const sessions = await p.sessionLog.findMany({ where: { userId: u.id }, select: { id: true, notes: true } });
  console.log(`SESSIONS (${sessions.length}):`, JSON.stringify(sessions));
}
await p.$disconnect();
