import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

/* =========================
   GEÇİCİ HAFIZA (DB YOK)
========================= */
let analyses = [];
let users = [];
let idCounter = 1;

/* =========================
   TEST
========================= */
app.get("/", (req, res) => {
  res.send("YapZekaJan Backend Çalışıyor");
});

/* =========================
   AUTH
========================= */
app.post("/auth/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Eksik bilgi" });
  }

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: "Bu e-posta zaten kayıtlı" });
  }

  const user = {
    id: Date.now(),
    email,
    password,
    isPro: false,
    createdAt: new Date().toISOString()
  };

  users.push(user);

  res.json({
    success: true,
    user: { email: user.email, isPro: user.isPro }
  });
});

app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Hatalı e-posta veya şifre" });
  }

  res.json({
    success: true,
    user: { email: user.email, isPro: user.isPro }
  });
});

/* =========================
   ANALİZ KAYDET (EMAIL İLE)
========================= */
app.post("/save-analysis", (req, res) => {
  const { userEmail, type, preview, result } = req.body;

  if (!userEmail || !type) {
    return res.status(400).json({ error: "Eksik veri" });
  }

  const analysis = {
    id: idCounter++,
    userEmail,
    type,
    preview: preview || "",
    result: result || "",
    createdAt: new Date().toISOString()
  };

  analyses.unshift(analysis);

  console.log("Yeni analiz:", analysis);

  res.json({ success: true });
});

/* =========================
   SADECE KULLANICIYA AİT ANALİZLER
========================= */
app.get("/get-analyses/:email", (req, res) => {
  const email = req.params.email;
  const userAnalyses = analyses.filter(a => a.userEmail === email);
  res.json(userAnalyses);
});

/* =========================
   ANALİZ SİL (SADECE SAHİBİ)
========================= */
app.delete("/delete-analysis/:id/:email", (req, res) => {
  const id = Number(req.params.id);
  const email = req.params.email;

  const before = analyses.length;
  analyses = analyses.filter(
    a => !(a.id === id && a.userEmail === email)
  );

  if (analyses.length === before) {
    return res.status(404).json({ success: false });
  }

  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log("Backend ayakta. Port:", PORT);
});
