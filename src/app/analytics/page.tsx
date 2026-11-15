import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export default async function AnalyticsPage() {
  const userId = await requireUser();
  const [machines, presets, inks, cartridges, consumables, movements] = await Promise.all([
    prisma.machine.count({ where: { userId } }),
    prisma.machinePreset.count({ where: { userId } }),
    prisma.inkProduct.findMany({ where: { userId } }),
    prisma.cartridge.findMany({ where: { userId } }),
    prisma.consumable.findMany({ where: { userId } }),
    prisma.stockMovement.findMany({ where: { userId } }),
  ]);
  const inkValue = inks.reduce((a, i) => a + (i.currentQuantity * (i.price ?? 0)), 0);
  const cartValue = cartridges.reduce((a, c) => a + (c.quantity * (c.purchasePrice ?? 0)), 0);
  const consValue = consumables.reduce((a, c) => a + (c.quantity * (c.price ?? 0)), 0);
  const totalValue = inkValue + cartValue + consValue;
  const lowStock = inks.filter((i) => i.minStockLevel && i.currentQuantity <= (i.minStockLevel ?? 0)).length
    + cartridges.filter((c) => c.minStockLevel && c.quantity <= c.minStockLevel).length
    + consumables.filter((c) => c.minStockLevel && c.quantity <= c.minStockLevel).length;
  const expiring = inks.filter((i) => i.expirationDate && new Date(i.expirationDate) < new Date(Date.now() + 30 * 86400000)).length;
  const purchases = movements.filter((m) => m.type === "PURCHASE");
  const consumption = movements.filter((m) => m.type === "CONSUMPTION");
  const purchasedValue = purchases.reduce((a, m) => a + (m.price ?? 0), 0);
  // category distribution
  const catMap: Record<string, number> = {};
  for (const i of inks) catMap[i.category || "Ink"] = (catMap[i.category || "Ink"] || 0) + 1;
  for (const c of consumables) catMap[c.category || "Consumable"] = (catMap[c.category || "Consumable"] || 0) + 1;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-xl font-semibold">Analytics</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Machines" value={machines} />
        <Stat label="Presets" value={presets} />
        <Stat label="Ink bottles" value={inks.length} />
        <Stat label="Cartridges" value={cartridges.reduce((a, c) => a + c.quantity, 0)} />
        <Stat label="Consumables" value={consumables.length} />
        <Stat label="Low stock" value={lowStock} />
        <Stat label="Expiring (30d)" value={expiring} />
        <Stat label="Total inventory value" value={`$${totalValue.toFixed(2)}`} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-border p-4">
          <div className="text-sm font-medium mb-2">Monthly purchases</div>
          <div className="text-2xl">{purchases.length}</div>
          <div className="text-xs text-muted">Value: ${purchasedValue.toFixed(2)}</div>
        </div>
        <div className="border border-border p-4">
          <div className="text-sm font-medium mb-2">Monthly consumption</div>
          <div className="text-2xl">{consumption.length}</div>
        </div>
      </div>
      <div className="border border-border p-4">
        <div className="text-sm font-medium mb-2">Inventory distribution by category</div>
        {Object.entries(catMap).map(([k, v]) => (
          <div key={k} className="flex items-center justify-between text-xs border-b border-border py-1">
            <span>{k}</span><span>{v}</span>
          </div>
        ))}
      </div>
      <div className="text-xs text-muted">Export reports via Settings.</div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div className="bg-card border border-border p-3">
      <div className="text-xs text-muted">{label}</div>
      <div className="text-lg font-semibold mt-1">{value}</div>
    </div>
  );
}
