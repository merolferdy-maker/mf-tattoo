import { getUserBackground } from "@/actions/settings";

export async function GET() {
  const backgroundImage = await getUserBackground();
  return Response.json({ backgroundImage });
}