import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { SessionForm } from "@/components/SessionForm";

export default async function NewSessionPage() {
  const userId = await requireUser();
  const [machines, presets, recipes] = await Promise.all([
    prisma.machine.findMany({ where: { userId } }),
    prisma.machinePreset.findMany({ where: { userId } }),
    prisma.washRecipe.findMany({ where: { userId } }),
  ]);
  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl font-semibold mb-4">New session</h1>
      <SessionForm machines={machines} presets={presets} recipes={recipes} />
    </div>
  );
}
