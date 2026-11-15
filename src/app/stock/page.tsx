import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { recordMovement } from "@/actions/stock";
import { PageHeader } from "@/components/ui/kit";

export default async function StockPage() {
  const userId = await requireUser();
  const [inks, cartridges, consumables, movements] = await Promise.all([
    prisma.inkProduct.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.cartridge.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.consumable.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.stockMovement.findMany({ where: { userId, type: "CONSUMPTION" }, orderBy: { createdAt: "desc" }, take: 50 }),
  ]);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto fade-up">
      <PageHeader title="Stock" subtitle="Consume your inventory" />

      <div className="bg-card border border-border rounded-sm p-5 card-shadow mb-6">
        <div className="text-xs text-muted uppercase tracking-wider mb-4">Consume item</div>
        <form action={recordMovement} className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
          <input type="hidden" name="type" value="CONSUMPTION" />
          <div className="col-span-2 md:col-span-2">
            <label className="block text-xs text-muted mb-1">Item</label>
            <select name="itemId" required className="w-full bg-background border border-border rounded-sm px-3 py-2 text-sm">
              <optgroup label="Inks">{inks.map((i) => <option key={i.id} value={i.id}>{i.brand} {i.colorName} — qty: {i.currentQuantity}{i.currentQuantity <= 0 ? " (ESAURITO)" : ""}</option>)}</optgroup>
              <optgroup label="Cartridges">{cartridges.map((c) => <option key={c.id} value={c.id}>{c.brand} {c.productName} — qty: {c.quantity}{c.quantity <= 0 ? " (ESAURITO)" : ""}</option>)}</optgroup>
              <optgroup label="Consumables">{consumables.map((c) => <option key={c.id} value={c.id}>{c.name} — qty: {c.quantity}{c.quantity <= 0 ? " (ESAURITO)" : ""}</option>)}</optgroup>
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Quantity</label>
            <input name="quantity" type="number" step="1" min="1" defaultValue={1} className="w-full bg-background border border-border rounded-sm px-3 py-2 text-sm" />
          </div>
          <div className="col-span-2 md:col-span-4">
            <input name="notes" placeholder="Notes" className="w-full bg-background border border-border rounded-sm px-3 py-2 text-sm" />
          </div>
          <div className="col-span-2 md:col-span-4">
            <button type="submit" className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-sm hover:opacity-90">Consume</button>
          </div>
        </form>
      </div>

      <div className="bg-card border border-border rounded-sm p-5 card-shadow">
        <div className="text-xs text-muted uppercase tracking-wider mb-3">Recent consumptions</div>
        {movements.length === 0 && <div className="text-muted text-sm">None.</div>}
        {movements.map((m) => (
          <div key={m.id} className="text-sm border-b border-border py-2 last:border-0 text-muted">
            {new Date(m.createdAt).toLocaleString()} · {m.itemName} · -{m.quantity}
          </div>
        ))}
      </div>
    </div>
  );
}
