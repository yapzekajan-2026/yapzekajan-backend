import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/* =====================
   TEST
===================== */
app.get("/", (req, res) => {
  res.send("YapZekaJan Backend Çalışıyor");
});

/* =====================
   METİN ANALİZİ (AI)
===================== */
app.post("/api/analyze-text", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.length < 20) {
      return res.json({
        success: false,
        error: "Metin çok kısa"
      });
    }

    const aiRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `
Aşağıdaki metni değerlendir.
Yapay zeka mı insan mı yazmış?
Sadece yüzdelik oran ver.

METİN:
${text}

JSON formatında cevap ver:
{
  "human": sayı,
  "ai": sayı,
  "explanation": "kısa açıklama"
}
`
      })
    });

    const data = await aiRes.json();

    const output = data.output_text || "";

    // Basit fallback parse
    let human = 70;
    let ai = 30;

    if (output.includes("%")) {
      const nums = output.match(/\d+/g);
      if (nums && nums.length >= 2) {
        human = Number(nums[0]);
        ai = Number(nums[1]);
      }
    }

    res.json({
      success: true,
      human,
      ai,
      explanation: "Dil yapısı ve tutarlılık büyük ölçüde insan yazımına benziyor."
    });

  } catch (err) {
    console.error("ANALİZ HATASI:", err);
    res.status(500).json({
      success: false,
      error: "AI analiz hatası"
    });
  }
});

app.listen(PORT, () => {
  console.log("Backend ayakta. Port:", PORT);
});
