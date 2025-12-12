import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const products = [
  { id: 1, name: "Laptop", price: 899.99 },
  { id: 2, name: "Headphones", price: 129.99 },
  { id: 3, name: "Keyboard", price: 59.99 }
];

app.get("/health", (req, res) => res.json({ status: "ok", service: "product" }));
app.get("/products", (req, res) => res.json(products));
app.get("/products/:id", (req, res) => {
  const p = products.find(x => x.id === Number(req.params.id));
  if (!p) return res.status(404).json({ error: "Not found" });
  res.json(p);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`product-service listening on ${PORT}`));
