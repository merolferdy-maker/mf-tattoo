import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import Link from "next/link";

export default async function SessionsPage() {
  const userId = await requireUser();
  const sessions = await prisma.sessionLog.findMany({ where: { userId }, include: { machine: true, preset: true, recipe: true }, orderBy: { sessionDate: "desc" } });
  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Session log</h1>
        <Link href="/sessions/new" className="px-3 py-2 text-sm bg-foreground text-background">+ New</Link>
      </div>
      {sessions.length === 0 && <div className="text-muted text-sm border border-border p-6 text-center">No sessions yet.</div>}
      <div className="space-y-2">
        {sessions.map((s) => (
          <Link key={s.id} href={`/sessions/${s.id}`} className="block bg-card border border-border p-4 hover:border-accent">
            <div className="font-medium">{new Date(s.sessionDate).toLocaleDateString()}</div>
            <div className="text-xs text-muted mt-1">{s.machine?.customName || s.machine?.brand} · {s.preset?.name} · {s.recipe?.name}</div>
            <div className="text-xs text-muted mt-1 line-clamp-2">{s.notes}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
