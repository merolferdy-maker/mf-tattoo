const fs = require("fs");
const p = "C:/Users/merol/mf-tattoo-studio/.env";
let s = fs.readFileSync(p, "utf8");
s = s.replace(/DATABASE_URL=.*/, 'DATABASE_URL="postgresql://postgres:Nanduccio1.@db.dakksrqzfesqmdktofpa.supabase.co:5432/postgres"');
s = s.replace(/NEXTAUTH_URL=.*/, 'NEXTAUTH_URL="https://mf-tattoo.vercel.app"');
fs.writeFileSync(p, s);
console.log(s);
