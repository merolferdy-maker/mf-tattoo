import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import Link from "next/link";
import { PageHeader, EmptyState } from "@/components/ui/kit";

export default async function ConsumablesPage() {
  const userId = await requireUser();
  const items = await prisma.consumable.findMany({ where: { userId }, orderBy: { updatedAt: "desc" } });
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto fade-up">
      <PageHeader title="Consumables" subtitle="Studio supplies" actions={
        <Link href="/consumables/new" className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-sm hover:opacity-90">+ Add</Link>
      } />
      {items.length === 0 ? (
        <EmptyState title="No consumables yet" description="Add studio supplies to track stock." action={<Link href="/consumables/new" className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-sm hover:opacity-90">+ Add</Link>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {items.map((c) => (
            <Link key={c.id} href={`/consumables/${c.id}`} className="group bg-card border border-border rounded-sm p-5 card-shadow hover:border-border-hover transition-all fade-up">
              <div className="font-medium text-foreground group-hover:text-accent transition-colors">{c.name}</div>
              <div className="text-xs text-muted mt-0.5">{c.brand} {c.category}</div>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-muted">Qty: <span className="text-foreground">{c.quantity}</span> {c.unit}</span>
                <span className="text-muted">Min: {c.minStockLevel}</span>
              </div>
              {c.notes && <div className="mt-2 text-xs text-muted line-clamp-2">{c.notes}</div>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
