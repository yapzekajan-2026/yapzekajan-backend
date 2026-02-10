import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

const PORT = process.env.PORT || 10000;

// ======================
// TEST
// ======================
app.get("/", (req, res) => {
  res.send("YapZekaJan Backend Çalışıyor ✅");
});

// ======================
// METİN ANALİZİ (GÜVENLİ SİMÜLASYON)
// ======================
app.post("/analyze-text", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.length < 20) {
      return res.status(400).json({ error: "Metin çok kısa" });
    }

    // Basit ama tutarlı simülasyon
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
// GÖRSEL ANALİZİ (SİMÜLASYON)
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

app.listen(PORT, () => {
  console.log("Backend ayakta. Port:", PORT);
});
// ======================
// ANALİZ DETAY GETİR
// ======================
app.get("/analysis/:id", (req, res) => {
  const id = Number(req.params.id);
  const analysis = analyses.find(a => a.id === id);

  if (!analysis) {
    return res.status(404).json({ error: "Analiz bulunamadı" });
  }

  res.json(analysis);
});

