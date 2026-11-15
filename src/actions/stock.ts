"use server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function recordMovement(formData: FormData) {
  const userId = await requireUser();
  const type = String(formData.get("type") || "CONSUMPTION");
  const itemId = String(formData.get("itemId") || "");
  const quantity = Math.abs(Math.round(Number(formData.get("quantity") || 0)));
  const notes = formData.get("notes") ? String(formData.get("notes")) : null;
  const isNegative = type === "CONSUMPTION" || type === "DISPOSAL" || type === "EXPIRATION";
  const delta = isNegative ? -quantity : quantity;

  let itemType = "";
  let itemName = "";

  const ink = await prisma.inkProduct.findFirst({ where: { id: itemId, userId } });
  const cartridge = ink ? null : await prisma.cartridge.findFirst({ where: { id: itemId, userId } });
  const consumable = ink || cartridge ? null : await prisma.consumable.findFirst({ where: { id: itemId, userId } });

  if (ink) {
    itemType = "INK";
    itemName = `${ink.brand} ${ink.colorName}`;
    const next = ink.currentQuantity + delta;
    await prisma.inkProduct.update({ where: { id: itemId }, data: { currentQuantity: next < 0 ? 0 : next } });
  } else if (cartridge) {
    itemType = "CARTRIDGE";
    itemName = `${cartridge.brand} ${cartridge.productName}`;
    const next = cartridge.quantity + delta;
    await prisma.cartridge.update({ where: { id: itemId }, data: { quantity: next < 0 ? 0 : next } });
  } else if (consumable) {
    itemType = "CONSUMABLE";
    itemName = consumable.name;
    const next = consumable.quantity + delta;
    await prisma.consumable.update({ where: { id: itemId }, data: { quantity: next < 0 ? 0 : next } });
  } else {
    return;
  }

  await prisma.stockMovement.create({
    data: { userId, type, itemType, itemId, itemName, quantity, notes },
  });
  revalidatePath("/stock");
  revalidatePath("/dashboard");
  revalidatePath("/inks");
  revalidatePath("/cartridges");
  revalidatePath("/consumables");
  revalidatePath("/analytics");
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
