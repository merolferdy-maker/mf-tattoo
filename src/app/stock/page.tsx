import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { recordMovement, markPurchased } from "@/actions/stock";
import { PageHeader } from "@/components/ui/kit";

export default async function StockPage() {
  const userId = await requireUser();
  const [inks, cartridges, consumables, movements] = await Promise.all([
    prisma.inkProduct.findMany({ where: { userId } }),
    prisma.cartridge.findMany({ where: { userId } }),
    prisma.consumable.findMany({ where: { userId } }),
    prisma.stockMovement.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 50 }),
  ]);

  const lowStock: { type: string; id: string; name: string; qty: number; min: number }[] = [];
  for (const i of inks) if (i.minStockLevel && i.currentQuantity <= (i.minStockLevel ?? 0)) lowStock.push({ type: "INK", id: i.id, name: `${i.brand} ${i.colorName}`, qty: i.currentQuantity, min: i.minStockLevel ?? 0 });
  for (const c of cartridges) if (c.minStockLevel && c.quantity <= c.minStockLevel) lowStock.push({ type: "CARTRIDGE", id: c.id, name: `${c.brand} ${c.productName}`, qty: c.quantity, min: c.minStockLevel });
  for (const c of consumables) if (c.minStockLevel && c.quantity <= c.minStockLevel) lowStock.push({ type: "CONSUMABLE", id: c.id, name: c.name, qty: c.quantity, min: c.minStockLevel });

  const expired = inks.filter((i) => i.expirationDate && new Date(i.expirationDate) < new Date());

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto fade-up">
      <PageHeader title="Stock & movements" subtitle="Inventory tracking" />

      <div className="bg-card border border-border rounded-sm p-5 card-shadow mb-6">
        <div className="text-xs text-muted uppercase tracking-wider mb-4">Record movement</div>
        <form action={recordMovement} className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-xs text-muted mb-1">Type</label>
            <select name="type" className="w-full bg-background border border-border rounded-sm px-3 py-2 text-sm">
              {["PURCHASE","ADDITION","CONSUMPTION","CORRECTION","DISPOSAL","EXPIRATION"].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Item type</label>
            <select name="itemType" className="w-full bg-background border border-border rounded-sm px-3 py-2 text-sm">
              <option value="INK">Ink</option>
              <option value="CARTRIDGE">Cartridge</option>
              <option value="CONSUMABLE">Consumable</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Item</label>
            <select name="itemId" className="w-full bg-background border border-border rounded-sm px-3 py-2 text-sm">
              <optgroup label="Inks">{inks.map((i) => <option key={i.id} value={i.id}>{i.brand} {i.colorName}</option>)}</optgroup>
              <optgroup label="Cartridges">{cartridges.map((c) => <option key={c.id} value={c.id}>{c.brand} {c.productName}</option>)}</optgroup>
              <optgroup label="Consumables">{consumables.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</optgroup>
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Quantity</label>
            <input name="quantity" type="number" step="0.1" defaultValue={1} className="w-full bg-background border border-border rounded-sm px-3 py-2 text-sm" />
          </div>
          <div className="col-span-2 md:col-span-4">
            <input name="notes" placeholder="Notes" className="w-full bg-background border border-border rounded-sm px-3 py-2 text-sm" />
          </div>
          <div className="col-span-2 md:col-span-4">
            <button type="submit" className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-sm hover:opacity-90">Record</button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-sm p-5 card-shadow">
          <div className="text-xs text-muted uppercase tracking-wider mb-3">Shopping list (low stock)</div>
          {lowStock.length === 0 && <div className="text-muted text-sm">All good.</div>}
          {lowStock.map((l) => (
            <div key={l.id} className="flex items-center justify-between text-sm border-b border-border py-2 last:border-0">
              <span className="text-muted">{l.name} <span className="text-xs">({l.type})</span> — {l.qty}/{l.min}</span>
              <form action={markPurchased}>
                <input type="hidden" name="itemType" value={l.type} />
                <input type="hidden" name="itemId" value={l.id} />
                <input type="hidden" name="quantity" value={l.min - l.qty + 1} />
                <button className="text-xs text-accent hover:underline">Mark purchased</button>
              </form>
            </div>
          ))}
        </div>
        <div className="bg-card border border-border rounded-sm p-5 card-shadow">
          <div className="text-xs text-muted uppercase tracking-wider mb-3">Expiring soon</div>
          {expired.length === 0 && <div className="text-muted text-sm">None.</div>}
          {expired.map((i) => (
            <div key={i.id} className="text-sm border-b border-border py-2 last:border-0 text-muted">{i.brand} {i.colorName} — {new Date(i.expirationDate!).toLocaleDateString()}</div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-sm p-5 card-shadow mt-4">
        <div className="text-xs text-muted uppercase tracking-wider mb-3">Recent movements</div>
        {movements.length === 0 && <div className="text-muted text-sm">None.</div>}
        {movements.map((m) => (
          <div key={m.id} className="text-sm border-b border-border py-2 last:border-0 text-muted">
            {new Date(m.createdAt).toLocaleString()} · {m.type} · {m.itemName} · {m.quantity}
          </div>
        ))}
      </div>
    </div>
  );
}
