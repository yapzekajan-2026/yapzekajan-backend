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

app.listen(PORT, () => {
  console.log("Backend ayakta. Port:", PORT);
});
