import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import Link from "next/link";
import { PageHeader, StatCard, EmptyState } from "@/components/ui/kit";

export default async function DashboardPage() {
  const userId = await requireUser();
  const [machines, presets, inks, cartridges, consumables] = await Promise.all([
    prisma.machine.findMany({ where: { userId } }),
    prisma.machinePreset.findMany({ where: { userId } }),
    prisma.inkProduct.findMany({ where: { userId }, orderBy: { updatedAt: "desc" } }),
    prisma.cartridge.findMany({ where: { userId }, orderBy: { updatedAt: "desc" } }),
    prisma.consumable.findMany({ where: { userId }, orderBy: { updatedAt: "desc" } }),
  ]);

  const lowStock = inks.filter((i) => i.minStockLevel && i.currentQuantity <= (i.minStockLevel ?? 0)).length
    + cartridges.filter((c) => c.minStockLevel && c.quantity <= c.minStockLevel).length
    + consumables.filter((c) => c.minStockLevel && c.quantity <= c.minStockLevel).length;
  const expiring = inks.filter((i) => i.expirationDate && new Date(i.expirationDate) < new Date(Date.now() + 30 * 86400000)).length;
  const inkTotal = inks.reduce((a, i) => a + (i.currentQuantity > 0 ? i.currentQuantity : 0), 0);
  const cartTotal = cartridges.reduce((a, c) => a + (c.quantity > 0 ? c.quantity : 0), 0);
  const consTotal = consumables.reduce((a, c) => a + (c.quantity > 0 ? c.quantity : 0), 0);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto fade-up">
      <PageHeader title="Dashboard" subtitle="Overview of your studio" actions={
        <>
          <Link href="/inks/new" className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-sm hover:opacity-90">+ Product</Link>
          <Link href="/machines/new" className="px-4 py-2 bg-card border border-border text-sm font-medium rounded-sm hover:bg-card-hover">+ Machine</Link>
        </>
      } />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Inchiostri" value={inkTotal} />
        <StatCard label="Aghi" value={cartTotal} />
        <StatCard label="Consumabili" value={consTotal} />
        <StatCard label="Totale prodotti" value={inkTotal + cartTotal + consTotal} />
        <StatCard label="Machines" value={machines.length} />
        <StatCard label="Presets" value={presets.length} />
        <StatCard label="Low stock" value={lowStock} hint={lowStock > 0 ? "Needs attention" : "All good"} />
        <StatCard label="Expiring soon" value={expiring} hint={expiring > 0 ? "Within 30 days" : "None"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <SectionCard title="Inchiostri">
          {inks.length === 0 && <EmptyState title="No inks yet" description="Add your first ink product." action={<Link href="/inks/new" className="text-sm text-accent hover:underline">Add ink</Link>} />}
          {inks.map((i) => (
            <Link key={i.id} href={`/inks/${i.id}`} className="flex items-center justify-between py-2 border-b border-border last:border-0 hover:text-foreground text-muted transition-colors">
              <span className="text-sm">{i.brand} {i.colorName}</span>
              {i.currentQuantity <= 0
                ? <span className="px-2 py-0.5 text-xs rounded-sm bg-red-900/20 border border-red-900/40 text-red-400">ESAURITO</span>
                : <span className="text-xs text-foreground font-medium">{i.currentQuantity}</span>}
            </Link>
          ))}
        </SectionCard>

        <SectionCard title="Aghi">
          {cartridges.length === 0 && <EmptyState title="No needles yet" description="Add your first cartridge." action={<Link href="/cartridges/new" className="text-sm text-accent hover:underline">Add cartridge</Link>} />}
          {cartridges.map((c) => (
            <Link key={c.id} href={`/cartridges/${c.id}`} className="flex items-center justify-between py-2 border-b border-border last:border-0 hover:text-foreground text-muted transition-colors">
              <span className="text-sm">{c.brand} {c.productName}</span>
              {c.quantity <= 0
                ? <span className="px-2 py-0.5 text-xs rounded-sm bg-red-900/20 border border-red-900/40 text-red-400">ESAURITO</span>
                : <span className="text-xs text-foreground font-medium">{c.quantity}</span>}
            </Link>
          ))}
        </SectionCard>

        <SectionCard title="Consumabili">
          {consumables.length === 0 && <EmptyState title="No consumables yet" description="Add your first consumable." action={<Link href="/consumables/new" className="text-sm text-accent hover:underline">Add consumable</Link>} />}
          {consumables.map((c) => (
            <Link key={c.id} href={`/consumables/${c.id}`} className="flex items-center justify-between py-2 border-b border-border last:border-0 hover:text-foreground text-muted transition-colors">
              <span className="text-sm">{c.name}</span>
              {c.quantity <= 0
                ? <span className="px-2 py-0.5 text-xs rounded-sm bg-red-900/20 border border-red-900/40 text-red-400">ESAURITO</span>
                : <span className="text-xs text-foreground font-medium">{c.quantity} {c.unit ?? ""}</span>}
            </Link>
          ))}
        </SectionCard>
      </div>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-sm p-5 card-shadow">
      <div className="text-xs text-muted uppercase tracking-wider mb-3">{title}</div>
      {children}
    </div>
  );
}
