import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import Link from "next/link";

const categories = ["LINEWORK","BLACK_SHADING","GREY_SHADING","COLOR_PACKING","COLOR_SHADING","WHIP_SHADING","CUSTOM"];

export default async function PresetsPage({ searchParams }: { searchParams: Promise<{ cat?: string; q?: string }> }) {
  const { cat, q } = await searchParams;
  const userId = await requireUser();
  const where: any = { userId };
  if (cat) where.category = cat;
  if (q) where.OR = [{ name: { contains: q } }, { technique: { contains: q } }];
  const presets = await prisma.machinePreset.findMany({ where, include: { machine: true }, orderBy: { updatedAt: "desc" } });
  const machines = await prisma.machine.findMany({ where: { userId } });
  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Machine presets</h1>
        <Link href="/presets/new" className="px-3 py-2 text-sm bg-foreground text-background">+ New preset</Link>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Link href="/presets" className={`px-3 py-1 text-xs border border-border ${!cat ? "bg-card" : ""}`}>All</Link>
        {categories.map((c) => (
          <Link key={c} href={`/presets?cat=${c}`} className={`px-3 py-1 text-xs border border-border ${cat === c ? "bg-card" : ""}`}>{c.replace(/_/g," ")}</Link>
        ))}
      </div>
      {presets.length === 0 && <div className="text-muted text-sm border border-border p-6 text-center">No presets yet.</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {presets.map((p) => (
          <Link key={p.id} href={`/presets/${p.id}`} className="bg-card border border-border p-4 hover:border-accent">
            <div className="flex items-center justify-between">
              <div className="font-medium">{p.name}</div>
              {p.favorite && <span className="text-accent text-xs">★</span>}
            </div>
            <div className="text-xs text-muted mt-1">{p.category.replace(/_/g," ")}</div>
            <div className="text-xs text-muted mt-1">{p.machine.customName || p.machine.brand} · {p.voltage ?? "-"}V · {p.stroke ?? "-"}mm</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
