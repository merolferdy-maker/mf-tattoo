import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import Link from "next/link";

export default async function DashboardPage() {
  let userId: string;
  try {
    userId = await requireUser();
  } catch (e: any) {
    return <div className="p-4 text-red-400">Auth error: {String(e?.message || e)}</div>;
  }
  try {
    const [machines, presets, inks, cartridges, consumables, movements] = await Promise.all([
      prisma.machine.findMany({ where: { userId } }),
      prisma.machinePreset.findMany({ where: { userId }, orderBy: { updatedAt: "desc" }, take: 5 }),
      prisma.inkProduct.findMany({ where: { userId } }),
      prisma.cartridge.findMany({ where: { userId } }),
      prisma.consumable.findMany({ where: { userId } }),
      prisma.stockMovement.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 8 }),
    ]);
    const lowStock = inks.filter((i) => i.minStockLevel && i.currentQuantity <= (i.minStockLevel ?? 0)).length
      + cartridges.filter((c) => c.minStockLevel && c.quantity <= c.minStockLevel).length
      + consumables.filter((c) => c.minStockLevel && c.quantity <= c.minStockLevel).length;
    const expiring = inks.filter((i) => i.expirationDate && new Date(i.expirationDate) < new Date(Date.now() + 30 * 86400000)).length;
    const recentInks = [...inks].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5);
    const favRecipes = await prisma.washRecipe.findMany({ where: { userId, favorite: true }, take: 5 });

    return (
      <div className="p-4 md:p-6 space-y-6">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="Products (inks)" value={inks.length} />
          <Stat label="Machines" value={machines.length} />
          <Stat label="Ink bottles" value={inks.length} />
          <Stat label="Cartridges" value={cartridges.reduce((a, c) => a + c.quantity, 0)} />
          <Stat label="Consumables" value={consumables.length} />
          <Stat label="Low stock" value={lowStock} />
          <Stat label="Expiring soon" value={expiring} />
          <Stat label="Presets" value={presets.length} />
        </div>
        <div className="text-sm text-muted">Debug: userId={userId}</div>
      </div>
    );
  } catch (e: any) {
    return <div className="p-4 text-red-400">Data error: {String(e?.message || e)}</div>;
  }
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div className="bg-card border border-border p-3">
      <div className="text-xs text-muted">{label}</div>
      <div className="text-lg font-semibold mt-1">{value}</div>
    </div>
  );
}
