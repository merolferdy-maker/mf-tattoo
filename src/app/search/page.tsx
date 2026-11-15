import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import Link from "next/link";
import { PageHeader } from "@/components/ui/kit";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const userId = await requireUser();
  const term = q?.trim() || "";
  if (!term) {
    return <div className="p-4 md:p-8 max-w-7xl mx-auto"><PageHeader title="Search" subtitle="Enter a search term in the top bar." /></div>;
  }
  const [machines, presets, inks, recipes, cartridges, consumables, suppliers, notes] = await Promise.all([
    prisma.machine.findMany({ where: { userId, OR: [{ brand: { contains: term } }, { model: { contains: term } }, { customName: { contains: term } }] } }),
    prisma.machinePreset.findMany({ where: { userId, OR: [{ name: { contains: term } }, { technique: { contains: term } }] } }),
    prisma.inkProduct.findMany({ where: { userId, OR: [{ brand: { contains: term } }, { productName: { contains: term } }, { colorName: { contains: term } }] } }),
    prisma.washRecipe.findMany({ where: { userId, OR: [{ name: { contains: term } }, { baseInkBrand: { contains: term } }, { baseInkName: { contains: term } }] } }),
    prisma.cartridge.findMany({ where: { userId, OR: [{ brand: { contains: term } }, { productName: { contains: term } }, { configuration: { contains: term } }] } }),
    prisma.consumable.findMany({ where: { userId, OR: [{ name: { contains: term } }, { brand: { contains: term } }, { category: { contains: term } }] } }),
    prisma.supplier.findMany({ where: { userId, OR: [{ name: { contains: term } }] } }),
    prisma.technicalNote.findMany({ where: { userId, OR: [{ title: { contains: term } }, { tags: { contains: term } }] } }),
  ]);

  const sections = [
    { title: "Machines", items: machines.map((m) => ({ href: `/machines/${m.id}`, label: m.customName || `${m.brand} ${m.model}` })) },
    { title: "Presets", items: presets.map((p) => ({ href: `/presets/${p.id}`, label: p.name })) },
    { title: "Inks", items: inks.map((i) => ({ href: `/inks/${i.id}`, label: `${i.brand} ${i.colorName}` })) },
    { title: "Recipes", items: recipes.map((r) => ({ href: `/wash-lab/${r.id}`, label: r.name })) },
    { title: "Cartridges", items: cartridges.map((c) => ({ href: `/cartridges/${c.id}`, label: `${c.brand} ${c.productName}` })) },
    { title: "Consumables", items: consumables.map((c) => ({ href: `/consumables/${c.id}`, label: c.name })) },
    { title: "Suppliers", items: suppliers.map((s) => ({ href: `/suppliers/${s.id}`, label: s.name })) },
    { title: "Notes", items: notes.map((n) => ({ href: `/notes/${n.id}`, label: n.title })) },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto fade-up">
      <PageHeader title={`Search: ${term}`} subtitle={`${sections.reduce((a, s) => a + s.items.length, 0)} results`} />
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
