const fs = require("fs");
const p = "C:/Users/merol/mf-tattoo-studio/.env";
let s = fs.readFileSync(p, "utf8");
s = s.replace(/DATABASE_URL=.*/, 'DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres"');
fs.writeFileSync(p, s);
console.log(s);
