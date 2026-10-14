/**
 * Proxy contact form → nas-ops-hub ERP webhook (secret server-side only).
 * Env: CONTACT_WEBHOOK_SECRET, optional NAS_OPS_CONTACT_WEBHOOK_URL
 * Optional: TURNSTILE_SECRET_KEY (Cloudflare Turnstile) — when set, cf-turnstile-response required.
 * Phase 2: per-instance rate limit (best-effort on serverless).
 */
const DEFAULT_ERP_URL = "https://nas-ops-hub.vercel.app/api/webhooks/contact";

/** @type {Map<string, { count: number, reset: number }>} */
const rateBuckets = globalThis.__saaniyaContactRate || new Map();
globalThis.__saaniyaContactRate = rateBuckets;

const RATE_LIMIT = 8;
const RATE_WINDOW_MS = 60_000;

function clientIp(req) {
  const xf = req.headers["x-forwarded-for"];
  if (typeof xf === "string" && xf.length) return xf.split(",")[0].trim();
  return req.headers["x-real-ip"] || req.socket?.remoteAddress || "unknown";
}

function rateLimited(ip) {
  const now = Date.now();
  const row = rateBuckets.get(ip);
  if (!row || now > row.reset) {
    rateBuckets.set(ip, { count: 1, reset: now + RATE_WINDOW_MS });
    return false;
  }
  row.count += 1;
  return row.count > RATE_LIMIT;
}

async function verifyTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) return { ok: true, skipped: true };
  if (!token?.trim()) return { ok: false, error: "Captcha required" };
  try {
    const body = new URLSearchParams();
    body.set("secret", secret);
    body.set("response", token);
    if (ip && ip !== "unknown") body.set("remoteip", ip);
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const data = await r.json();
    if (!data.success) return { ok: false, error: "Captcha failed" };
    return { ok: true };
  } catch {
    return { ok: false, error: "Captcha verification error" };
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const ip = clientIp(req);
  if (rateLimited(ip)) {
    res.setHeader("Retry-After", "60");
    res.status(429).json({ error: "Too many requests. Try again shortly." });
    return;
  }

  const secret = process.env.CONTACT_WEBHOOK_SECRET?.trim();
  if (!secret) {
    res.status(503).json({ error: "Contact form not configured" });
    return;
  }

  const erpUrl = (process.env.NAS_OPS_CONTACT_WEBHOOK_URL || DEFAULT_ERP_URL).trim();
  const { name, email, subject, message, organization, website } = req.body || {};

  // Honeypot — bots often fill hidden "website"
  if (website) {
    res.status(200).json({ ok: true });
    return;
  }

  const turnstileToken =
    req.body?.["cf-turnstile-response"] || req.body?.turnstileToken || "";
  const captcha = await verifyTurnstile(turnstileToken, ip);
  if (!captcha.ok) {
    res.status(400).json({ error: captcha.error || "Captcha failed" });
    return;
  }

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
        source: "saaniya-software.com/contact",
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
