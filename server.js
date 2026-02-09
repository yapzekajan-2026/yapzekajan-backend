import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

/* ===============================
   API KEYLER (Render ENV'de)
=================================
OPENAI_API_KEY
GPTZERO_API_KEY
SAPLING_API_KEY (opsiyonel)
================================= */

app.get("/", (req, res) => {
  res.send("YapZekaJan AI Backend Çalışıyor");
});

/* ===============================
   AŞAMA 1–4: ENSEMBLE ANALİZ
================================= */
app.post("/api/analyze-text", async (req, res) => {
  const { text } = req.body;

  if (!text || text.length < 20) {
    return res.status(400).json({ error: "Geçersiz metin" });
  }

  try {
    /* ===============================
       1️⃣ OPENAI — STİL ANALİZİ
    =============================== */
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
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
              "You are an AI text detector. Analyze whether the text is written by a human or AI. Respond with a probability score (0-100) and short reasoning."
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0
      })
    });

    const openaiData = await openaiRes.json();
    const openaiText = openaiData.choices?.[0]?.message?.content || "";
    const openaiScore = extractScore(openaiText);

    /* ===============================
       2️⃣ GPTZERO — AI OLASILIĞI
    =============================== */
    const gptzeroRes = await fetch("https://api.gptzero.me/v2/predict/text", {
      method: "POST",
      headers: {
        "x-api-key": process.env.GPTZERO_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ document: text })
    });

    const gptzeroData = await gptzeroRes.json();
    const gptzeroScore = Math.round(
      (1 - gptzeroData.documents[0].confidence) * 100
    );

    /* ===============================
       3️⃣ SAPLING (OPSİYONEL)
    =============================== */
    let saplingScore = null;
    if (process.env.SAPLING_API_KEY) {
      const saplingRes = await fetch(
        "https://api.sapling.ai/api/v1/aidetect",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: process.env.SAPLING_API_KEY,
            text
          })
        }
      );

      const saplingData = await saplingRes.json();
      saplingScore = Math.round(saplingData.score * 100);
    }

    /* ===============================
       4️⃣ ENSEMBLE KARAR MOTORU
    =============================== */
    const scores = [openaiScore, gptzeroScore];
    if (saplingScore !== null) scores.push(saplingScore);

    const avgAI = Math.round(
      scores.reduce((a, b) => a + b, 0) / scores.length
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
        gptzero: gptzeroScore,
        sapling: saplingScore
      }
    });

  } catch (err) {
    console.error("AI Analiz Hatası:", err);
    res.status(500).json({ error: "Analiz sırasında hata oluştu" });
  }
});

/* ===============================
   YARDIMCI — SKOR AYIKLAMA
================================= */
function extractScore(text) {
  const match = text.match(/(\d{1,3})/);
  if (!match) return 50;
  let score = parseInt(match[1], 10);
  if (score < 0) score = 0;
  if (score > 100) score = 100;
  return score;
}

app.listen(PORT, () => {
  console.log("YapZekaJan AI Backend ayakta → Port:", PORT);
});
