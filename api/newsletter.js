const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const email = String(req.body?.email || "").trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 200) return res.status(400).json({ error: "Enter a valid email address." });
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return res.status(503).json({ error: "Backend storage is not configured yet. Follow SETUP.md to connect Supabase." });
  try {
    const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/newsletter_subscribers`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "resolution=ignore-duplicates,return=minimal" },
      body: JSON.stringify({ email })
    });
    if (!response.ok) throw new Error("Database rejected the subscription.");
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Newsletter API error:", err.message);
    return res.status(500).json({ error: "Could not save subscription. Please try again." });
  }
};
