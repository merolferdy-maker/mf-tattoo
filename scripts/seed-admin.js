const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const p = new PrismaClient();
(async () => {
  const h = await bcrypt.hash("admin123", 10);
  const u = await p.user.upsert({
    where: { email: "admin@studio.com" },
    update: { passwordHash: h },
    create: { email: "admin@studio.com", name: "Admin", passwordHash: h },
  });
  console.log("admin created", u.email);
  await p.$disconnect();
})();
