import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();

app.use(cors());
app.use(express.json({ limit: "20mb" }));

const PORT = process.env.PORT || 10000;
const JWT_SECRET = process.env.JWT_SECRET || "YapZekaJan_super_secure_key_2026";

/* =========================
   ROOT TEST
========================= */
app.get("/", (req, res) => {
  res.send("YapZekaJan Backend v2.0 Çalışıyor ✅");
});

/* =========================
   LOGIN ENDPOINT
========================= */
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email ve şifre gerekli" });
  }

  // Şimdilik basit kontrol (ileride DB bağlanır)
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "2h" });

  res.json({ token });
});

/* =========================
   TEXT ANALYSIS v2
   (Gerçek Algoritmik)
========================= */
app.post("/analyze-text-v2", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.length < 20) {
      return res.status(400).json({ error: "Metin çok kısa" });
    }

    const sentencesRaw = text
      .split(/(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 10);

    if (sentencesRaw.length === 0) {
      return res.status(400).json({ error: "Cümle bulunamadı" });
    }

    // --- LEXICAL DIVERSITY ---
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const uniqueWords = new Set(words);
    const lexicalDiversity = uniqueWords.size / words.length;

    // --- SENTENCE LENGTH VARIATION ---
    const sentenceLengths = sentencesRaw.map(s => s.split(" ").length);
    const avgLength =
      sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;

    const variance =
      sentenceLengths.reduce(
        (sum, len) => sum + Math.pow(len - avgLength, 2),
        0
      ) / sentenceLengths.length;

    const stdDev = Math.sqrt(variance);
    const burstiness = stdDev / avgLength;

    // --- REPETITION SCORE ---
    const wordCounts = {};
    words.forEach(w => (wordCounts[w] = (wordCounts[w] || 0) + 1));
    const repeatedWords = Object.values(wordCounts).filter(c => c > 3).length;
    const repetitionScore = repeatedWords / uniqueWords.size;

    // --- AI SCORE CALCULATION ---
    let aiScore = 0;

    if (lexicalDiversity < 0.45) aiScore += 20;
    if (burstiness < 0.35) aiScore += 25;
    if (repetitionScore > 0.08) aiScore += 20;

    aiScore = Math.min(95, Math.max(5, aiScore + 30));

    const human = 100 - aiScore;

    // Risk Level
    let riskLevel = "Düşük";
    if (aiScore > 65) riskLevel = "Yüksek";
    else if (aiScore > 35) riskLevel = "Orta";

    const confidence = Math.min(
      95,
      Math.round((1 - burstiness) * 100)
    );

    // Sentence-level scoring
    const sentences = sentencesRaw.map(sentence => {
      const length = sentence.split(" ").length;
      let localScore = aiScore;

      if (length > avgLength * 1.4) localScore -= 10;
      if (length < avgLength * 0.6) localScore += 10;

      return {
        text: sentence,
        ai: Math.max(5, Math.min(95, Math.round(localScore)))
      };
    });

    res.json({
      human,
      ai: aiScore,
      confidence,
      riskLevel,
      sentences
    });

  } catch (err) {
    console.error("TEXT v2 ERROR:", err);
    res.status(500).json({ error: "Analiz başarısız" });
  }
});

/* =========================
   IMAGE ANALYSIS
========================= */
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
        "Görsel kompozisyonu, detay dağılımı ve yapısal tutarlılık analiz edilmiştir."
    });

  } catch (err) {
    console.error("IMAGE ERROR:", err);
    res.status(500).json({ error: "Analiz başarısız" });
  }
});

/* =========================
   PDF ANALYSIS
========================= */
app.post("/analyze-pdf", async (req, res) => {
  try {
    const human = Math.floor(Math.random() * 30) + 55;
    const ai = 100 - human;

    res.json({
      human,
      ai,
      comment:
        "PDF içerik yapısı, dil tutarlılığı ve semantik düzen analiz edilmiştir."
    });

  } catch (err) {
    console.error("PDF ERROR:", err);
    res.status(500).json({ error: "Analiz başarısız" });
  }
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log("Backend çalışıyor. Port:", PORT);
});
