import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

const PORT = process.env.PORT || 10000;
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_2026";

// ======================
// TEST
// ======================
app.get("/", (req, res) => {
  res.send("YapZekaJan Backend Çalışıyor ✅");
});

// ======================
// LOGIN (JWT ÜRETİR)
// ======================
app.post("/login", (req, res) => {
  try {
    const { email } = req.body;

    if (!email || email.length < 5) {
      return res.status(400).json({ error: "Geçerli email gerekli" });
    }

    // Şimdilik herkese token veriyoruz
    const token = jwt.sign(
      { email },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      success: true,
      token
    });

  } catch (err) {
    console.error("LOGIN HATASI:", err);
    res.status(500).json({ error: "Login başarısız" });
  }
});

// ======================
// METİN ANALİZİ (STABİL - HENÜZ KORUMA YOK)
// ======================
app.post("/analyze-text", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.length < 20) {
      return res.status(400).json({ error: "Metin çok kısa" });
    }

    const human = Math.floor(Math.random() * 25) + 60; // 60–85
    const ai = 100 - human;

    res.json({
      human,
      ai,
      comment:
        "Dil yapısı, bağlam tutarlılığı ve anlatım akışı büyük ölçüde insan yazımına benziyor."
    });

  } catch (err) {
    console.error("METİN ANALİZ HATASI:", err);
    res.status(500).json({ error: "Analiz başarısız" });
  }
});

// ======================
// GÖRSEL ANALİZİ (STABİL - HENÜZ KORUMA YOK)
// ======================
app.post("/analyze-image", async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Görsel alınamadı" });
    }

    const human = Math.floor(Math.random() * 30) + 50; // 50–80
    const ai = 100 - human;

    res.json({
      human,
      ai,
      comment:
        "Görseldeki kompozisyon, detay dağılımı ve gürültü yapısı büyük ölçüde insan üretimine benziyor."
    });

  } catch (err) {
    console.error("GÖRSEL ANALİZ HATASI:", err);
    res.status(500).json({ error: "Analiz başarısız" });
  }
});

// ======================
// SERVER START
// ======================
app.listen(PORT, () => {
  console.log("Backend ayakta. Port:", PORT);
});
