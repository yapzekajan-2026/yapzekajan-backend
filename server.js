import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/* =========================
   TEST
========================= */
app.get("/", (req, res) => {
  res.send("YapZekaJan Backend Çalışıyor ✅");
});

/* =========================
   METİN ANALİZİ (GERÇEK AI)
========================= */
app.post("/api/analyze-text", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.length < 20) {
      return res.json({
        success: false,
        message: "Metin çok kısa"
      });
    }

    const prompt = `
Aşağıdaki metni analiz et.
Metnin insan tarafından mı yoksa yapay zeka tarafından mı yazıldığını yüzde olarak tahmin et.

Sadece JSON döndür:
{
  "human": number,
  "ai": number,
  "explanation": string
}

METİN:
"""${text}"""
`;

    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an AI detection expert." },
          { role: "user", content: prompt }
        ],
        temperature: 0
      })
    });

    const aiData = await aiRes.json();

    const raw = aiData.choices?.[0]?.message?.content;

    if (!raw) {
      throw new Error("AI cevap vermedi");
    }

    const parsed = JSON.parse(raw);

    res.json({
      success: true,
      human: parsed.human,
      ai: parsed.ai,
      explanation: parsed.explanation
    });

  } catch (err) {
    console.error("AI ANALİZ HATA:", err);
    res.status(500).json({
      success: false,
      message: "AI analiz hatası"
    });
  }
});

/* =========================
   SERVER
========================= */
app.listen(PORT, () => {
  console.log("Backend ayakta. Port:", PORT);
});
