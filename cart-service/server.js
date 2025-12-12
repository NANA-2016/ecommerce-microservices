import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// naive in-memory cart by userId
const carts = {}; // { user1: [{productId, qty}], ... }

app.get("/health", (req, res) => res.json({ status: "ok", service: "cart" }));

app.post("/cart/:userId/add", (req, res) => {
  const { userId } = req.params;
  const { productId, qty = 1 } = req.body || {};
  if (!productId) return res.status(400).json({ error: "productId required" });

  carts[userId] ||= [];
  const existing = carts[userId].find(i => i.productId === productId);
  if (existing) existing.qty += qty;
  else carts[userId].push({ productId, qty });

  res.json({ userId, cart: carts[userId] });
});

app.post("/cart/:userId/remove", (req, res) => {
  const { userId } = req.params;
  const { productId, qty = 1 } = req.body || {};
  if (!productId) return res.status(400).json({ error: "productId required" });

  carts[userId] ||= [];
  const idx = carts[userId].findIndex(i => i.productId === productId);
  if (idx === -1) return res.json({ userId, cart: carts[userId] });

  carts[userId][idx].qty -= qty;
  if (carts[userId][idx].qty <= 0) carts[userId].splice(idx, 1);
  res.json({ userId, cart: carts[userId] });
});

app.get("/cart/:userId", (req, res) => {
  const { userId } = req.params;
  res.json({ userId, cart: carts[userId] || [] });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`cart-service listening on ${PORT}`));
