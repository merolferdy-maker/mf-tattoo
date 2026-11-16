import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
p.$queryRawUnsafe(`SELECT column_name FROM information_schema.columns WHERE table_name = 'PortfolioEntry'`)
  .then((r) => { console.log(JSON.stringify(r)); process.exit(0); })
  .catch((e) => { console.error(e); process.exit(1); });
