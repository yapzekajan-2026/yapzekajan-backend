import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

/* =========================
   GEÇİCİ VERİLER (RAM)
========================= */
let analyses = [];
let users = [];

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
    return res.status(400).json({ error: "Bu e-posta kayıtlı" });
  }

  const user = {
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
    return res.status(401).json({ error: "Hatalı giriş" });
  }

  res.json({
    success: true,
    user: { email: user.email, isPro: user.isPro }
  });
});

/* =========================
   ANALİZ KAYDET
========================= */
app.post("/save-analysis", (req, res) => {
  const { userEmail, type, preview, result } = req.body;

  if (!userEmail || !type) {
    return res.status(400).json({ error: "Eksik veri" });
  }

  const analysis = {
    id: Date.now(),
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
   KULLANICIYA ÖZEL ANALİZLER
========================= */
app.get("/get-analyses", (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email gerekli" });
  }

  const userAnalyses = analyses.filter(a => a.userEmail === email);
  res.json(userAnalyses);
});

/* =========================
   ANALİZ SİL
========================= */
app.delete("/delete-analysis/:id", (req, res) => {
  const id = Number(req.params.id);
  analyses = analyses.filter(a => a.id !== id);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log("Backend ayakta. Port:", PORT);
});
// =====================
// PAYMENT SUCCESS (MOCK)
// =====================
app.post("/payment/success", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "E-posta yok" });
  }

  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı" });
  }

  user.isPro = true;

  console.log("PRO aktif edildi:", email);

  res.json({
    success: true,
    message: "Pro üyelik aktif",
    isPro: true
  });
});

