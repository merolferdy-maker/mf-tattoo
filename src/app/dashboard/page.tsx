import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import Link from "next/link";

export default async function DashboardPage() {
  const userId = await requireUser();
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-border p-4">
          <div className="text-sm font-medium mb-2">Quick actions</div>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/inks/new" className="px-3 py-2 bg-card border border-border text-xs">+ Product</Link>
            <Link href="/machines/new" className="px-3 py-2 bg-card border border-border text-xs">+ Machine</Link>
            <Link href="/presets/new" className="px-3 py-2 bg-card border border-border text-xs">+ Preset</Link>
            <Link href="/wash-lab/new" className="px-3 py-2 bg-card border border-border text-xs">+ Wash recipe</Link>
            <Link href="/stock" className="px-3 py-2 bg-card border border-border text-xs">Register purchase</Link>
            <Link href="/stock" className="px-3 py-2 bg-card border border-border text-xs">Register consumption</Link>
          </div>
        </div>
        <div className="border border-border p-4">
          <div className="text-sm font-medium mb-2">Notifications</div>
          {lowStock === 0 && expiring === 0 && <div className="text-muted text-xs">No alerts.</div>}
          {lowStock > 0 && <div className="text-xs text-amber-400">⚠ {lowStock} low-stock products</div>}
          {expiring > 0 && <div className="text-xs text-amber-400">⚠ {expiring} products expiring soon</div>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-border p-4">
          <div className="text-sm font-medium mb-2">Recently added products</div>
          {recentInks.map((i) => (
            <Link key={i.id} href={`/inks/${i.id}`} className="block text-xs border-b border-border py-1 hover:text-foreground">{i.brand} {i.colorName}</Link>
          ))}
          {recentInks.length === 0 && <div className="text-muted text-xs">None.</div>}
        </div>
        <div className="border border-border p-4">
          <div className="text-sm font-medium mb-2">Recently modified presets</div>
          {presets.map((p) => (
            <Link key={p.id} href={`/presets/${p.id}`} className="block text-xs border-b border-border py-1 hover:text-foreground">{p.name}</Link>
          ))}
          {presets.length === 0 && <div className="text-muted text-xs">None.</div>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-border p-4">
          <div className="text-sm font-medium mb-2">Favorite recipes</div>
          {favRecipes.map((r) => (
            <Link key={r.id} href={`/wash-lab/${r.id}`} className="block text-xs border-b border-border py-1 hover:text-foreground">{r.name}</Link>
          ))}
          {favRecipes.length === 0 && <div className="text-muted text-xs">None.</div>}
        </div>
        <div className="border border-border p-4">
          <div className="text-sm font-medium mb-2">Recent stock movements</div>
          {movements.map((m) => (
            <div key={m.id} className="text-xs border-b border-border py-1">{m.type} · {m.itemName} · {m.quantity}</div>
          ))}
          {movements.length === 0 && <div className="text-muted text-xs">None.</div>}
        </div>
      </div>
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
