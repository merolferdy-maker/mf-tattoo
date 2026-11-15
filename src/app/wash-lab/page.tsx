import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import Link from "next/link";
import { PageHeader, EmptyState } from "@/components/ui/kit";
import { WashCalculator } from "@/components/WashCalculator";

export default async function WashLabPage({ searchParams }: { searchParams: Promise<{ type?: string; collection?: string }> }) {
  const { type } = await searchParams;
  const userId = await requireUser();
  const filterType = type === "GRAY" ? "GRAY" : type === "WHITE" ? "WHITE" : undefined;
  const collections = await prisma.washCollection.findMany({ where: { userId, ...(filterType ? { type: filterType } : {}) }, include: { recipes: { include: { shades: true } } } });
  const recipes = await prisma.washRecipe.findMany({ where: { userId, ...(filterType ? { type: filterType } : {}) }, include: { shades: true, collection: true }, orderBy: { updatedAt: "desc" } });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto fade-up">
      <PageHeader title="Wash Lab" subtitle="Whitewash & graywash recipes" actions={
        <Link href="/wash-lab/new" className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-sm hover:opacity-90">+ New recipe</Link>
      } />
      <div className="flex gap-2 flex-wrap mb-6">
        <Link href="/wash-lab?type=WHITE" className={`px-3 py-1.5 text-xs rounded-sm border transition-colors ${filterType === "WHITE" ? "bg-card border-border-hover text-foreground" : "border-border text-muted hover:text-foreground"}`}>Whitewash</Link>
        <Link href="/wash-lab?type=GRAY" className={`px-3 py-1.5 text-xs rounded-sm border transition-colors ${filterType === "GRAY" ? "bg-card border-border-hover text-foreground" : "border-border text-muted hover:text-foreground"}`}>Graywash</Link>
        <Link href="/wash-lab" className={`px-3 py-1.5 text-xs rounded-sm border transition-colors ${!filterType ? "bg-card border-border-hover text-foreground" : "border-border text-muted hover:text-foreground"}`}>All</Link>
      </div>

      <div className="mb-6">
        <WashCalculator />
      </div>

      {recipes.length === 0 ? (
        <EmptyState title="No recipes yet" description="Create your first wash recipe." action={<Link href="/wash-lab/new" className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-sm hover:opacity-90">+ New recipe</Link>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {recipes.map((r) => (
            <Link key={r.id} href={`/wash-lab/${r.id}`} className="group bg-card border border-border rounded-sm p-5 card-shadow hover:border-border-hover transition-all fade-up">
              <div className="flex items-start justify-between">
                <div className="font-medium text-foreground group-hover:text-accent transition-colors">{r.name}</div>
                {r.favorite && <span className="text-accent text-sm">★</span>}
              </div>
              <div className="text-xs text-muted mt-1">{r.type} · {r.baseInkBrand} {r.baseInkName}</div>
              <div className="mt-3 text-xs text-muted">{r.totalVolume ?? "-"} ml · {r.inkQuantity ?? "-"} ink / {r.diluentQuantity ?? "-"} diluent</div>
              <div className="mt-1 text-xs text-muted">{r.shades.length} shades</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
