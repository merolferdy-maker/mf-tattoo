const localtunnel = require("localtunnel");
(async () => {
  const tunnel = await localtunnel({ port: 3004 });
  console.log("TUNNEL URL:", tunnel.url);
  tunnel.on("close", () => console.log("tunnel closed"));
  // keep alive
  setInterval(() => {}, 1000);
})();
