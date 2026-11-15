import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import Link from "next/link";
import { PageHeader, EmptyState } from "@/components/ui/kit";

const categories = ["LINEWORK","BLACK_SHADING","GREY_SHADING","COLOR_PACKING","COLOR_SHADING","WHIP_SHADING","CUSTOM"];

export default async function PresetsPage({ searchParams }: { searchParams: Promise<{ cat?: string; q?: string }> }) {
  const { cat, q } = await searchParams;
  const userId = await requireUser();
  const where: any = { userId };
  if (cat) where.category = cat;
  if (q) where.OR = [{ name: { contains: q } }, { technique: { contains: q } }];
  const presets = await prisma.machinePreset.findMany({ where, include: { machine: true }, orderBy: { updatedAt: "desc" } });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto fade-up">
      <PageHeader title="Machine presets" subtitle="Saved configurations" actions={
        <Link href="/presets/new" className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-sm hover:opacity-90">+ New preset</Link>
      } />
      <div className="flex gap-2 flex-wrap mb-6">
        <Link href="/presets" className={`px-3 py-1.5 text-xs rounded-sm border transition-colors ${!cat ? "bg-card border-border-hover text-foreground" : "border-border text-muted hover:text-foreground"}`}>All</Link>
        {categories.map((c) => (
          <Link key={c} href={`/presets?cat=${c}`} className={`px-3 py-1.5 text-xs rounded-sm border transition-colors ${cat === c ? "bg-card border-border-hover text-foreground" : "border-border text-muted hover:text-foreground"}`}>{c.replace(/_/g, " ")}</Link>
        ))}
      </div>
      {presets.length === 0 ? (
        <EmptyState title="No presets yet" description="Create your first machine preset." action={<Link href="/presets/new" className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-sm hover:opacity-90">+ New preset</Link>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {presets.map((p) => (
            <Link key={p.id} href={`/presets/${p.id}`} className="group bg-card border border-border rounded-sm p-5 card-shadow hover:border-border-hover transition-all fade-up">
              <div className="flex items-start justify-between">
                <div className="font-medium text-foreground group-hover:text-accent transition-colors">{p.name}</div>
                {p.favorite && <span className="text-accent text-sm">★</span>}
              </div>
              <div className="text-xs text-muted mt-1">{p.category.replace(/_/g, " ")}</div>
              <div className="mt-3 text-xs text-muted">{p.machine.customName || p.machine.brand} · {p.voltage ?? "-"}V · {p.stroke ?? "-"}mm</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
