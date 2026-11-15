"use server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { parseImageUrls, serializeImageUrls } from "@/lib/images";

function readData(formData: FormData) {
  return {
    sessionDate: formData.get("sessionDate") ? new Date(String(formData.get("sessionDate"))) : new Date(),
    machineId: formData.get("machineId") ? String(formData.get("machineId")) : null,
    presetId: formData.get("presetId") ? String(formData.get("presetId")) : null,
    cartridgeInfo: formData.get("cartridgeInfo") ? String(formData.get("cartridgeInfo")) : null,
    inkUsed: formData.get("inkUsed") ? String(formData.get("inkUsed")) : null,
    recipeId: formData.get("recipeId") ? String(formData.get("recipeId")) : null,
    notes: formData.get("notes") ? String(formData.get("notes")) : null,
    imageUrls: serializeImageUrls(parseImageUrls(formData.get("imageUrls") ? String(formData.get("imageUrls")) : null)),
  };
}

export async function createSession(formData: FormData) {
  const userId = await requireUser();
  await prisma.sessionLog.create({ data: { userId, ...readData(formData) } });
  revalidatePath("/sessions");
}

export async function updateSession(id: string, formData: FormData) {
  const userId = await requireUser();
  await prisma.sessionLog.updateMany({ where: { id, userId }, data: readData(formData) });
  revalidatePath("/sessions");
  revalidatePath(`/sessions/${id}`);
}

export async function deleteSession(id: string) {
  const userId = await requireUser();
  await prisma.sessionLog.deleteMany({ where: { id, userId } });
  revalidatePath("/sessions");
}
