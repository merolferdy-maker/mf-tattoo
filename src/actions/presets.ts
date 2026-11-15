"use server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createPreset(formData: FormData) {
  const userId = await requireUser();
  const machineId = String(formData.get("machineId"));
  const p = await prisma.machinePreset.create({
    data: {
      userId,
      machineId,
      name: String(formData.get("name") || ""),
      category: String(formData.get("category") || "CUSTOM"),
      voltage: formData.get("voltage") ? Number(formData.get("voltage")) : null,
      stroke: formData.get("stroke") ? Number(formData.get("stroke")) : null,
      needleConfig: formData.get("needleConfig") ? String(formData.get("needleConfig")) : null,
      cartridgeBrand: formData.get("cartridgeBrand") ? String(formData.get("cartridgeBrand")) : null,
      needleDiameter: formData.get("needleDiameter") ? Number(formData.get("needleDiameter")) : null,
      taper: formData.get("taper") ? String(formData.get("taper")) : null,
      technique: formData.get("technique") ? String(formData.get("technique")) : null,
      notes: formData.get("notes") ? String(formData.get("notes")) : null,
      favorite: formData.get("favorite") === "on",
    },
  });
  // initial version
  await prisma.presetVersion.create({
    data: { userId, presetId: p.id, versionNumber: 1, voltage: p.voltage, stroke: p.stroke, needleConfig: p.needleConfig, cartridgeBrand: p.cartridgeBrand, needleDiameter: p.needleDiameter, taper: p.taper, technique: p.technique, notes: p.notes },
  });
  revalidatePath("/presets");
}

export async function updatePreset(id: string, formData: FormData) {
  const userId = await requireUser();
  const existing = await prisma.machinePreset.findFirst({ where: { id, userId } });
  if (!existing) return;
  const data = {
    name: String(formData.get("name") || ""),
    category: String(formData.get("category") || "CUSTOM"),
    voltage: formData.get("voltage") ? Number(formData.get("voltage")) : null,
    stroke: formData.get("stroke") ? Number(formData.get("stroke")) : null,
    needleConfig: formData.get("needleConfig") ? String(formData.get("needleConfig")) : null,
    cartridgeBrand: formData.get("cartridgeBrand") ? String(formData.get("cartridgeBrand")) : null,
    needleDiameter: formData.get("needleDiameter") ? Number(formData.get("needleDiameter")) : null,
    taper: formData.get("taper") ? String(formData.get("taper")) : null,
    technique: formData.get("technique") ? String(formData.get("technique")) : null,
    notes: formData.get("notes") ? String(formData.get("notes")) : null,
    favorite: formData.get("favorite") === "on",
  };
  await prisma.machinePreset.updateMany({ where: { id, userId }, data });
  const count = await prisma.presetVersion.count({ where: { presetId: id } });
  await prisma.presetVersion.create({
    data: { userId, presetId: id, versionNumber: count + 1, voltage: data.voltage, stroke: data.stroke, needleConfig: data.needleConfig, cartridgeBrand: data.cartridgeBrand, needleDiameter: data.needleDiameter, taper: data.taper, technique: data.technique, notes: data.notes },
  });
  revalidatePath("/presets");
}

export async function deletePreset(id: string) {
  const userId = await requireUser();
  await prisma.machinePreset.deleteMany({ where: { id, userId } });
  revalidatePath("/presets");
}

export async function duplicatePreset(id: string) {
  const userId = await requireUser();
  const p = await prisma.machinePreset.findFirst({ where: { id, userId } });
  if (!p) return;
  await prisma.machinePreset.create({
    data: {
      userId, machineId: p.machineId, name: p.name + " (copy)", category: p.category,
      voltage: p.voltage, stroke: p.stroke, needleConfig: p.needleConfig, cartridgeBrand: p.cartridgeBrand,
      needleDiameter: p.needleDiameter, taper: p.taper, technique: p.technique, notes: p.notes, favorite: false,
    },
  });
  revalidatePath("/presets");
}
