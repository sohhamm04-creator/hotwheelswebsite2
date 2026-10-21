const products = require("../products.json");
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const name = String(req.body?.name || "").trim();
  const email = String(req.body?.email || "").trim().toLowerCase();
  const address = String(req.body?.address || "").trim();
  const incoming = req.body?.items;
  if (!name || name.length > 100 || !EMAIL_RE.test(email) || email.length > 200 || !address || address.length > 500 || !Array.isArray(incoming) || incoming.length < 1 || incoming.length > 30) {
    return res.status(400).json({ error: "Check your name, email, address and cart items." });
  }
  const items = [];
  for (const line of incoming) {
    const product = products.find(p => p.id === Number(line.productId));
    const quantity = Number(line.quantity);
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) return res.status(400).json({ error: "One of the cart items is invalid." });
    items.push({ productId: product.id, name: product.name, quantity, unitPrice: product.price, lineTotal: product.price * quantity });
  }
  const total = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return res.status(503).json({ error: "Backend storage is not configured yet. Follow SETUP.md to connect Supabase." });
  try {
    const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/orders`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify({ customer_name: name, customer_email: email, delivery_address: address, items, total_amount: total, status: "pending" })
    });
    if (!response.ok) {
      console.error("Order DB error:", response.status, (await response.text()).slice(0, 500));
      throw new Error("Could not save the order.");
    }
    const rows = await response.json();
    const row = rows[0];
    return res.status(201).json({ ok: true, orderId: row?.id || "received", total });
  } catch (err) {
    console.error("Order API error:", err.message);
    return res.status(500).json({ error: "Could not save your order. Please try again." });
  }
};
