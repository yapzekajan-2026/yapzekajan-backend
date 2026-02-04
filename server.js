const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// TEST ENDPOINT
app.get("/", (req, res) => {
  res.send("YapZekaJan Backend çalışıyor");
});

// PRO DURUM KONTROL (şimdilik sahte)
app.post("/check-pro", (req, res) => {
  const { email } = req.body;

  // ŞİMDİLİK: herkes free
  res.json({
    pro: false,
    message: "Free kullanıcı"
  });
});
// TARAYICI TESTİ İÇİN GET DESTEK
app.get("/check-pro", (req, res) => {
  res.json({
    pro: false,
    message: "Free kullanıcı"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Backend ayakta. Port:", PORT);
});
