const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
p.user.findUnique({ where: { email: "admin@studio.com" } }).then((u) => {
  console.log(u ? "USER EXISTS: " + u.email : "NO USER");
  p.$disconnect();
});
