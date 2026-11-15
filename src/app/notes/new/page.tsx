import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { NoteForm } from "@/components/NoteForm";

export default async function NewNotePage() {
  const userId = await requireUser();
  const [machines, presets, cartridges, recipes] = await Promise.all([
    prisma.machine.findMany({ where: { userId } }),
    prisma.machinePreset.findMany({ where: { userId } }),
    prisma.cartridge.findMany({ where: { userId } }),
    prisma.washRecipe.findMany({ where: { userId } }),
  ]);
  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl font-semibold mb-4">New note</h1>
      <NoteForm machines={machines} presets={presets} cartridges={cartridges} recipes={recipes} />
    </div>
  );
}
