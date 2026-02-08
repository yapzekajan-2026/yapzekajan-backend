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
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
              "Sen profesyonel bir yapay zeka metin analiz uzmanısın. Verilen metnin yapay zeka tarafından yazılıp yazılmadığını değerlendir, net ve güven veren bir analiz yap."
          },
          {
            role: "user",
            content: text
          }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({
        success: false,
        error: "AI yanıtı alınamadı"
      });
    }

    res.json({
      success: true,
      analysis: data.choices[0].message.content
    });
  } catch (err) {
    console.error("ANALİZ HATASI:", err);
    res.status(500).json({
      success: false,
      error: "Sunucu hatası"
    });
  }
});

// =====================
// SERVER START
// =====================
app.listen(PORT, () => {
  console.log("Server çalışıyor. Port:", PORT);
});
