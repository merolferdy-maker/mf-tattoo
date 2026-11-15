import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import Link from "next/link";

export default async function InksPage({ searchParams }: { searchParams: Promise<{ q?: string; brand?: string }> }) {
  const { q, brand } = await searchParams;
  const userId = await requireUser();
  const where: any = { userId };
  if (q) where.OR = [{ brand: { contains: q } }, { productName: { contains: q } }, { colorName: { contains: q } }];
  if (brand) where.brand = brand;
  const inks = await prisma.inkProduct.findMany({ where, orderBy: { updatedAt: "desc" } });
  const brands = await prisma.inkProduct.findMany({ where: { userId }, select: { brand: true }, distinct: ["brand"] });
  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Inks</h1>
        <Link href="/inks/new" className="px-3 py-2 text-sm bg-foreground text-background">+ Add ink</Link>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Link href="/inks" className={`px-3 py-1 text-xs border border-border ${!brand ? "bg-card" : ""}`}>All brands</Link>
        {brands.map((b) => (
          <Link key={b.brand} href={`/inks?brand=${encodeURIComponent(b.brand)}`} className={`px-3 py-1 text-xs border border-border ${brand === b.brand ? "bg-card" : ""}`}>{b.brand}</Link>
        ))}
      </div>
      {inks.length === 0 && <div className="text-muted text-sm border border-border p-6 text-center">No inks yet.</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {inks.map((i) => (
          <Link key={i.id} href={`/inks/${i.id}`} className="bg-card border border-border p-4 hover:border-accent">
            <div className="flex items-center justify-between">
              <div className="font-medium">{i.brand} {i.colorName}</div>
              {i.favorite && <span className="text-accent text-xs">★</span>}
            </div>
            <div className="text-xs text-muted mt-1">{i.productName}</div>
            <div className="text-xs text-muted mt-1">Qty: {i.currentQuantity} / {i.initialQuantity} {i.bottleVolume ? `· ${i.bottleVolume}ml` : ""}</div>
            {i.expirationDate && <div className="text-xs text-muted">Exp: {new Date(i.expirationDate).toLocaleDateString()}</div>}
          </Link>
        ))}
      </div>
    </div>
  );
}
