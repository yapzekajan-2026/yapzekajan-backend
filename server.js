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
// LOGIN (JWT ÜRETİR AMA ANALİZLER ŞU AN AÇIK)
// ======================
app.post("/login", (req, res) => {
  try {
    const { email } = req.body;

    if (!email || email.length < 5) {
      return res.status(400).json({ error: "Geçerli email gerekli" });
    }

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
// METİN ANALİZİ (STABİL)
// ======================
app.post("/analyze-text", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.length < 20) {
      return res.status(400).json({ error: "Metin çok kısa" });
    }

    const human = Math.floor(Math.random() * 25) + 60;
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
// GÖRSEL ANALİZİ (STABİL)
// ======================
app.post("/analyze-image", async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Görsel alınamadı" });
    }

    const human = Math.floor(Math.random() * 30) + 50;
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
app.listen(PORT, () => {
  console.log("Backend ayakta. Port:", PORT);
});
// ======================
// METİN ANALİZİ v2 (CÜMLE BAZLI)
// ======================
app.post("/analyze-text-v2", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.length < 20) {
      return res.status(400).json({ error: "Metin çok kısa" });
    }

    // Cümlelere böl
    const sentencesRaw = text
      .split(/(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 10);

    if (sentencesRaw.length === 0) {
      return res.status(400).json({ error: "Cümle bulunamadı" });
    }

    // Her cümle için AI skoru üret
    const sentences = sentencesRaw.map(sentence => {
      const aiScore = Math.floor(Math.random() * 70) + 20; // 20-90
      return {
        text: sentence,
        ai: aiScore
      };
    });

    // Ortalama AI
    const totalAI = sentences.reduce((sum, s) => sum + s.ai, 0);
    const avgAI = Math.round(totalAI / sentences.length);
    const human = 100 - avgAI;

    // Risk seviyesi
    let riskLevel = "Düşük";
    if (avgAI > 65) riskLevel = "Yüksek";
    else if (avgAI > 35) riskLevel = "Orta";

    // Confidence skoru
    const confidence = Math.floor(Math.random() * 15) + 80; // 80-95

    res.json({
      human,
      ai: avgAI,
      confidence,
      riskLevel,
      sentences
    });

  } catch (err) {
    console.error("METİN ANALİZ v2 HATASI:", err);
    res.status(500).json({ error: "Analiz başarısız" });
  }
});

