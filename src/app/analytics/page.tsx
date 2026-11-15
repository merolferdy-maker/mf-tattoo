import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { PageHeader, StatCard } from "@/components/ui/kit";

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
  const catMap: Record<string, number> = {};
  for (const i of inks) if (i.currentQuantity > 0) catMap[i.category || "Ink"] = (catMap[i.category || "Ink"] || 0) + 1;
  for (const c of consumables) if (c.quantity > 0) catMap[c.category || "Consumable"] = (catMap[c.category || "Consumable"] || 0) + 1;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto fade-up">
      <PageHeader title="Analytics" subtitle="Studio insights" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Machines" value={machines} />
        <StatCard label="Presets" value={presets} />
        <StatCard label="Ink bottles" value={inks.filter((i) => i.currentQuantity > 0).length} />
        <StatCard label="Cartridges" value={cartridges.filter((c) => c.quantity > 0).reduce((a, c) => a + c.quantity, 0)} />
        <StatCard label="Consumables" value={consumables.filter((c) => c.quantity > 0).length} />
        <StatCard label="Low stock" value={lowStock} />
        <StatCard label="Expiring (30d)" value={expiring} />
        <StatCard label="Inventory value" value={`$${totalValue.toFixed(2)}`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-card border border-border rounded-sm p-5 card-shadow">
          <div className="text-xs text-muted uppercase tracking-wider mb-3">Purchases</div>
          <div className="text-2xl font-semibold">{purchases.length}</div>
          <div className="text-xs text-muted mt-1">Value: ${purchasedValue.toFixed(2)}</div>
        </div>
        <div className="bg-card border border-border rounded-sm p-5 card-shadow">
          <div className="text-xs text-muted uppercase tracking-wider mb-3">Consumption</div>
          <div className="text-2xl font-semibold">{consumption.length}</div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-sm p-5 card-shadow mt-4">
        <div className="text-xs text-muted uppercase tracking-wider mb-3">Inventory distribution by category</div>
        {Object.entries(catMap).map(([k, v]) => (
          <div key={k} className="flex items-center justify-between text-sm border-b border-border py-2 last:border-0">
            <span className="text-muted">{k}</span>
            <span className="text-foreground font-medium">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
