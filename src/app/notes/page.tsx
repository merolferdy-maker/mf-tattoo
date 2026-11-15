import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import Link from "next/link";
import { PageHeader, EmptyState } from "@/components/ui/kit";

export default async function NotesPage() {
  const userId = await requireUser();
  const notes = await prisma.technicalNote.findMany({ where: { userId }, orderBy: { updatedAt: "desc" } });
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto fade-up">
      <PageHeader title="Technical notes" subtitle="Your knowledge base" actions={
        <Link href="/notes/new" className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-sm hover:opacity-90">+ New note</Link>
      } />
      {notes.length === 0 ? (
        <EmptyState title="No notes yet" description="Create your first technical note." action={<Link href="/notes/new" className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-sm hover:opacity-90">+ New note</Link>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {notes.map((n) => (
            <Link key={n.id} href={`/notes/${n.id}`} className="group bg-card border border-border rounded-sm p-5 card-shadow hover:border-border-hover transition-all fade-up">
              <div className="flex items-start justify-between">
                <div className="font-medium text-foreground group-hover:text-accent transition-colors">{n.title}</div>
                {n.favorite && <span className="text-accent text-sm">★</span>}
              </div>
              <div className="text-xs text-muted mt-1">{n.category} · {n.tags}</div>
              <div className="mt-3 text-xs text-muted line-clamp-2">{n.description}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
