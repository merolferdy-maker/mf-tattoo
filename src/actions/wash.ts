"use server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createWashCollection(formData: FormData) {
  const userId = await requireUser();
  await prisma.washCollection.create({
    data: { userId, name: String(formData.get("name") || ""), type: String(formData.get("type") || "WHITE") },
  });
  revalidatePath("/wash-lab");
}

export async function deleteWashCollection(id: string) {
  const userId = await requireUser();
  const c = await prisma.washCollection.findFirst({ where: { id, userId } });
  if (!c) return;
  await prisma.washCollection.delete({ where: { id } });
  revalidatePath("/wash-lab");
}

export async function createWashRecipe(formData: FormData) {
  const userId = await requireUser();
  const type = String(formData.get("type") || "WHITE");
  const r = await prisma.washRecipe.create({
    data: {
      userId,
      collectionId: formData.get("collectionId") ? String(formData.get("collectionId")) : null,
      name: String(formData.get("name") || ""),
      category: type,
      type,
      baseInkBrand: formData.get("baseInkBrand") ? String(formData.get("baseInkBrand")) : null,
      baseInkName: formData.get("baseInkName") ? String(formData.get("baseInkName")) : null,
      baseInkId: formData.get("baseInkId") ? String(formData.get("baseInkId")) : null,
      diluentBrand: formData.get("diluentBrand") ? String(formData.get("diluentBrand")) : null,
      diluentType: formData.get("diluentType") ? String(formData.get("diluentType")) : null,
      totalVolume: formData.get("totalVolume") ? Number(formData.get("totalVolume")) : null,
      inkQuantity: formData.get("inkQuantity") ? Number(formData.get("inkQuantity")) : null,
      diluentQuantity: formData.get("diluentQuantity") ? Number(formData.get("diluentQuantity")) : null,
      ratio: formData.get("ratio") ? String(formData.get("ratio")) : null,
      percentage: formData.get("percentage") ? Number(formData.get("percentage")) : null,
      drops: formData.get("drops") ? Number(formData.get("drops")) : null,
      milliliters: formData.get("milliliters") ? Number(formData.get("milliliters")) : null,
      notes: formData.get("notes") ? String(formData.get("notes")) : null,
      imageUrl: formData.get("imageUrl") ? String(formData.get("imageUrl")) : null,
      favorite: formData.get("favorite") === "on",
    },
  });
  await prisma.washRecipeVersion.create({ data: { recipeId: r.id, versionNumber: 1, snapshot: JSON.stringify(r) } });
  revalidatePath("/wash-lab");
  redirect("/wash-lab");
}

export async function updateWashRecipe(id: string, formData: FormData) {
  const userId = await requireUser();
  const existing = await prisma.washRecipe.findFirst({ where: { id, userId } });
  if (!existing) return;
  const data = {
    name: String(formData.get("name") || ""),
    collectionId: formData.get("collectionId") ? String(formData.get("collectionId")) : null,
    baseInkBrand: formData.get("baseInkBrand") ? String(formData.get("baseInkBrand")) : null,
    baseInkName: formData.get("baseInkName") ? String(formData.get("baseInkName")) : null,
    baseInkId: formData.get("baseInkId") ? String(formData.get("baseInkId")) : null,
    diluentBrand: formData.get("diluentBrand") ? String(formData.get("diluentBrand")) : null,
    diluentType: formData.get("diluentType") ? String(formData.get("diluentType")) : null,
    totalVolume: formData.get("totalVolume") ? Number(formData.get("totalVolume")) : null,
    inkQuantity: formData.get("inkQuantity") ? Number(formData.get("inkQuantity")) : null,
    diluentQuantity: formData.get("diluentQuantity") ? Number(formData.get("diluentQuantity")) : null,
    ratio: formData.get("ratio") ? String(formData.get("ratio")) : null,
    percentage: formData.get("percentage") ? Number(formData.get("percentage")) : null,
    drops: formData.get("drops") ? Number(formData.get("drops")) : null,
    milliliters: formData.get("milliliters") ? Number(formData.get("milliliters")) : null,
    notes: formData.get("notes") ? String(formData.get("notes")) : null,
    imageUrl: formData.get("imageUrl") ? String(formData.get("imageUrl")) : null,
    favorite: formData.get("favorite") === "on",
  };
  await prisma.washRecipe.updateMany({ where: { id, userId }, data });
  const count = await prisma.washRecipeVersion.count({ where: { recipeId: id } });
  await prisma.washRecipeVersion.create({ data: { recipeId: id, versionNumber: count + 1, snapshot: JSON.stringify(data) } });
  revalidatePath("/wash-lab");
  redirect("/wash-lab");
}

export async function deleteWashRecipe(id: string) {
  const userId = await requireUser();
  await prisma.washRecipe.deleteMany({ where: { id, userId } });
  revalidatePath("/wash-lab");
  redirect("/wash-lab");
}

export async function duplicateWashRecipe(id: string) {
  const userId = await requireUser();
  const r = await prisma.washRecipe.findFirst({ where: { id, userId }, include: { shades: true } });
  if (!r) return;
  const nr = await prisma.washRecipe.create({
    data: {
      userId, collectionId: r.collectionId, name: r.name + " (copy)", category: r.category, type: r.type,
      baseInkBrand: r.baseInkBrand, baseInkName: r.baseInkName, baseInkId: r.baseInkId,
      diluentBrand: r.diluentBrand, diluentType: r.diluentType, totalVolume: r.totalVolume,
      inkQuantity: r.inkQuantity, diluentQuantity: r.diluentQuantity, ratio: r.ratio, percentage: r.percentage,
      drops: r.drops, milliliters: r.milliliters, notes: r.notes, imageUrl: r.imageUrl, favorite: false,
    },
  });
  for (const s of r.shades) {
    await prisma.washShade.create({
      data: { recipeId: nr.id, name: s.name, number: s.number, colorPreview: s.colorPreview, inkPercentage: s.inkPercentage, diluentPercentage: s.diluentPercentage, inkQuantity: s.inkQuantity, diluentQuantity: s.diluentQuantity, totalVolume: s.totalVolume, notes: s.notes, sortOrder: s.sortOrder },
    });
  }
  revalidatePath("/wash-lab");
  redirect("/wash-lab");
}

export async function addShade(formData: FormData) {
  const recipeId = String(formData.get("recipeId"));
  const userId = await requireUser();
  const recipe = await prisma.washRecipe.findFirst({ where: { id: recipeId, userId } });
  if (!recipe) return;
  const count = await prisma.washShade.count({ where: { recipeId } });
  await prisma.washShade.create({
    data: {
      recipeId,
      name: String(formData.get("name") || `Shade ${count + 1}`),
      number: formData.get("number") ? Number(formData.get("number")) : count + 1,
      colorPreview: formData.get("colorPreview") ? String(formData.get("colorPreview")) : null,
      inkPercentage: formData.get("inkPercentage") ? Number(formData.get("inkPercentage")) : null,
      diluentPercentage: formData.get("diluentPercentage") ? Number(formData.get("diluentPercentage")) : null,
      inkQuantity: formData.get("inkQuantity") ? Number(formData.get("inkQuantity")) : null,
      diluentQuantity: formData.get("diluentQuantity") ? Number(formData.get("diluentQuantity")) : null,
      totalVolume: formData.get("totalVolume") ? Number(formData.get("totalVolume")) : null,
      notes: formData.get("notes") ? String(formData.get("notes")) : null,
      sortOrder: count,
    },
  });
  revalidatePath("/wash-lab");
}

export async function deleteShade(id: string) {
  const shade = await prisma.washShade.findUnique({ where: { id }, include: { recipe: true } });
  if (!shade) return;
  const userId = await requireUser();
  if (shade.recipe.userId !== userId) return;
  await prisma.washShade.delete({ where: { id } });
  revalidatePath("/wash-lab");
}
