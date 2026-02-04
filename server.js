const express = require("express");
const cors = require("cors");
const Iyzipay = require("iyzipay");

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   SAHTE VERİTABANI (JSON)
   ========================= */
// Render’da basit tutuyoruz
const users = {}; 
// örnek: users["mail@test.com"] = { pro: true }

/* =========================
   IYZICO TEST AYARLARI
   ========================= */
const iyzipay = new Iyzipay({
  apiKey: "IYZICO_TEST_API_KEY",        // 🔴 DEĞİŞTİRİLECEK
  secretKey: "IYZICO_TEST_SECRET_KEY",  // 🔴 DEĞİŞTİRİLECEK
  uri: "https://sandbox-api.iyzipay.com"
});

/* =========================
   TEST ENDPOINT
   ========================= */
app.get("/", (req, res) => {
  res.send("YapZekaJan Backend çalışıyor");
});

/* =========================
   PRO DURUM KONTROL
   ========================= */
app.post("/check-pro", (req, res) => {
  const { email } = req.body;
  const user = users[email];
  res.json({ pro: user?.pro === true });
});

app.get("/check-pro", (req, res) => {
  res.json({ pro: false });
});

/* =========================
   ÖDEME BAŞLAT (PRO)
   ========================= */
app.post("/create-payment", (req, res) => {
  const { email } = req.body;

  const request = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: Date.now().toString(),
    price: "49.90",
    paidPrice: "49.90",
    currency: Iyzipay.CURRENCY.TRY,
    installment: "1",
    basketId: "PRO_MEMBERSHIP",
    paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
    paymentGroup: Iyzipay.PAYMENT_GROUP.SUBSCRIPTION,
    callbackUrl: "https://yapzekajan-backend.onrender.com/payment-callback",
    buyer: {
      id: email,
      name: "YapZekaJan",
      surname: "User",
      email: email,
      identityNumber: "11111111111",
      registrationAddress: "İstanbul",
      ip: "85.34.78.112",
      city: "Istanbul",
      country: "Turkey"
    },
    shippingAddress: {
      contactName: "YapZekaJan User",
      city: "Istanbul",
      country: "Turkey",
      address: "İstanbul"
    },
    billingAddress: {
      contactName: "YapZekaJan User",
      city: "Istanbul",
      country: "Turkey",
      address: "İstanbul"
    },
    basketItems: [
      {
        id: "PRO",
        name: "YapZekaJan Pro Üyelik",
        category1: "Membership",
        itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
        price: "49.90"
      }
    ]
  };

  Iyzipay.CheckoutFormInitialize.create(request, iyzipay, function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Ödeme başlatılamadı" });
    }

    res.json({
      paymentPageUrl: result.paymentPageUrl
    });
  });
});

/* =========================
   ÖDEME CALLBACK
   ========================= */
app.post("/payment-callback", (req, res) => {
  const email = req.body.buyerEmail || "unknown";

  // ÖDEME BAŞARILI VARSAYIYORUZ (TEST)
  users[email] = { pro: true };

  res.send("OK");
});

/* =========================
   SERVER
   ========================= */
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Backend ayakta. Port:", PORT);
});
