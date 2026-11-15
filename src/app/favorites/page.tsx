import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import Link from "next/link";

export default async function FavoritesPage() {
  const userId = await requireUser();
  const [machines, presets, inks, recipes, cartridges, notes] = await Promise.all([
    prisma.machine.findMany({ where: { userId, favorite: true } }),
    prisma.machinePreset.findMany({ where: { userId, favorite: true } }),
    prisma.inkProduct.findMany({ where: { userId, favorite: true } }),
    prisma.washRecipe.findMany({ where: { userId, favorite: true } }),
    prisma.cartridge.findMany({ where: { userId, favorite: true } }),
    prisma.technicalNote.findMany({ where: { userId, favorite: true } }),
  ]);
  // machines have no favorite; show none
  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-xl font-semibold">Favorites</h1>
      <Section title="Machines" items={machines.map((m) => ({ href: `/machines/${m.id}`, label: m.customName || `${m.brand} ${m.model}` }))} />
      <Section title="Presets" items={presets.map((p) => ({ href: `/presets/${p.id}`, label: p.name }))} />
      <Section title="Inks" items={inks.map((i) => ({ href: `/inks/${i.id}`, label: `${i.brand} ${i.colorName}` }))} />
      <Section title="Recipes" items={recipes.map((r) => ({ href: `/wash-lab/${r.id}`, label: r.name }))} />
      <Section title="Cartridges" items={cartridges.map((c) => ({ href: `/cartridges/${c.id}`, label: `${c.brand} ${c.productName}` }))} />
      <Section title="Notes" items={notes.map((n) => ({ href: `/notes/${n.id}`, label: n.title }))} />
    </div>
  );
}

function Section({ title, items }: { title: string; items: { href: string; label: string }[] }) {
  return (
    <div>
      <div className="text-sm font-medium text-muted mb-2">{title}</div>
      {items.length === 0 && <div className="text-muted text-xs">None.</div>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {items.map((i) => (
          <Link key={i.href} href={i.href} className="bg-card border border-border p-3 text-sm hover:border-accent">{i.label}</Link>
        ))}
      </div>
    </div>
  );
}
