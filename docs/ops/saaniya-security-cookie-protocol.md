# Saaniya Software — Security headers, cookies & transit protection (canonical)

> **Phase 1 protocol** for every Saaniya-owned website, product app, and Vercel deployment.  
> **Entity:** Saaniya Software LLC · **Applies to:** nasneeraj.com, milwaukeeshala.org, GuruVidyaZen / SISLMS, Saarthee Fleet / CoPlanner, horoscope guide, nas-ops-hub, Saaniya EMR, and any new client site we ship.  
> **Not legal advice.** Aligns with master Privacy (GPC, cookies, no sale).

---

## Goals

1. **Transit / “wiretap” protection** — HTTPS/TLS only; HSTS; no cleartext secrets.  
2. **Browser hardening** — shared security headers on every response.  
3. **Cookie / tracker control** — essential vs analytics; honor Global Privacy Control (GPC); no unconsented GA.  
4. **Vercel edge** — platform firewall always on; preview Deployment Protection; rate-limit public APIs/forms (Phase 2).

---

## Phase 1 (required on every public deploy)

### 1) Security headers

Set on **all** routes (static `vercel.json` `headers`, Next.js `headers()`, or middleware):

| Header | Value |
|--------|--------|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` (use `SAMEORIGIN` only if you must iframe same-origin) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` — loosen per product (e.g. Riyaz mic) |
| `Content-Security-Policy-Report-Only` | Start with a tight policy; promote to enforcing CSP after fixing breaks |

**Canonical static snippet** (merge into `vercel.json`):

```json
{
  "source": "/(.*)",
  "headers": [
    { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
    { "key": "X-Content-Type-Options", "value": "nosniff" },
    { "key": "X-Frame-Options", "value": "DENY" },
    { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
    { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
    { "key": "X-XSS-Protection", "value": "1; mode=block" }
  ]
}
```

Reference implementation: `nasneeraj.com` `vercel.json`.

### 2) Analytics / third-party scripts

- **Remove** placeholder Google Analytics (`G-XXXXXXXXXX`) from all pages.  
- Do **not** load GA/GTM until a real Measurement ID exists **and** the user accepted analytics (or GPC is off and consent granted).  
- Prefer first-party **Vercel Web Analytics / Speed Insights** when needed; still respect consent/GPC for non-essential cookies if any are set.  
- Marketing sites: default = essential only.

### 3) Cookie + GPC banner

- Show a minimal banner: Essential always on; Analytics optional.  
- Persist choice in `localStorage` key `saaniya-cookie-consent` = `essential` | `all`.  
- If `navigator.globalPrivacyControl === true` → treat as **essential only** (do not set analytics cookies).  
- Privacy Policy must stay consistent (already states GPC honored).  
- Reference script: `nasneeraj.com` `assets/cookie-consent.js` (loaded from shared nav or layout).

### 4) Cookies we set (inventory)

| Name / storage | Purpose | Category |
|----------------|---------|----------|
| `saaniya-cookie-consent` (localStorage) | Consent choice | Essential |
| `saaniya-site-lang` / `googtrans` | Language preference | Essential (functional) |
| Session / auth cookies (apps) | Sign-in | Essential — `HttpOnly; Secure; SameSite=Lax` (or Strict) |
| Analytics IDs | Usage metrics | Analytics — only after consent |

### 5) Vercel project settings (every project)

| Setting | Phase 1 expectation |
|---------|---------------------|
| HTTPS / custom domain | Required |
| Deployment Protection | **Standard Protection** (previews locked) |
| Custom WAF rules | Phase 2 (rate-limit `/api/*`, contact forms) |
| Secrets | Vercel Env only; never commit |

---

## Phase 2 (follow-on)

- Enforcing CSP (not report-only)  
- WAF: rate-limit APIs + Turnstile on public forms  
- Attack Challenge Mode when under abuse  
- Per-product Permissions-Policy for mic/camera  
- Shared npm/package or gist of headers for Next apps  

---

## Agent checklist (paste into any repo)

```text
Apply Saaniya Phase 1 security/cookie protocol:
1) Add/merge security headers (HSTS, nosniff, frame deny, referrer, permissions-policy)
2) Remove placeholder GA (G-XXXXXXXXXX); gate any real analytics behind consent + GPC
3) Add cookie/GPC banner (or Next equivalent) with essential vs all
4) Confirm Preview Deployment Protection is Standard
5) Do not claim SOC 2 for Saaniya LLC; do not add attorney PDFs to public repos
6) Report: files changed, headers confirmed, consent path, residual risks
```

---

## Source of truth

| Artifact | Location |
|----------|----------|
| This protocol | `nasneeraj.com/docs/ops/saaniya-security-cookie-protocol.md` |
| Cursor rule | `nasneeraj.com/.cursor/rules/saaniya-security-cookie-protocol.mdc` |
| Cookie script | `nasneeraj.com/assets/cookie-consent.js` |
| Headers live | `nasneeraj.com/vercel.json` |

Copy the rule + checklist into other repos’ `.cursor/rules/` when touching them.
