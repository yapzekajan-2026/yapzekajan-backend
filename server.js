const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("YapZekaJan Backend çalışıyor 🚀");
});

app.post("/save-analysis", (req, res) => {
  const { userEmail, text, result } = req.body;

  if (!userEmail || !text || !result) {
    return res.status(400).json({ success: false });
  }

  const analysis = {
    id: Date.now(),
    userEmail,
    type: "text",
    preview: text.substring(0, 120),
    result,
    createdAt: new Date().toISOString()
  };

  global.analyses = global.analyses || [];
  global.analyses.push(analysis);

  console.log("📝 Yeni analiz:", analysis);

  res.json({ success: true });
});
// ===============================
// ADIM 3 — ANALİZLERİ GETİR
// ===============================
app.get("/get-analyses", (req, res) => {
  const userEmail = req.query.userEmail;

  if (!userEmail) {
    return res.status(400).json([]);
  }

  const all = global.analyses || [];
  const userAnalyses = all.filter(a => a.userEmail === userEmail);

  res.json(userAnalyses);
});


app.listen(PORT, () => {
  console.log("Backend ayakta. Port:", PORT);
});
