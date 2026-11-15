import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { PresetForm } from "@/components/PresetForm";
import { deletePreset, duplicatePreset } from "@/actions/presets";
import { notFound } from "next/navigation";

export default async function PresetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await requireUser();
  const preset = await prisma.machinePreset.findFirst({ where: { id, userId }, include: { machine: true } });
  if (!preset) notFound();
  const machines = await prisma.machine.findMany({ where: { userId } });
  const versions = await prisma.presetVersion.findMany({ where: { presetId: id }, orderBy: { versionNumber: "desc" } });
  return (
    <div className="p-4 md:p-6 space-y-4">
      <h1 className="text-xl font-semibold">{preset.name}</h1>
      <PresetForm machines={machines} initial={preset} />
      <div className="flex gap-2">
        <form action={duplicatePreset.bind(null, preset.id)}><button className="px-4 py-2 border border-border text-sm">Duplicate</button></form>
        <form action={deletePreset.bind(null, preset.id)}><button className="px-4 py-2 border border-red-900 text-red-400 text-sm">Delete</button></form>
      </div>
      {versions.length > 0 && (
        <div className="border border-border p-3">
          <div className="text-sm font-medium mb-2">Version history</div>
          {versions.map((v) => (
            <div key={v.id} className="text-xs text-muted border-b border-border py-1">
              v{v.versionNumber} · {v.voltage ?? "-"}V · {v.stroke ?? "-"}mm · {new Date(v.createdAt).toLocaleString()}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
