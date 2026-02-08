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
// =====================
// AUTH (EMAIL + PASSWORD)
// =====================

const users = []; // şimdilik RAM (Render restart olursa sıfırlanır)

app.post("/auth/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Eksik bilgi" });
  }

  const exists = users.find(u => u.email === email);
  if (exists) {
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
    message: "Kayıt başarılı",
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
    user: {
      email: user.email,
      isPro: user.isPro
    }
  });
});

app.get("/auth/me", (req, res) => {
  // Şimdilik frontend localStorage’dan soracak
  res.json({ loggedIn: true });
});

