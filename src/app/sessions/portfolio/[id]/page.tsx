import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { deletePortfolio } from "@/actions/portfolio";
import { notFound } from "next/navigation";
import Link from "next/link";
import { parseImageUrls } from "@/lib/images";

export default async function PortfolioDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await requireUser();
  const e = await prisma.portfolioEntry.findFirst({ where: { id, userId }, include: { machine: true } });
  if (!e) notFound();
  const photos = parseImageUrls(e.imageUrls);
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{new Date(e.sessionDate).toLocaleDateString()}</h1>
        <div className="flex gap-2">
          <Link href={`/sessions/portfolio/${e.id}/edit`} className="px-4 py-2 border border-border text-sm rounded-sm hover:bg-card-hover">Edit</Link>
          <form action={deletePortfolio.bind(null, e.id)}><button className="px-4 py-2 border border-red-900 text-red-400 text-sm rounded-sm">Delete</button></form>
        </div>
      </div>

      {photos.length > 0 ? (
        <div className="space-y-4">
          {photos.map((src, i) => (
            <a key={i} href={src} target="_blank" rel="noreferrer" className="block bg-black border border-border rounded-sm overflow-hidden group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`tattoo ${i + 1}`} className="w-full max-h-[85vh] object-contain group-hover:opacity-90 transition-opacity" />
            </a>
          ))}
        </div>
      ) : (
        <div className="text-sm text-muted">No photos.</div>
      )}

      <div className="bg-card border border-border p-4 space-y-1 text-sm rounded-sm">
        <div>Color type: {e.washType === "WHITEWASH" ? "Whitewash" : e.washType === "GRAYWASH" ? "Graywash" : "—"}</div>
        <div>Machine: {e.machine ? (e.machine.customName || `${e.machine.brand} ${e.machine.model}`) : "—"}</div>
        <div>Notes: {e.notes || "—"}</div>
      </div>
    </div>
  );
}
