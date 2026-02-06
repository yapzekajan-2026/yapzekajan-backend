import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// Test endpoint (kontrol için)
app.get("/", (req, res) => {
  res.send("YapZekaJan Backend çalışıyor 🚀");
});

// ===============================
// ADIM 2 — ANALİZ KAYDETME (TEXT)
// ===============================
app.post("/save-analysis", (req, res) => {
  const { userEmail, text, result } = req.body;

  if (!userEmail || !text || !result) {
    return res.status(400).json({
      success: false,
      message: "Eksik veri"
    });
  }

  const analysis = {
    id: Date.now(),
    userEmail,
    type: "text",
    preview: text.substring(0, 120),
    result,
    createdAt: new Date().toISOString()
  };

  // Şimdilik RAM'de tutuyoruz
  global.analyses = global.analyses || [];
  global.analyses.push(analysis);

  console.log("📝 Yeni analiz:", analysis);

  res.json({ success: true });
});

// Server start
app.listen(PORT, () => {
  console.log("Backend ayakta. Port:", PORT);
});
