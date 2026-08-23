/**
 * Proxy contact form → nas-ops-hub ERP webhook (secret server-side only).
 * Env: CONTACT_WEBHOOK_SECRET, optional NAS_OPS_CONTACT_WEBHOOK_URL
 */
const DEFAULT_ERP_URL = "https://nas-ops-hub.vercel.app/api/webhooks/contact";

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const secret = process.env.CONTACT_WEBHOOK_SECRET?.trim();
  if (!secret) {
    res.status(503).json({ error: "Contact form not configured" });
    return;
  }

  const erpUrl = (process.env.NAS_OPS_CONTACT_WEBHOOK_URL || DEFAULT_ERP_URL).trim();
  const { name, email, subject, message, organization } = req.body || {};

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    res.status(400).json({ error: "name, email, and message are required" });
    return;
  }

  try {
    const upstream = await fetch(erpUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-nas-webhook-secret": secret,
      },
      body: JSON.stringify({
        name: String(name).trim(),
        email: String(email).trim(),
        subject: subject?.trim() || "Contact form submission",
        message: String(message).trim(),
        organization: organization?.trim() || undefined,
        source: "nasneeraj.com/contact",
      }),
    });

    const text = await upstream.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text || "Upstream error" };
    }

    res.status(upstream.status).json(data);
  } catch {
    res.status(502).json({ error: "Failed to reach contact service" });
  }
};
