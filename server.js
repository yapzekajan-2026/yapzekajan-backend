import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

// Bellekte analizler (şimdilik)
let analyses = [];
let idCounter = 1;

// =============================
// TEST
// =============================
app.get("/", (req,res)=>{
  res.send("YapZekaJan Backend Çalışıyor");
});

// =============================
// ANALİZ KAYDET
// =============================
app.post("/save-analysis", (req,res)=>{
  const { type, preview, result } = req.body;

  if(!type || !preview || !result){
    return res.status(400).json({ success:false });
  }

  const item = {
    id: idCounter++,
    type,
    preview,
    result,
    date: new Date().toISOString()
  };

  analyses.unshift(item); // en üste ekle
  console.log("Yeni analiz:", item);

  res.json({ success:true });
});

// =============================
// ANALİZLERİ GETİR
// =============================
app.get("/get-analyses", (req,res)=>{
  res.json(analyses);
});

app.listen(PORT, ()=>{
  console.log("Backend ayakta. Port:", PORT);
});
