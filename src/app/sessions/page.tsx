import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import Link from "next/link";
import { PageHeader, EmptyState } from "@/components/ui/kit";

export default async function SessionsPage() {
  const userId = await requireUser();
  const sessions = await prisma.sessionLog.findMany({ where: { userId }, include: { machine: true, preset: true, recipe: true }, orderBy: { sessionDate: "desc" } });
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto fade-up">
      <PageHeader title="Session log" subtitle="Technical work journal" actions={
        <Link href="/sessions/new" className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-sm hover:opacity-90">+ New</Link>
      } />
      {sessions.length === 0 ? (
        <EmptyState title="No sessions yet" description="Log your first session." action={<Link href="/sessions/new" className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-sm hover:opacity-90">+ New</Link>} />
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => (
            <Link key={s.id} href={`/sessions/${s.id}`} className="group block bg-card border border-border rounded-sm p-5 card-shadow hover:border-border-hover transition-all fade-up">
              <div className="flex items-start justify-between">
                <div className="font-medium text-foreground group-hover:text-accent transition-colors">{new Date(s.sessionDate).toLocaleDateString()}</div>
              </div>
              <div className="text-xs text-muted mt-1">{s.machine?.customName || s.machine?.brand} · {s.preset?.name} · {s.recipe?.name}</div>
              {s.notes && <div className="text-xs text-muted mt-2 line-clamp-2">{s.notes}</div>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
