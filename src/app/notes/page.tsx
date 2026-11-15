import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import Link from "next/link";

export default async function NotesPage() {
  const userId = await requireUser();
  const notes = await prisma.technicalNote.findMany({ where: { userId }, orderBy: { updatedAt: "desc" } });
  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Technical notes</h1>
        <Link href="/notes/new" className="px-3 py-2 text-sm bg-foreground text-background">+ New note</Link>
      </div>
      {notes.length === 0 && <div className="text-muted text-sm border border-border p-6 text-center">No notes yet.</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {notes.map((n) => (
          <Link key={n.id} href={`/notes/${n.id}`} className="bg-card border border-border p-4 hover:border-accent">
            <div className="flex items-center justify-between">
              <div className="font-medium">{n.title}</div>
              {n.favorite && <span className="text-accent text-xs">★</span>}
            </div>
            <div className="text-xs text-muted mt-1">{n.category} · {n.tags}</div>
            <div className="text-xs text-muted mt-1 line-clamp-2">{n.description}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
