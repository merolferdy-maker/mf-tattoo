import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { NoteForm } from "@/components/NoteForm";
import { deleteNote } from "@/actions/notes";
import { notFound } from "next/navigation";

export default async function NoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await requireUser();
  const note = await prisma.technicalNote.findFirst({ where: { id, userId } });
  if (!note) notFound();
  const [machines, presets, cartridges, recipes] = await Promise.all([
    prisma.machine.findMany({ where: { userId } }),
    prisma.machinePreset.findMany({ where: { userId } }),
    prisma.cartridge.findMany({ where: { userId } }),
    prisma.washRecipe.findMany({ where: { userId } }),
  ]);
  return (
    <div className="p-4 md:p-6 space-y-4">
      <h1 className="text-xl font-semibold">{note.title}</h1>
      <NoteForm machines={machines} presets={presets} cartridges={cartridges} recipes={recipes} initial={note} />
      <form action={deleteNote.bind(null, note.id)}><button className="px-4 py-2 border border-red-900 text-red-400 text-sm">Delete</button></form>
    </div>
  );
}
