"use server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createMachine(formData: FormData) {
  const userId = await requireUser();
  await prisma.machine.create({
    data: {
      userId,
      brand: String(formData.get("brand") || ""),
      model: String(formData.get("model") || ""),
      customName: formData.get("customName") ? String(formData.get("customName")) : null,
      type: formData.get("type") ? String(formData.get("type")) : null,
      driveSystem: formData.get("driveSystem") ? String(formData.get("driveSystem")) : null,
      strokeMin: formData.get("strokeMin") ? Number(formData.get("strokeMin")) : null,
      strokeMax: formData.get("strokeMax") ? Number(formData.get("strokeMax")) : null,
      fixedStroke: formData.get("fixedStroke") === "on",
      weight: formData.get("weight") ? Number(formData.get("weight")) : null,
      batteryInfo: formData.get("batteryInfo") ? String(formData.get("batteryInfo")) : null,
      connectionType: formData.get("connectionType") ? String(formData.get("connectionType")) : null,
      purchaseDate: formData.get("purchaseDate") ? new Date(String(formData.get("purchaseDate"))) : null,
      price: formData.get("price") ? Number(formData.get("price")) : null,
      serialNumber: formData.get("serialNumber") ? String(formData.get("serialNumber")) : null,
      imageUrl: formData.get("imageUrl") ? String(formData.get("imageUrl")) : null,
      notes: formData.get("notes") ? String(formData.get("notes")) : null,
      favorite: formData.get("favorite") === "on",
    },
  });
  revalidatePath("/machines");
  revalidatePath("/dashboard");
}

export async function updateMachine(id: string, formData: FormData) {
  const userId = await requireUser();
  await prisma.machine.updateMany({
    where: { id, userId },
    data: {
      brand: String(formData.get("brand") || ""),
      model: String(formData.get("model") || ""),
      customName: formData.get("customName") ? String(formData.get("customName")) : null,
      type: formData.get("type") ? String(formData.get("type")) : null,
      driveSystem: formData.get("driveSystem") ? String(formData.get("driveSystem")) : null,
      strokeMin: formData.get("strokeMin") ? Number(formData.get("strokeMin")) : null,
      strokeMax: formData.get("strokeMax") ? Number(formData.get("strokeMax")) : null,
      fixedStroke: formData.get("fixedStroke") === "on",
      weight: formData.get("weight") ? Number(formData.get("weight")) : null,
      batteryInfo: formData.get("batteryInfo") ? String(formData.get("batteryInfo")) : null,
      connectionType: formData.get("connectionType") ? String(formData.get("connectionType")) : null,
      purchaseDate: formData.get("purchaseDate") ? new Date(String(formData.get("purchaseDate"))) : null,
      price: formData.get("price") ? Number(formData.get("price")) : null,
      serialNumber: formData.get("serialNumber") ? String(formData.get("serialNumber")) : null,
      imageUrl: formData.get("imageUrl") ? String(formData.get("imageUrl")) : null,
      notes: formData.get("notes") ? String(formData.get("notes")) : null,
      favorite: formData.get("favorite") === "on",
    },
  });
  revalidatePath("/machines");
}

export async function deleteMachine(id: string) {
  const userId = await requireUser();
  await prisma.machine.deleteMany({ where: { id, userId } });
  revalidatePath("/machines");
  revalidatePath("/dashboard");
}
