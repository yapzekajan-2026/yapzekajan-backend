import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

// =====================
// TEST
// =====================
app.get("/", (req, res) => {
  res.send("YapZekaJan Backend Çalışıyor");
});

// =====================
// GERÇEK METİN ANALİZİ
// =====================
app.post("/analyze-text", async (req, res) => {
  const { text } = req.body;

  if (!text || text.length < 30) {
    return res.status(400).json({
      success: false,
      error: "Metin çok kısa"
    });
  }

  try {
    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a linguistic analysis expert. Evaluate how similar the text is to human-written content. Do NOT say 'AI or human'. Return probability and explanation."
          },
          {
            role: "user",
            content: `
Metni analiz et:

1. İnsan yazımına benzerlik yüzdesi (%)
2. Nedenleri (madde madde)
3. Genel değerlendirme (tek paragraf)

Metin:
"""
${text}
"""
`
          }
        ],
        temperature: 0.2
      })
    });

    const data = await aiRes.json();

    const answer = data.choices[0].message.content;

    res.json({
      success: true,
      analysis: answer
    });

  } catch (err) {
    console.error("AI analiz hatası:", err);
    res.status(500).json({
      success: false,
      error: "AI analiz yapılamadı"
    });
  }
});

app.listen(PORT, () => {
  console.log("Backend ayakta. Port:", PORT);
});
