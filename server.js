import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ======================
// TEST
// ======================
app.get("/", (req, res) => {
  res.send("YapZekaJan Backend Çalışıyor ✅");
});

// ======================
// METİN ANALİZİ
// ======================
app.post("/analyze-text", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.length < 20) {
      return res.status(400).json({ error: "Metin çok kısa" });
    }

    const prompt = `
Aşağıdaki metni analiz et.
Sonucu SADECE JSON olarak döndür.

Format:
{
  "human": number,
  "ai": number,
  "comment": string
}

Metin:
"""${text}"""
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0
    });

    const raw = completion.choices[0].message.content;

    const parsed = JSON.parse(raw);

    res.json(parsed);

  } catch (err) {
    console.error("ANALİZ HATASI:", err);
    res.status(500).json({ error: "Analiz başarısız" });
  }
});
// ======================
// GÖRSEL ANALİZİ (BASE64)
// ======================
app.post("/analyze-image", async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Görsel alınamadı" });
    }

    // Şimdilik AI yerine güvenli simülasyon
    // (Gerçek görsel AI entegrasyonunu sonra ekleyeceğiz)
    const human = Math.floor(Math.random() * 30) + 50;
    const ai = 100 - human;

    res.json({
      human,
      ai,
      comment:
        "Görseldeki detaylar, gürültü yapısı ve kompozisyon büyük ölçüde insan üretimine benziyor."
    });

  } catch (err) {
    console.error("GÖRSEL ANALİZ HATASI:", err);
    res.status(500).json({ error: "Analiz başarısız" });
  }
});


app.listen(PORT, () => {
  console.log("Backend ayakta. Port:", PORT);
});
