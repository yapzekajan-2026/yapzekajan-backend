import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json({ limit: "15mb" }));

const PORT = process.env.PORT || 10000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

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

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Metnin insan mı yapay zeka mı olduğunu yüzde olarak analiz et."
          },
          {
            role: "user",
            content: text
          }
        ]
      })
    });

    const data = await response.json();

    res.json({
      success: true,
      result: data.choices[0].message.content
    });

  } catch (err) {
    console.error("Metin analiz hatası:", err);
    res.status(500).json({ success: false });
  }
});

// ======================
// GÖRSEL ANALİZ (BASE64)
// ======================
app.post("/analyze-image", async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Bu görselin yapay zeka mı insan üretimi mi olduğunu yüzdeyle analiz et."
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Bu görseli analiz et" },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();

    res.json({
      success: true,
      result: data.choices[0].message.content
    });

  } catch (err) {
    console.error("Görsel analiz hatası:", err);
    res.status(500).json({ success: false });
  }
});

app.listen(PORT, () => {
  console.log("Backend ayakta. Port:", PORT);
});
