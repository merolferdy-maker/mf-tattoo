"use server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function recordMovement(formData: FormData) {
  const userId = await requireUser();
  const type = String(formData.get("type") || "ADDITION");
  const itemType = String(formData.get("itemType") || "INK");
  const itemId = String(formData.get("itemId") || "");
  const quantity = Number(formData.get("quantity") || 0);
  const notes = formData.get("notes") ? String(formData.get("notes")) : null;

  // resolve item name
  let itemName = "";
  if (itemType === "INK") {
    const i = await prisma.inkProduct.findFirst({ where: { id: itemId, userId } });
    itemName = i ? `${i.brand} ${i.colorName}` : "";
    if (i) {
      const delta = type === "CONSUMPTION" || type === "DISPOSAL" || type === "EXPIRATION" ? -Math.abs(quantity) : Math.abs(quantity);
      await prisma.inkProduct.update({ where: { id: itemId }, data: { currentQuantity: i.currentQuantity + delta } });
    }
  } else if (itemType === "CARTRIDGE") {
    const c = await prisma.cartridge.findFirst({ where: { id: itemId, userId } });
    itemName = c ? `${c.brand} ${c.productName}` : "";
    if (c) {
      const delta = type === "CONSUMPTION" || type === "DISPOSAL" || type === "EXPIRATION" ? -Math.abs(quantity) : Math.abs(quantity);
      await prisma.cartridge.update({ where: { id: itemId }, data: { quantity: c.quantity + delta } });
    }
  } else if (itemType === "CONSUMABLE") {
    const c = await prisma.consumable.findFirst({ where: { id: itemId, userId } });
    itemName = c ? c.name : "";
    if (c) {
      const delta = type === "CONSUMPTION" || type === "DISPOSAL" || type === "EXPIRATION" ? -Math.abs(quantity) : Math.abs(quantity);
      await prisma.consumable.update({ where: { id: itemId }, data: { quantity: c.quantity + delta } });
    }
  }

  await prisma.stockMovement.create({
    data: { userId, type, itemType, itemId, itemName, quantity: Math.abs(quantity), notes },
  });
  revalidatePath("/stock");
  revalidatePath("/dashboard");
}

export async function markPurchased(formData: FormData) {
  // simple: record addition for item
  const fd = new FormData();
  fd.set("type", "PURCHASE");
  fd.set("itemType", String(formData.get("itemType")));
  fd.set("itemId", String(formData.get("itemId")));
  fd.set("quantity", String(formData.get("quantity") || 1));
  fd.set("notes", "Marked purchased");
  await recordMovement(fd);
}
