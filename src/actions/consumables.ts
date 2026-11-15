"use server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createConsumable(formData: FormData) {
  const userId = await requireUser();
  await prisma.consumable.create({
    data: {
      userId,
      name: String(formData.get("name") || ""),
      brand: formData.get("brand") ? String(formData.get("brand")) : null,
      category: formData.get("category") ? String(formData.get("category")) : null,
      quantity: formData.get("quantity") ? Math.round(Number(formData.get("quantity"))) : 0,
      unit: formData.get("unit") ? String(formData.get("unit")) : null,
      minStockLevel: formData.get("minStockLevel") ? Math.round(Number(formData.get("minStockLevel"))) : 0,
      price: formData.get("price") ? Number(formData.get("price")) : null,
      supplierId: formData.get("supplierId") ? String(formData.get("supplierId")) : null,
      purchaseDate: formData.get("purchaseDate") ? new Date(String(formData.get("purchaseDate"))) : null,
      expirationDate: formData.get("expirationDate") ? new Date(String(formData.get("expirationDate"))) : null,
      imageUrl: formData.get("imageUrl") ? String(formData.get("imageUrl")) : null,
      notes: formData.get("notes") ? String(formData.get("notes")) : null,
    },
  });
  revalidatePath("/consumables");
  revalidatePath("/dashboard");
}

export async function updateConsumable(id: string, formData: FormData) {
  const userId = await requireUser();
  await prisma.consumable.updateMany({
    where: { id, userId },
    data: {
      name: String(formData.get("name") || ""),
      brand: formData.get("brand") ? String(formData.get("brand")) : null,
      category: formData.get("category") ? String(formData.get("category")) : null,
      quantity: formData.get("quantity") ? Math.round(Number(formData.get("quantity"))) : 0,
      unit: formData.get("unit") ? String(formData.get("unit")) : null,
      minStockLevel: formData.get("minStockLevel") ? Math.round(Number(formData.get("minStockLevel"))) : 0,
      price: formData.get("price") ? Number(formData.get("price")) : null,
      supplierId: formData.get("supplierId") ? String(formData.get("supplierId")) : null,
      purchaseDate: formData.get("purchaseDate") ? new Date(String(formData.get("purchaseDate"))) : null,
      expirationDate: formData.get("expirationDate") ? new Date(String(formData.get("expirationDate"))) : null,
      imageUrl: formData.get("imageUrl") ? String(formData.get("imageUrl")) : null,
      notes: formData.get("notes") ? String(formData.get("notes")) : null,
    },
  });
  revalidatePath("/consumables");
}

export async function deleteConsumable(id: string) {
  const userId = await requireUser();
  await prisma.consumable.deleteMany({ where: { id, userId } });
  revalidatePath("/consumables");
  revalidatePath("/dashboard");
}
