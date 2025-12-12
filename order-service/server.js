import express from "express";
import cors from "cors";
import { v4 as uuid } from "uuid";

const app = express();
app.use(cors());
app.use(express.json());

const orders = []; // { id, userId, items, total, createdAt }

app.get("/health", (req, res) => res.json({ status: "ok", service: "order" }));

app.post("/orders", (req, res) => {
  const { userId, items = [] } = req.body || {};
  if (!userId || !Array.isArray(items)) {
    return res.status(400).json({ error: "userId and items[] required" });
  }
  const total = items.reduce((sum, i) => sum + (i.price || 0) * (i.qty || 1), 0);
  const order = { id: uuid(), userId, items, total, createdAt: new Date().toISOString() };
  orders.push(order);
  res.status(201).json(order);
});

app.get("/orders", (req, res) => res.json(orders));
app.get("/orders/:id", (req, res) => {
  const o = orders.find(x => x.id === req.params.id);
  if (!o) return res.status(404).json({ error: "Not found" });
  res.json(o);
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`order-service listening on ${PORT}`));
