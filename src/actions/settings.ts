"use server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { parseImageUrls } from "@/lib/images";

export async function uploadBackground(formData: FormData) {
  const userId = await requireUser();
  const imageUrls = formData.get("imageUrls");
  if (!imageUrls) throw new Error("No image provided");
  const urls = parseImageUrls(String(imageUrls));
  if (urls.length === 0) throw new Error("Invalid image");
  await prisma.user.update({ where: { id: userId }, data: { backgroundImage: urls[0] } });
}