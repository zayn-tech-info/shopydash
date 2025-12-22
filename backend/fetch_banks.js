const https = require("https");

const paystackSecretKey = process.env.PAYSTACK_TEST_SECRET_KEY;

const options = {
  hostname: "api.paystack.co",
  port: 443,
  path: "/bank?country=nigeria",
  method: "GET",
  headers: {
    Authorizatio: `Bearer ${paystackSecretKey}`,
  },
};

const req = https.request(options, (res) => {
  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });
  res.on("end", () => {
    try {
      const banks = JSON.parse(data).data;
      const opay = banks.find((b) => b.name.toLowerCase().includes("opay"));
      const kuda = banks.find((b) => b.name.toLowerCase().includes("kuda"));
      const palmpay = banks.find((b) =>
        b.name.toLowerCase().includes("palmpay")
      );

      console.log("OPay:", opay ? opay.code : "Not Found");
      console.log("Kuda:", kuda ? kuda.code : "Not Found");
      console.log("PalmPay:", palmpay ? palmpay.code : "Not Found");
    } catch (e) {
      console.error("Parse error", e);
    }
  });
});

req.on("error", (error) => {
  console.error(error);
});

req.end();
