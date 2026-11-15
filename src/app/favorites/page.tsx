import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import Link from "next/link";
import { PageHeader } from "@/components/ui/kit";

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
  const sections = [
    { title: "Machines", items: machines.map((m) => ({ href: `/machines/${m.id}`, label: m.customName || `${m.brand} ${m.model}` })) },
    { title: "Presets", items: presets.map((p) => ({ href: `/presets/${p.id}`, label: p.name })) },
    { title: "Inks", items: inks.map((i) => ({ href: `/inks/${i.id}`, label: `${i.brand} ${i.colorName}` })) },
    { title: "Recipes", items: recipes.map((r) => ({ href: `/wash-lab/${r.id}`, label: r.name })) },
    { title: "Cartridges", items: cartridges.map((c) => ({ href: `/cartridges/${c.id}`, label: `${c.brand} ${c.productName}` })) },
    { title: "Notes", items: notes.map((n) => ({ href: `/notes/${n.id}`, label: n.title })) },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto fade-up">
      <PageHeader title="Favorites" subtitle="Your starred items" />
      <div className="space-y-6">
        {sections.map((s) => (
          <div key={s.title}>
            <div className="text-xs text-muted uppercase tracking-wider mb-2">{s.title} ({s.items.length})</div>
            {s.items.length === 0 ? (
              <div className="text-muted text-sm">None.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {s.items.map((i) => (
                  <Link key={i.href} href={i.href} className="bg-card border border-border rounded-sm p-3 text-sm text-muted hover:text-foreground hover:border-border-hover transition-colors">
                    {i.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
