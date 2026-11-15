"use server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createCartridge(formData: FormData) {
  const userId = await requireUser();
  await prisma.cartridge.create({
    data: {
      userId,
      brand: String(formData.get("brand") || ""),
      productName: String(formData.get("productName") || ""),
      configuration: formData.get("configuration") ? String(formData.get("configuration")) : null,
      needleCount: formData.get("needleCount") ? Number(formData.get("needleCount")) : null,
      needleDiameter: formData.get("needleDiameter") ? Number(formData.get("needleDiameter")) : null,
      taper: formData.get("taper") ? String(formData.get("taper")) : null,
      cartridgeType: formData.get("cartridgeType") ? String(formData.get("cartridgeType")) : null,
      compatibility: formData.get("compatibility") ? String(formData.get("compatibility")) : null,
      quantity: formData.get("quantity") ? Number(formData.get("quantity")) : 0,
      initialQuantity: formData.get("initialQuantity") ? Number(formData.get("initialQuantity")) : 0,
      minStockLevel: formData.get("minStockLevel") ? Number(formData.get("minStockLevel")) : 0,
      purchasePrice: formData.get("purchasePrice") ? Number(formData.get("purchasePrice")) : null,
      supplierId: formData.get("supplierId") ? String(formData.get("supplierId")) : null,
      imageUrl: formData.get("imageUrl") ? String(formData.get("imageUrl")) : null,
      notes: formData.get("notes") ? String(formData.get("notes")) : null,
      favorite: formData.get("favorite") === "on",
    },
  });
  revalidatePath("/cartridges");
  revalidatePath("/dashboard");
}

export async function updateCartridge(id: string, formData: FormData) {
  const userId = await requireUser();
  await prisma.cartridge.updateMany({
    where: { id, userId },
    data: {
      brand: String(formData.get("brand") || ""),
      productName: String(formData.get("productName") || ""),
      configuration: formData.get("configuration") ? String(formData.get("configuration")) : null,
      needleCount: formData.get("needleCount") ? Number(formData.get("needleCount")) : null,
      needleDiameter: formData.get("needleDiameter") ? Number(formData.get("needleDiameter")) : null,
      taper: formData.get("taper") ? String(formData.get("taper")) : null,
      cartridgeType: formData.get("cartridgeType") ? String(formData.get("cartridgeType")) : null,
      compatibility: formData.get("compatibility") ? String(formData.get("compatibility")) : null,
      quantity: formData.get("quantity") ? Number(formData.get("quantity")) : 0,
      initialQuantity: formData.get("initialQuantity") ? Number(formData.get("initialQuantity")) : 0,
      minStockLevel: formData.get("minStockLevel") ? Number(formData.get("minStockLevel")) : 0,
      purchasePrice: formData.get("purchasePrice") ? Number(formData.get("purchasePrice")) : null,
      supplierId: formData.get("supplierId") ? String(formData.get("supplierId")) : null,
      imageUrl: formData.get("imageUrl") ? String(formData.get("imageUrl")) : null,
      notes: formData.get("notes") ? String(formData.get("notes")) : null,
      favorite: formData.get("favorite") === "on",
    },
  });
  revalidatePath("/cartridges");
}

export async function deleteCartridge(id: string) {
  const userId = await requireUser();
  await prisma.cartridge.deleteMany({ where: { id, userId } });
  revalidatePath("/cartridges");
  revalidatePath("/dashboard");
}
