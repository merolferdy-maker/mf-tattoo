import { PrismaClient } from "@prisma/client";
import { encode } from "next-auth/jwt";
const p = new PrismaClient();
const u = await p.user.findFirst();
if (!u) { console.log("NO_USER"); process.exit(0); }
const secret = process.env.NEXTAUTH_SECRET;
const token = await encode({ token: { sub: u.id, id: u.id, email: u.email, name: u.name }, secret });
console.log("USER=" + u.email);
console.log("TOKEN=" + token);
await p.$disconnect();
