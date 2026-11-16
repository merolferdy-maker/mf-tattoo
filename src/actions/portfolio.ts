"use server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { parseImageUrls, serializeImageUrls } from "@/lib/images";

function readData(formData: FormData) {
  return {
    sessionDate: formData.get("sessionDate") ? new Date(String(formData.get("sessionDate"))) : new Date(),
    machineId: formData.get("machineId") ? String(formData.get("machineId")) : null,
    washType: formData.get("washType") ? String(formData.get("washType")) : null,
    notes: formData.get("notes") ? String(formData.get("notes")) : null,
    imageUrls: serializeImageUrls(parseImageUrls(formData.get("imageUrls") ? String(formData.get("imageUrls")) : null)),
  };
}

export async function createPortfolio(formData: FormData) {
  const userId = await requireUser();
  await prisma.portfolioEntry.create({ data: { userId, ...readData(formData) } });
  revalidatePath("/sessions/portfolio");
  revalidatePath("/sessions");
  redirect("/sessions/portfolio");
}

export async function updatePortfolio(id: string, formData: FormData) {
  const userId = await requireUser();
  await prisma.portfolioEntry.updateMany({ where: { id, userId }, data: readData(formData) });
  revalidatePath("/sessions/portfolio");
  revalidatePath(`/sessions/portfolio/${id}`);
  redirect(`/sessions/portfolio/${id}`);
}

export async function deletePortfolio(id: string) {
  const userId = await requireUser();
  await prisma.portfolioEntry.deleteMany({ where: { id, userId } });
  revalidatePath("/sessions/portfolio");
  redirect("/sessions/portfolio");
}
