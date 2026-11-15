import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { PresetForm } from "@/components/PresetForm";

export default async function NewPresetPage() {
  const userId = await requireUser();
  const machines = await prisma.machine.findMany({ where: { userId } });
  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl font-semibold mb-4">New preset</h1>
      <PresetForm machines={machines} />
    </div>
  );
}
