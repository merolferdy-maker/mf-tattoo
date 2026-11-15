"use server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createSession(formData: FormData) {
  const userId = await requireUser();
  await prisma.sessionLog.create({
    data: {
      userId,
      sessionDate: formData.get("sessionDate") ? new Date(String(formData.get("sessionDate"))) : new Date(),
      machineId: formData.get("machineId") ? String(formData.get("machineId")) : null,
      presetId: formData.get("presetId") ? String(formData.get("presetId")) : null,
      cartridgeInfo: formData.get("cartridgeInfo") ? String(formData.get("cartridgeInfo")) : null,
      inkUsed: formData.get("inkUsed") ? String(formData.get("inkUsed")) : null,
      recipeId: formData.get("recipeId") ? String(formData.get("recipeId")) : null,
      notes: formData.get("notes") ? String(formData.get("notes")) : null,
      imageUrls: formData.get("imageUrls") ? String(formData.get("imageUrls")) : null,
    },
  });
  revalidatePath("/sessions");
}

export async function deleteSession(id: string) {
  const userId = await requireUser();
  await prisma.sessionLog.deleteMany({ where: { id, userId } });
  revalidatePath("/sessions");
}
