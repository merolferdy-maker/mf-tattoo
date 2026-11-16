import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import Link from "next/link";
import { PageHeader, EmptyState } from "@/components/ui/kit";
import { SessionsTabs } from "@/components/SessionsTabs";
import { parseImageUrls } from "@/lib/images";

export default async function SessionsPage() {
  const userId = await requireUser();
  const sessions = await prisma.sessionLog.findMany({ where: { userId }, include: { machine: true, preset: true, recipe: true }, orderBy: { sessionDate: "desc" } });
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto fade-up">
      <PageHeader title="Session log" subtitle="Technical work journal" actions={
        <Link href="/sessions/new" className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-sm hover:opacity-90">+ New</Link>
      } />
      <SessionsTabs active="log" />
      {sessions.length === 0 ? (
        <EmptyState title="No sessions yet" description="Log your first session and add photos of your tattoos." action={<Link href="/sessions/new" className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-sm hover:opacity-90">+ New</Link>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {sessions.map((s) => {
            const photos = parseImageUrls(s.imageUrls);
            return (
              <Link key={s.id} href={`/sessions/${s.id}`} className="group block bg-card border border-border rounded-sm card-shadow hover:border-border-hover transition-all fade-up overflow-hidden">
                {photos.length > 0 && (
                  <div className="bg-black overflow-hidden w-fit mx-auto">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photos[0]} alt="tattoo" className="h-[26rem] w-auto object-contain group-hover:opacity-90 transition-opacity" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="font-medium text-foreground group-hover:text-accent transition-colors">{new Date(s.sessionDate).toLocaleDateString()}</div>
                    {photos.length > 0 && <span className="text-xs text-muted">{photos.length} photo{photos.length === 1 ? "" : "s"}</span>}
                  </div>
                  <div className="text-xs text-muted mt-1">{s.machine?.customName || s.machine?.brand} · {s.preset?.name}{s.washType ? ` · ${s.washType === "WHITEWASH" ? "Whitewash" : s.washType === "GRAYWASH" ? "Graywash" : s.washType}` : ""}</div>
                  {s.notes && <div className="text-xs text-muted mt-2 line-clamp-2">{s.notes}</div>}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
