import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import Link from "next/link";

export default async function CartridgesPage() {
  const userId = await requireUser();
  const cartridges = await prisma.cartridge.findMany({ where: { userId }, orderBy: { updatedAt: "desc" } });
  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Cartridges</h1>
        <Link href="/cartridges/new" className="px-3 py-2 text-sm bg-foreground text-background">+ Add cartridge</Link>
      </div>
      {cartridges.length === 0 && <div className="text-muted text-sm border border-border p-6 text-center">No cartridges yet.</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {cartridges.map((c) => (
          <Link key={c.id} href={`/cartridges/${c.id}`} className="bg-card border border-border p-4 hover:border-accent">
            <div className="flex items-center justify-between">
              <div className="font-medium">{c.brand} {c.productName}</div>
              {c.favorite && <span className="text-accent text-xs">★</span>}
            </div>
            <div className="text-xs text-muted mt-1">{c.configuration} · {c.needleCount} needles · {c.needleDiameter}mm</div>
            <div className="text-xs text-muted mt-1">Qty: {c.quantity} (min {c.minStockLevel})</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
