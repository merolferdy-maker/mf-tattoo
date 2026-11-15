import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import Link from "next/link";
import { PageHeader, EmptyState } from "@/components/ui/kit";

export default async function InksPage({ searchParams }: { searchParams: Promise<{ q?: string; brand?: string }> }) {
  const { q, brand } = await searchParams;
  const userId = await requireUser();
  const where: any = { userId };
  if (q) where.OR = [{ brand: { contains: q } }, { productName: { contains: q } }, { colorName: { contains: q } }];
  if (brand) where.brand = brand;
  const inks = await prisma.inkProduct.findMany({ where, orderBy: { updatedAt: "desc" } });
  const brands = await prisma.inkProduct.findMany({ where: { userId }, select: { brand: true }, distinct: ["brand"] });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto fade-up">
      <PageHeader title="Inks" subtitle="Your ink inventory" actions={
        <Link href="/inks/new" className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-sm hover:opacity-90">+ Add ink</Link>
      } />
      <div className="flex gap-2 flex-wrap mb-6">
        <Link href="/inks" className={`px-3 py-1.5 text-xs rounded-sm border transition-colors ${!brand ? "bg-card border-border-hover text-foreground" : "border-border text-muted hover:text-foreground"}`}>All brands</Link>
        {brands.map((b) => (
          <Link key={b.brand} href={`/inks?brand=${encodeURIComponent(b.brand)}`} className={`px-3 py-1.5 text-xs rounded-sm border transition-colors ${brand === b.brand ? "bg-card border-border-hover text-foreground" : "border-border text-muted hover:text-foreground"}`}>{b.brand}</Link>
        ))}
      </div>
      {inks.length === 0 ? (
        <EmptyState title="No inks yet" description="Add your first ink product to start tracking inventory." action={<Link href="/inks/new" className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-sm hover:opacity-90">+ Add ink</Link>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {inks.map((i) => (
            <Link key={i.id} href={`/inks/${i.id}`} className="group bg-card border border-border rounded-sm p-5 card-shadow hover:border-border-hover transition-all fade-up">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-foreground group-hover:text-accent transition-colors">{i.brand} {i.colorName}</div>
                  <div className="text-xs text-muted mt-0.5">{i.productName}</div>
                </div>
                {i.favorite && <span className="text-accent text-sm">★</span>}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-muted">Qty: <span className="text-foreground">{i.currentQuantity}</span> / {i.initialQuantity}</span>
                {i.bottleVolume && <span className="text-muted">{i.bottleVolume}ml</span>}
              </div>
              {i.expirationDate && (
                <div className="mt-2 text-xs text-muted">Exp: {new Date(i.expirationDate).toLocaleDateString()}</div>
              )}
              {i.notes && <div className="mt-2 text-xs text-muted line-clamp-2">{i.notes}</div>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
