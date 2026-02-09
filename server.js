import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

/* ===============================
   TEST
================================= */
app.get("/", (req, res) => {
  res.send("YapZekaJan AI Backend Çalışıyor");
});

/* ===============================
   AI TEXT ANALYSIS (ENSEMBLE)
================================= */
app.post("/api/analyze-text", async (req, res) => {
  const { text } = req.body;

  if (!text || text.length < 20) {
    return res.status(400).json({ error: "Geçersiz metin" });
  }

  try {
    /* ===============================
       1️⃣ OPENAI
    =============================== */
    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are an AI text detector. Return a probability score (0-100) for AI-written text."
            },
            {
              role: "user",
              content: text
            }
          ],
          temperature: 0
        })
      }
    );

    const openaiData = await openaiRes.json();
    const openaiText =
      openaiData.choices?.[0]?.message?.content || "";
    const openaiScore = extractScore(openaiText);

    /* ===============================
       2️⃣ GPTZERO
    =============================== */
    const gptzeroRes = await fetch(
      "https://api.gptzero.me/v2/predict/text",
      {
        method: "POST",
        headers: {
          "x-api-key": process.env.GPTZERO_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ document: text })
      }
    );

    const gptzeroData = await gptzeroRes.json();
    const gptzeroScore = Math.round(
      (1 - gptzeroData.documents[0].confidence) * 100
    );

    /* ===============================
       3️⃣ ENSEMBLE KARAR
    =============================== */
    const avgAI = Math.round(
      (openaiScore + gptzeroScore) / 2
    );

    const confidenceHuman = 100 - avgAI;

    const label =
      avgAI > 60
        ? "Yapay Zeka Tarafından Üretilmiş Olma İhtimali Yüksek"
        : "İnsan Tarafından Yazılmış Olma İhtimali Yüksek";

    res.json({
      label,
      confidence: confidenceHuman,
      details: {
        openai: openaiScore,
        gptzero: gptzeroScore
      }
    });

  } catch (err) {
    console.error("AI Analiz Hatası:", err);
    res.status(500).json({ error: "Analiz sırasında hata oluştu" });
  }
});

/* ===============================
   SKOR AYIKLAMA
================================= */
function extractScore(text) {
  const match = text.match(/(\d{1,3})/);
  if (!match) return 50;
  let score = parseInt(match[1], 10);
  return Math.min(Math.max(score, 0), 100);
}

app.listen(PORT, () => {
  console.log("YapZekaJan Backend ayakta → Port:", PORT);
});
