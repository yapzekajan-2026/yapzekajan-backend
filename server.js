import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// =============================
// TEST
// =============================
app.get("/", (req, res) => {
  res.send("YapZekaJan Backend çalışıyor");
});

// =============================
// METİN ANALİZİ (GERÇEK AI)
// =============================
app.post("/api/analyze-text", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.length < 20) {
      return res.status(400).json({ error: "Metin çok kısa" });
    }

    const prompt = `
Aşağıdaki metnin yapay zeka tarafından üretilmiş olma ihtimalini yüzde olarak değerlendir.
Cevabı sadece JSON formatında ver.

Metin:
"""${text}"""

JSON formatı:
{
  "ai_probability": number,
  "human_probability": number,
  "explanation": string
}
`;

    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0
      })
    });

    const data = await aiRes.json();

    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("AI cevap üretmedi");
    }

    const parsed = JSON.parse(content);

    res.json({
      success: true,
      ai: parsed.ai_probability,
      human: parsed.human_probability,
      explanation: parsed.explanation
    });

  } catch (err) {
    console.error("AI analiz hatası:", err);
    res.status(500).json({ error: "Analiz başarısız" });
  }
});

// =============================
// SERVER
// =============================
app.listen(PORT, () => {
  console.log("Backend ayakta. Port:", PORT);
});
