import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ===============================
// GEÇİCİ ANALİZ KAYITLARI (RAM)
// ===============================
const analyses = [];

// ===============================
// TEST ENDPOINT
// ===============================
app.get("/", (req, res) => {
  res.send("YapZekaJan Backend çalışıyor");
});

// ===============================
// ANALİZ KAYDETME
// ===============================
app.post("/save-analysis", (req, res) => {
  const { type, preview, result } = req.body;

  if (!type || !preview || !result) {
    return res.status(400).json({ success: false });
  }

  const analysis = {
    _id: Date.now().toString(),
    type,
    preview,
    result,
    createdAt: new Date().toISOString()
  };

  analyses.push(analysis);

  console.log("Yeni analiz kaydedildi:", analysis);

  res.json({ success: true });
});

// ===============================
// ANALİZLERİ GETİR (DASHBOARD)
// ===============================
app.get("/get-analyses", (req, res) => {
  res.json(analyses);
});

// ===============================
// ANALİZ SİL
// ===============================
app.delete("/delete-analysis/:id", (req, res) => {
  const { id } = req.params;
  const index = analyses.findIndex(a => a._id === id);

  if (index === -1) {
    return res.json({ success: false });
  }

  analyses.splice(index, 1);
  res.json({ success: true });
});

// ===============================
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Backend ayakta. Port:", PORT);
});
