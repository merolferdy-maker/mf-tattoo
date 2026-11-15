"use server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createInk(formData: FormData) {
  const userId = await requireUser();
  await prisma.inkProduct.create({
    data: {
      userId,
      brand: String(formData.get("brand") || ""),
      productName: String(formData.get("productName") || ""),
      colorName: String(formData.get("colorName") || ""),
      colorCode: formData.get("colorCode") ? String(formData.get("colorCode")) : null,
      category: formData.get("category") ? String(formData.get("category")) : null,
      bottleVolume: formData.get("bottleVolume") ? Number(formData.get("bottleVolume")) : null,
      currentQuantity: formData.get("currentQuantity") ? Number(formData.get("currentQuantity")) : 0,
      initialQuantity: formData.get("initialQuantity") ? Number(formData.get("initialQuantity")) : 0,
      minStockLevel: formData.get("minStockLevel") ? Number(formData.get("minStockLevel")) : 0,
      purchaseDate: formData.get("purchaseDate") ? new Date(String(formData.get("purchaseDate"))) : null,
      openingDate: formData.get("openingDate") ? new Date(String(formData.get("openingDate"))) : null,
      expirationDate: formData.get("expirationDate") ? new Date(String(formData.get("expirationDate"))) : null,
      batchNumber: formData.get("batchNumber") ? String(formData.get("batchNumber")) : null,
      supplierId: formData.get("supplierId") ? String(formData.get("supplierId")) : null,
      price: formData.get("price") ? Number(formData.get("price")) : null,
      imageUrl: formData.get("imageUrl") ? String(formData.get("imageUrl")) : null,
      notes: formData.get("notes") ? String(formData.get("notes")) : null,
      favorite: formData.get("favorite") === "on",
    },
  });
  revalidatePath("/inks");
  revalidatePath("/dashboard");
}

export async function updateInk(id: string, formData: FormData) {
  const userId = await requireUser();
  await prisma.inkProduct.updateMany({
    where: { id, userId },
    data: {
      brand: String(formData.get("brand") || ""),
      productName: String(formData.get("productName") || ""),
      colorName: String(formData.get("colorName") || ""),
      colorCode: formData.get("colorCode") ? String(formData.get("colorCode")) : null,
      category: formData.get("category") ? String(formData.get("category")) : null,
      bottleVolume: formData.get("bottleVolume") ? Number(formData.get("bottleVolume")) : null,
      currentQuantity: formData.get("currentQuantity") ? Number(formData.get("currentQuantity")) : 0,
      initialQuantity: formData.get("initialQuantity") ? Number(formData.get("initialQuantity")) : 0,
      minStockLevel: formData.get("minStockLevel") ? Number(formData.get("minStockLevel")) : 0,
      purchaseDate: formData.get("purchaseDate") ? new Date(String(formData.get("purchaseDate"))) : null,
      openingDate: formData.get("openingDate") ? new Date(String(formData.get("openingDate"))) : null,
      expirationDate: formData.get("expirationDate") ? new Date(String(formData.get("expirationDate"))) : null,
      batchNumber: formData.get("batchNumber") ? String(formData.get("batchNumber")) : null,
      supplierId: formData.get("supplierId") ? String(formData.get("supplierId")) : null,
      price: formData.get("price") ? Number(formData.get("price")) : null,
      imageUrl: formData.get("imageUrl") ? String(formData.get("imageUrl")) : null,
      notes: formData.get("notes") ? String(formData.get("notes")) : null,
      favorite: formData.get("favorite") === "on",
    },
  });
  revalidatePath("/inks");
}

export async function deleteInk(id: string) {
  const userId = await requireUser();
  await prisma.inkProduct.deleteMany({ where: { id, userId } });
  revalidatePath("/inks");
  revalidatePath("/dashboard");
}
