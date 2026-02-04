const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ANA TEST
app.get("/", (req, res) => {
  res.send("YapZekaJan Backend çalışıyor");
});

// CHECK-PRO — GET
app.get("/check-pro", (req, res) => {
  res.status(200).json({
    pro: false,
    message: "Free kullanıcı (GET)"
  });
});

// CHECK-PRO — POST
app.post("/check-pro", (req, res) => {
  res.status(200).json({
    pro: false,
    message: "Free kullanıcı (POST)"
  });
});

// ⚠️ EN KRİTİK SATIR
const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Backend ayakta. Port:", PORT);
});
