import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

// Geçici hafıza (DB yerine)
let analyses = [];
let idCounter = 1;

// =============================
// TEST
// =============================
app.get("/", (req, res) => {
  res.send("YapZekaJan Backend Çalışıyor");
});

// =============================
// ANALİZ KAYDET
// =============================
app.post("/save-analysis", (req, res) => {
  const { type, preview, result } = req.body;

  if (!type || !preview || !result) {
    return res.status(400).json({ success: false });
  }

  const item = {
    id: idCounter++,
    type,
    preview,
    result,
    date: new Date().toISOString()
  };

  analyses.unshift(item);
  res.json({ success: true });
});

// =============================
// ANALİZLERİ GETİR
// =============================
app.get("/get-analyses", (req, res) => {
  res.json(analyses);
});

// =============================
// ANALİZ SİL (D)
// =============================
app.delete("/delete-analysis/:id", (req, res) => {
  const id = Number(req.params.id);
  const before = analyses.length;

  analyses = analyses.filter(a => a.id !== id);

  if (analyses.length === before) {
    return res.status(404).json({ success: false });
  }

  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log("Backend ayakta. Port:", PORT);
});
