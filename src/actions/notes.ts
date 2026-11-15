"use server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createNote(formData: FormData) {
  const userId = await requireUser();
  await prisma.technicalNote.create({
    data: {
      userId,
      title: String(formData.get("title") || ""),
      category: formData.get("category") ? String(formData.get("category")) : null,
      description: formData.get("description") ? String(formData.get("description")) : null,
      tags: formData.get("tags") ? String(formData.get("tags")) : null,
      imageUrl: formData.get("imageUrl") ? String(formData.get("imageUrl")) : null,
      machineId: formData.get("machineId") ? String(formData.get("machineId")) : null,
      presetId: formData.get("presetId") ? String(formData.get("presetId")) : null,
      cartridgeId: formData.get("cartridgeId") ? String(formData.get("cartridgeId")) : null,
      recipeId: formData.get("recipeId") ? String(formData.get("recipeId")) : null,
      favorite: formData.get("favorite") === "on",
    },
  });
  revalidatePath("/notes");
  revalidatePath("/dashboard");
}

export async function updateNote(id: string, formData: FormData) {
  const userId = await requireUser();
  await prisma.technicalNote.updateMany({
    where: { id, userId },
    data: {
      title: String(formData.get("title") || ""),
      category: formData.get("category") ? String(formData.get("category")) : null,
      description: formData.get("description") ? String(formData.get("description")) : null,
      tags: formData.get("tags") ? String(formData.get("tags")) : null,
      imageUrl: formData.get("imageUrl") ? String(formData.get("imageUrl")) : null,
      machineId: formData.get("machineId") ? String(formData.get("machineId")) : null,
      presetId: formData.get("presetId") ? String(formData.get("presetId")) : null,
      cartridgeId: formData.get("cartridgeId") ? String(formData.get("cartridgeId")) : null,
      recipeId: formData.get("recipeId") ? String(formData.get("recipeId")) : null,
      favorite: formData.get("favorite") === "on",
    },
  });
  revalidatePath("/notes");
}

export async function deleteNote(id: string) {
  const userId = await requireUser();
  await prisma.technicalNote.deleteMany({ where: { id, userId } });
  revalidatePath("/notes");
}
