import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import Link from "next/link";

export default async function ConsumablesPage() {
  const userId = await requireUser();
  const items = await prisma.consumable.findMany({ where: { userId }, orderBy: { updatedAt: "desc" } });
  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Consumables</h1>
        <Link href="/consumables/new" className="px-3 py-2 text-sm bg-foreground text-background">+ Add</Link>
      </div>
      {items.length === 0 && <div className="text-muted text-sm border border-border p-6 text-center">No consumables yet.</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((c) => (
          <Link key={c.id} href={`/consumables/${c.id}`} className="bg-card border border-border p-4 hover:border-accent">
            <div className="font-medium">{c.name}</div>
            <div className="text-xs text-muted mt-1">{c.brand} {c.category}</div>
            <div className="text-xs text-muted mt-1">Qty: {c.quantity} {c.unit} (min {c.minStockLevel})</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
