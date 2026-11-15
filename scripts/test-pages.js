const https = require("https");
function req(o, b) {
  return new Promise((r, j) => {
    const x = https.request(o, (res) => { let d = ""; res.on("data", (c) => d += c); res.on("end", () => r({ s: res.statusCode, h: res.headers, b: d })); });
    x.on("error", j);
    if (b) x.write(b);
    x.end();
  });
}
(async () => {
  const c = await req({ hostname: "mf-tattoo.vercel.app", path: "/api/auth/csrf", method: "GET" });
  const t = JSON.parse(c.b).csrfToken;
  const ck = c.h["set-cookie"] ? c.h["set-cookie"].join("; ") : "";
  const body = "csrfToken=" + encodeURIComponent(t) + "&email=" + encodeURIComponent("admin@studio.com") + "&password=" + encodeURIComponent("admin123") + "&redirect=false&json=true";
  const l = await req({ hostname: "mf-tattoo.vercel.app", path: "/api/auth/callback/credentials", method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", "Content-Length": Buffer.byteLength(body), Cookie: ck } }, body);
  const val = (l.h["set-cookie"] || [])[0].split(";")[0];
  for (const p of ["/inks", "/cartridges", "/machines"]) {
    const d = await req({ hostname: "mf-tattoo.vercel.app", path: p, method: "GET", headers: { Cookie: val, RSC: "1" } });
    console.log(p, "status", d.s);
  }
})();
