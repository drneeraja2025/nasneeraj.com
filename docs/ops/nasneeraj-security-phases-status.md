# nasneeraj.com — security phases status

**Repo:** `drneeraja2025/nasneeraj.com` · **Vercel:** `saaniya-software/nasneeraj-com`  
**Updated:** 2026-10-13 · Plan: `docs/legal/cybersecurity_coocie_plan.md`

| Phase | Status | Evidence |
|-------|--------|----------|
| **0** Baseline | Done | HTTPS/TLS (Vercel); platform System Mitigations Active; Privacy/Terms/Disclaimer; secrets in Env |
| **1** Headers + cookie/GPC | Done | `vercel.json` HSTS/nosniff/DENY/Referrer/Permissions/XSS; `assets/cookie-consent.js` + site-nav; GA placeholders stripped |
| **2** Edge + CSP | Partial | CSP **Report-Only** in `vercel.json`; Attack Challenge runbook; contact rate-limit + honeypot in code. **Custom WAF** not configurable via API on this project (`Firewall: Not configured` — System Mitigations only). Preview Protection: confirm Standard in dashboard (CLI does not always expose). Enforcing CSP deferred until Report-Only is clean. |
| **3** App depth | Partial (marketing) | Cookie inventory on `privacy.html`; contact honeypot + **Turnstile widget** on `contact.html`; `TURNSTILE_SECRET_KEY` + `TURNSTILE_SITE_KEY` in Vercel Env. Redeploy required for API to enforce. |
| **4** CI / supply chain | Documented | `npm run audit:deps` available; Semgrep **skipped** (not enrolled); secrets must stay in Vercel Env |
| **5** Optional | Deferred | Bot Management / Cloudflare / insurance / pen test / SOC 2 — recommend only; no purchase |

## Manual follow-ups

1. Vercel → nasneeraj-com → Deployment Protection → Preview = **Standard** (marketing only). GuruVidyaZen Preview stays unlocked (live Riyaz).  
2. When ready: enable Firewall custom rules for `/api/contact` in dashboard (if plan allows), or keep app rate limit.  
3. ~~Turnstile~~ Done locally — redeploy Preview/Production so contact API picks up secret.  
4. Review CSP Report-Only console reports for 1–2 weeks, then consider enforcing.
