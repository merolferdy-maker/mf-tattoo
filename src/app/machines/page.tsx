import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import Link from "next/link";
import { PageHeader, EmptyState } from "@/components/ui/kit";

export default async function MachinesPage() {
  const userId = await requireUser();
  const machines = await prisma.machine.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto fade-up">
      <PageHeader title="Machines" subtitle="Your tattoo machines" actions={
        <Link href="/machines/new" className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-sm hover:opacity-90">+ Add machine</Link>
      } />
      {machines.length === 0 ? (
        <EmptyState title="No machines yet" description="Add your first tattoo machine to start managing presets." action={<Link href="/machines/new" className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-sm hover:opacity-90">+ Add machine</Link>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {machines.map((m) => (
            <Link key={m.id} href={`/machines/${m.id}`} className="group bg-card border border-border rounded-sm p-5 card-shadow hover:border-border-hover transition-all fade-up">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-foreground group-hover:text-accent transition-colors">{m.customName || `${m.brand} ${m.model}`}</div>
                  <div className="text-xs text-muted mt-0.5">{m.brand} {m.model}</div>
                </div>
                {m.favorite && <span className="text-accent text-sm">★</span>}
              </div>
              {m.type && <div className="mt-3 text-xs text-muted">{m.type}</div>}
              {(m.strokeMin || m.strokeMax) && (
                <div className="mt-2 text-xs text-muted">Stroke: {m.strokeMin ?? "-"} – {m.strokeMax ?? "-"} mm</div>
              )}
              {m.notes && <div className="mt-2 text-xs text-muted line-clamp-2">{m.notes}</div>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
