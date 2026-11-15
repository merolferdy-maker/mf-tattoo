const http = require("http");
function req(opts, body) {
  return new Promise((resolve, reject) => {
    const r = http.request(opts, (res) => {
      let d = "";
      res.on("data", (c) => (d += c));
      res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body: d }));
    });
    r.on("error", reject);
    if (body) r.write(body);
    r.end();
  });
}
(async () => {
  const base = "http://192.168.178.166:3003";
  const csrfRes = await req({ hostname: "192.168.178.166", port: 3003, path: "/api/auth/csrf", method: "GET" });
  console.log("csrf status", csrfRes.status);
  const csrf = JSON.parse(csrfRes.body).csrfToken;
  const cookie = csrfRes.headers["set-cookie"] ? csrfRes.headers["set-cookie"].join("; ") : "";
  const body = "csrfToken=" + encodeURIComponent(csrf) + "&email=" + encodeURIComponent("admin@studio.com") + "&password=" + encodeURIComponent("admin123") + "&redirect=false&json=true";
  const loginRes = await req({ hostname: "192.168.178.166", port: 3003, path: "/api/auth/callback/credentials", method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", "Content-Length": Buffer.byteLength(body), Cookie: cookie } }, body);
  console.log("login status", loginRes.status);
  console.log("login body", loginRes.body.slice(0, 300));
  console.log("set-cookie", loginRes.headers["set-cookie"]);
})();
