import Link from "next/link";
export default function QuickAddPage() {
  const items = [
    { href: "/inks/new", label: "Add ink" },
    { href: "/machines/new", label: "Add machine" },
    { href: "/presets/new", label: "Create preset" },
    { href: "/wash-lab/new", label: "Create wash recipe" },
    { href: "/cartridges/new", label: "Add cartridge" },
    { href: "/consumables/new", label: "Add consumable" },
    { href: "/suppliers/new", label: "Add supplier" },
    { href: "/notes/new", label: "New note" },
    { href: "/sessions/new", label: "New session" },
    { href: "/stock", label: "Register stock movement" },
  ];
  return (
    <div className="p-4 md:p-6 space-y-3">
      <h1 className="text-xl font-semibold">Quick add</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {items.map((i) => (
          <Link key={i.href} href={i.href} className="bg-card border border-border p-4 text-sm hover:border-accent">{i.label}</Link>
        ))}
      </div>
    </div>
  );
}
