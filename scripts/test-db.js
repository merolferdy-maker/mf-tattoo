const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
p.user.findMany().then((u) => { console.log("users:", u.length); p.$disconnect(); }).catch((e) => { console.log("ERR:", e.message.slice(0,200)); p.$disconnect(); });
