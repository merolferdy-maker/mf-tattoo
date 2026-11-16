import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import Link from "next/link";
import { PageHeader, EmptyState } from "@/components/ui/kit";
import { SessionsTabs } from "@/components/SessionsTabs";
import { parseImageUrls } from "@/lib/images";

export default async function PortfolioPage() {
  const userId = await requireUser();
  const entries = await prisma.portfolioEntry.findMany({ where: { userId }, include: { machine: true }, orderBy: { sessionDate: "desc" } });
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto fade-up">
      <PageHeader title="Tattoo portfolio" subtitle="Photos of your tattoo work" actions={
        <Link href="/sessions/portfolio/new" className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-sm hover:opacity-90">+ Add tattoo</Link>
      } />
      <SessionsTabs active="portfolio" />
      {entries.length === 0 ? (
        <EmptyState title="No tattoos yet" description="Add photos of your work to build your tattoo portfolio." action={<Link href="/sessions/portfolio/new" className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-sm hover:opacity-90">+ Add tattoo</Link>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {entries.map((e) => {
            const photos = parseImageUrls(e.imageUrls);
            return (
              <Link key={e.id} href={`/sessions/portfolio/${e.id}`} className="group block bg-card border border-border rounded-sm card-shadow hover:border-border-hover transition-all fade-up overflow-hidden">
                {photos.length > 0 && (
                  <div className="bg-black overflow-hidden flex justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photos[0]} alt="tattoo" className="h-[26rem] w-auto object-contain group-hover:opacity-90 transition-opacity" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="font-medium text-foreground group-hover:text-accent transition-colors">{new Date(e.sessionDate).toLocaleDateString()}</div>
                    {photos.length > 0 && <span className="text-xs text-muted">{photos.length} photo{photos.length === 1 ? "" : "s"}</span>}
                  </div>
                  <div className="text-xs text-muted mt-1">
                    {[
                      e.machine ? (e.machine.customName || `${e.machine.brand} ${e.machine.model}`) : null,
                      e.washType === "WHITEWASH" ? "Whitewash" : e.washType === "GRAYWASH" ? "Graywash" : null,
                    ].filter(Boolean).join(" · ") || "—"}
                  </div>
                  {e.notes && <div className="text-xs text-muted mt-2 line-clamp-2">{e.notes}</div>}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
