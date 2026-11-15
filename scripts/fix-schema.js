const fs = require("fs");
const p = "C:/Users/merol/mf-tattoo-studio/prisma/schema.prisma";
let s = fs.readFileSync(p, "utf8");
s = s.replace('provider = "sqlite"', 'provider = "postgresql"');
fs.writeFileSync(p, s);
console.log("done");
