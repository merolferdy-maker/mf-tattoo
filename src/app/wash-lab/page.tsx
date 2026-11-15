import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import Link from "next/link";
import { WashCalculator } from "@/components/WashCalculator";

export default async function WashLabPage({ searchParams }: { searchParams: Promise<{ type?: string; collection?: string }> }) {
  const { type } = await searchParams;
  const userId = await requireUser();
  const filterType = type === "GRAY" ? "GRAY" : type === "WHITE" ? "WHITE" : undefined;
  const collections = await prisma.washCollection.findMany({ where: { userId, ...(filterType ? { type: filterType } : {}) }, include: { recipes: { include: { shades: true } } } });
  const recipes = await prisma.washRecipe.findMany({ where: { userId, ...(filterType ? { type: filterType } : {}) }, include: { shades: true, collection: true }, orderBy: { updatedAt: "desc" } });
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-xl font-semibold">Wash Lab</h1>
        <div className="flex gap-2">
          <Link href="/wash-lab?type=WHITE" className={`px-3 py-1 text-xs border border-border ${filterType === "WHITE" ? "bg-card" : ""}`}>Whitewash</Link>
          <Link href="/wash-lab?type=GRAY" className={`px-3 py-1 text-xs border border-border ${filterType === "GRAY" ? "bg-card" : ""}`}>Graywash</Link>
          <Link href="/wash-lab" className={`px-3 py-1 text-xs border border-border ${!filterType ? "bg-card" : ""}`}>All</Link>
          <Link href="/wash-lab/new" className="px-3 py-2 text-sm bg-foreground text-background">+ New recipe</Link>
        </div>
      </div>

      <WashCalculator />

      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted">Collections</h2>
        {collections.length === 0 && <div className="text-muted text-xs">No collections.</div>}
        {collections.map((c) => (
          <div key={c.id} className="border border-border p-3">
            <div className="font-medium text-sm">{c.name} <span className="text-xs text-muted">({c.type})</span></div>
            <div className="text-xs text-muted">{c.recipes.length} recipes</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted">Recipes</h2>
        {recipes.length === 0 && <div className="text-muted text-sm border border-border p-6 text-center">No recipes yet.</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recipes.map((r) => (
            <Link key={r.id} href={`/wash-lab/${r.id}`} className="bg-card border border-border p-4 hover:border-accent">
              <div className="flex items-center justify-between">
                <div className="font-medium">{r.name}</div>
                {r.favorite && <span className="text-accent text-xs">★</span>}
              </div>
              <div className="text-xs text-muted mt-1">{r.type} · {r.baseInkBrand} {r.baseInkName}</div>
              <div className="text-xs text-muted mt-1">{r.totalVolume ?? "-"} ml · {r.inkQuantity ?? "-"} ink / {r.diluentQuantity ?? "-"} diluent</div>
              <div className="text-xs text-muted mt-1">{r.shades.length} shades</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
