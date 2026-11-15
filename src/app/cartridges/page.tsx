import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import Link from "next/link";
import { PageHeader, EmptyState } from "@/components/ui/kit";

export default async function CartridgesPage() {
  const userId = await requireUser();
  const cartridges = await prisma.cartridge.findMany({ where: { userId }, orderBy: { updatedAt: "desc" } });
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto fade-up">
      <PageHeader title="Cartridges" subtitle="Needle cartridges inventory" actions={
        <Link href="/cartridges/new" className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-sm hover:opacity-90">+ Add cartridge</Link>
      } />
      {cartridges.length === 0 ? (
        <EmptyState title="No cartridges yet" description="Add your first cartridge." action={<Link href="/cartridges/new" className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-sm hover:opacity-90">+ Add cartridge</Link>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {cartridges.map((c) => (
            <Link key={c.id} href={`/cartridges/${c.id}`} className="group bg-card border border-border rounded-sm p-5 card-shadow hover:border-border-hover transition-all fade-up">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-foreground group-hover:text-accent transition-colors">{c.brand} {c.productName}</div>
                  <div className="text-xs text-muted mt-0.5">{c.configuration} · {c.needleCount} needles · {c.needleDiameter}mm</div>
                </div>
                {c.favorite && <span className="text-accent text-sm">★</span>}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-muted">Qty: <span className="text-foreground">{c.quantity}</span></span>
                <span className="text-muted">Min: {c.minStockLevel}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
