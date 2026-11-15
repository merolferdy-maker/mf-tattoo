import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import Link from "next/link";
import { PageHeader, StatCard, EmptyState } from "@/components/ui/kit";

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
    <div className="p-4 md:p-8 max-w-7xl mx-auto fade-up">
      <PageHeader title="Dashboard" subtitle="Overview of your studio" actions={
        <>
          <Link href="/inks/new" className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-sm hover:opacity-90">+ Product</Link>
          <Link href="/machines/new" className="px-4 py-2 bg-card border border-border text-sm font-medium rounded-sm hover:bg-card-hover">+ Machine</Link>
        </>
      } />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Machines" value={machines.length} />
        <StatCard label="Ink bottles" value={inks.length} />
        <StatCard label="Cartridges" value={cartridges.reduce((a, c) => a + c.quantity, 0)} />
        <StatCard label="Consumables" value={consumables.length} />
        <StatCard label="Presets" value={presets.length} />
        <StatCard label="Low stock" value={lowStock} hint={lowStock > 0 ? "Needs attention" : "All good"} />
        <StatCard label="Expiring soon" value={expiring} hint={expiring > 0 ? "Within 30 days" : "None"} />
        <StatCard label="Total products" value={inks.length + cartridges.length + consumables.length} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <SectionCard title="Quick actions">
          <div className="grid grid-cols-2 gap-2">
            <QuickLink href="/inks/new" label="Add ink" />
            <QuickLink href="/machines/new" label="Add machine" />
            <QuickLink href="/presets/new" label="Create preset" />
            <QuickLink href="/wash-lab/new" label="Create wash recipe" />
            <QuickLink href="/cartridges/new" label="Add cartridge" />
            <QuickLink href="/consumables/new" label="Add consumable" />
            <QuickLink href="/stock" label="Register purchase" />
            <QuickLink href="/stock" label="Register consumption" />
          </div>
        </SectionCard>
        <SectionCard title="Notifications">
          {lowStock === 0 && expiring === 0 && <div className="text-muted text-sm">No alerts. Everything is in order.</div>}
          {lowStock > 0 && <div className="text-sm text-amber-400/90 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" />{lowStock} low-stock products</div>}
          {expiring > 0 && <div className="text-sm text-amber-400/90 flex items-center gap-2 mt-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" />{expiring} products expiring soon</div>}
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <SectionCard title="Recently added inks">
          {recentInks.length === 0 && <EmptyState title="No inks yet" description="Add your first ink product." action={<Link href="/inks/new" className="text-sm text-accent hover:underline">Add ink</Link>} />}
          {recentInks.map((i) => (
            <Link key={i.id} href={`/inks/${i.id}`} className="flex items-center justify-between py-2 border-b border-border last:border-0 hover:text-foreground text-muted transition-colors">
              <span className="text-sm">{i.brand} {i.colorName}</span>
              <span className="text-xs text-muted">{i.currentQuantity} ml</span>
            </Link>
          ))}
        </SectionCard>
        <SectionCard title="Recently modified presets">
          {presets.length === 0 && <EmptyState title="No presets yet" description="Create your first machine preset." action={<Link href="/presets/new" className="text-sm text-accent hover:underline">Create preset</Link>} />}
          {presets.map((p) => (
            <Link key={p.id} href={`/presets/${p.id}`} className="flex items-center justify-between py-2 border-b border-border last:border-0 hover:text-foreground text-muted transition-colors">
              <span className="text-sm">{p.name}</span>
              <span className="text-xs text-muted">{p.category.replace(/_/g, " ")}</span>
            </Link>
          ))}
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <SectionCard title="Favorite wash recipes">
          {favRecipes.length === 0 && <EmptyState title="No favorites" description="Star your favorite wash recipes." />}
          {favRecipes.map((r) => (
            <Link key={r.id} href={`/wash-lab/${r.id}`} className="block py-2 border-b border-border last:border-0 text-sm text-muted hover:text-foreground transition-colors">{r.name}</Link>
          ))}
        </SectionCard>
        <SectionCard title="Recent stock movements">
          {movements.length === 0 && <EmptyState title="No movements" description="Stock changes will appear here." />}
          {movements.map((m) => (
            <div key={m.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-sm text-muted">{m.type} · {m.itemName}</span>
              <span className="text-xs text-muted">{m.quantity}</span>
            </div>
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

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="px-3 py-2 bg-background border border-border rounded-sm text-xs text-muted hover:text-foreground hover:border-border-hover transition-colors text-center">
      {label}
    </Link>
  );
}
