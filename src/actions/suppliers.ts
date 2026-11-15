"use server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createSupplier(formData: FormData) {
  const userId = await requireUser();
  await prisma.supplier.create({
    data: {
      userId,
      name: String(formData.get("name") || ""),
      website: formData.get("website") ? String(formData.get("website")) : null,
      email: formData.get("email") ? String(formData.get("email")) : null,
      phone: formData.get("phone") ? String(formData.get("phone")) : null,
      contactPerson: formData.get("contactPerson") ? String(formData.get("contactPerson")) : null,
      address: formData.get("address") ? String(formData.get("address")) : null,
      notes: formData.get("notes") ? String(formData.get("notes")) : null,
    },
  });
  revalidatePath("/suppliers");
}

export async function updateSupplier(id: string, formData: FormData) {
  const userId = await requireUser();
  await prisma.supplier.updateMany({
    where: { id, userId },
    data: {
      name: String(formData.get("name") || ""),
      website: formData.get("website") ? String(formData.get("website")) : null,
      email: formData.get("email") ? String(formData.get("email")) : null,
      phone: formData.get("phone") ? String(formData.get("phone")) : null,
      contactPerson: formData.get("contactPerson") ? String(formData.get("contactPerson")) : null,
      address: formData.get("address") ? String(formData.get("address")) : null,
      notes: formData.get("notes") ? String(formData.get("notes")) : null,
    },
  });
  revalidatePath("/suppliers");
}

export async function deleteSupplier(id: string) {
  const userId = await requireUser();
  await prisma.supplier.deleteMany({ where: { id, userId } });
  revalidatePath("/suppliers");
}
