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
  const csrfRes = await req({ hostname: "192.168.178.166", port: 3003, path: "/api/auth/csrf", method: "GET" });
  const csrf = JSON.parse(csrfRes.body).csrfToken;
  const cookie = csrfRes.headers["set-cookie"] ? csrfRes.headers["set-cookie"].join("; ") : "";
  const body = "csrfToken=" + encodeURIComponent(csrf) + "&email=" + encodeURIComponent("admin@studio.com") + "&password=" + encodeURIComponent("admin123") + "&redirect=false&json=true";
  const loginRes = await req({ hostname: "192.168.178.166", port: 3003, path: "/api/auth/callback/credentials", method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", "Content-Length": Buffer.byteLength(body), Cookie: cookie } }, body);
  const newCookie = loginRes.headers["set-cookie"] ? loginRes.headers["set-cookie"].join("; ") : cookie;
  const dashRes = await req({ hostname: "192.168.178.166", port: 3003, path: "/dashboard", method: "GET", headers: { Cookie: newCookie } });
  console.log("dashboard status:", dashRes.status);
})();
