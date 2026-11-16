import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { deleteSession } from "@/actions/sessions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { parseImageUrls } from "@/lib/images";

export default async function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await requireUser();
  const s = await prisma.sessionLog.findFirst({ where: { id, userId }, include: { machine: true, preset: true, recipe: true } });
  if (!s) notFound();
  const photos = parseImageUrls(s.imageUrls);
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{new Date(s.sessionDate).toLocaleDateString()}</h1>
        <div className="flex gap-2">
          <Link href={`/sessions/${s.id}/edit`} className="px-4 py-2 border border-border text-sm rounded-sm hover:bg-card-hover">Edit</Link>
          <form action={deleteSession.bind(null, s.id)}><button className="px-4 py-2 border border-red-900 text-red-400 text-sm rounded-sm">Delete</button></form>
        </div>
      </div>

      {photos.length > 0 && (
        <div className="space-y-4">
          {photos.map((src, i) => (
            <a key={i} href={src} target="_blank" rel="noreferrer" className="block bg-black border border-border rounded-sm overflow-hidden group w-fit mx-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`tattoo ${i + 1}`} className="max-h-[85vh] w-auto object-contain group-hover:opacity-90 transition-opacity" />
            </a>
          ))}
        </div>
      )}

      <div className="bg-card border border-border p-4 space-y-1 text-sm rounded-sm">
        <div>Machine: {s.machine?.customName || s.machine?.brand}</div>
        <div>Preset: {s.preset?.name}</div>
        <div>Cartridge: {s.cartridgeInfo}</div>
        <div>Ink: {s.inkUsed}</div>
        <div>Color type: {s.washType === "WHITEWASH" ? "Whitewash" : s.washType === "GRAYWASH" ? "Graywash" : "—"}</div>
        <div>Notes: {s.notes}</div>
      </div>
    </div>
  );
}
