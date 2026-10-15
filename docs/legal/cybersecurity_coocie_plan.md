# Cybersecurity + cookie plan (Saaniya Software LLC)

> Living ops plan for transit hardening, browser headers, cookies/GPC, edge WAF, and app security.  
> **Not legal advice.** Aligns with Privacy (GPC, no sale). Does **not** claim SOC 2.  
> **Last updated:** 2026-10-13

**Canonical Phase 1 protocol (copy into every repo):**  
`docs/ops/saaniya-security-cookie-protocol.md` + `.cursor/rules/saaniya-security-cookie-protocol.mdc`  
Reference site: `nasneeraj.com` (`vercel.json`, `assets/cookie-consent.js`).

---

## Goals (all phases)

1. **Transit / “wiretap” protection** — HTTPS/TLS only; HSTS; no cleartext secrets.  
2. **Browser hardening** — shared security headers; later CSP.  
3. **Cookie / tracker control** — essential vs analytics; honor GPC; no unconsented GA.  
4. **Vercel edge** — platform firewall; Preview protection; WAF rate limits; abuse controls.  
5. **App trust** — secure session cookies, Turnstile on public forms, RLS / least-privilege OAuth.  
6. **Engineering hygiene** — dependency/SAST gates when enrolled; secrets only in Vercel Env.  
7. **Optional depth** — managed bot/WAF, extra CDN, insurance — only when justified.

---

## Phase map (overview)

| Phase | Name | Status | Theme |
|-------|------|--------|--------|
| **0** | Baseline platform | Done (this repo) | TLS, Vercel System Mitigations, Privacy copy |
| **1** | Headers + cookie/GPC | **Done** on major public sites* | Required on every public deploy |
| **2** | Edge + CSP | Partial (this repo) | CSP-RO shipped; app rate-limit; WAF custom N/A on plan; Preview Protection confirm manual |
| **3** | App security depth | Partial (marketing) | Cookie inventory + honeypot; Turnstile optional via Env |
| **4** | CI / supply chain | Documented | `npm run audit:deps`; Semgrep not enrolled |
| **5** | Optional advanced | Deferred | Bot Management, Cloudflare, insurance — recommend only |

\*Finish Phase 1 on remaining repos (ops-hub, EMR, horoscope, …) one at a time — see ledger.

---

## Phase 0 — Baseline platform

**Intent:** What every Saaniya site gets from the host and legal pack before custom hardening.

| Item | Expectation | Status |
|------|-------------|--------|
| HTTPS / TLS + auto certs | All custom domains | Done (Vercel) |
| HTTP → HTTPS | No cleartext site | Done |
| Platform DDoS / firewall | Vercel default | Done (no custom rules yet) |
| Secrets | Vercel Env only; never git | Ongoing discipline |
| Privacy / Terms / Disclaimer | GPC + no-sale language | Done on marketing |
| Product-side (existing) | RLS, OAuth scoping, Turnstile where enabled, Clerk (Fleet), HOTL for AI | In place per product |

---

## Phase 1 — Headers + cookie/GPC (required)

**Intent:** Every public response ships hardening headers; analytics never load without consent; GPC honored.

### Requirements

| Requirement | Detail |
|-------------|--------|
| Headers | HSTS `max-age=63072000; includeSubDomains; preload`; nosniff; `X-Frame-Options: DENY`; Referrer-Policy `strict-origin-when-cross-origin`; Permissions-Policy; `X-XSS-Protection: 1; mode=block` |
| Analytics | Remove `G-XXXXXXXXXX`; gate real GA / Vercel Analytics behind consent + GPC |
| Cookie banner | `localStorage saaniya-cookie-consent` = `essential` \| `all`; GPC → essential only |
| TypeScript | Cast `Navigator` for optional `globalPrivacyControl?: boolean` |
| Docs in repo | `docs/ops/saaniya-security-cookie-protocol.md` + `.cursor/rules/…mdc` |
| Preview protection | Standard on marketing/ops Previews only — **see exceptions below** |

### Product exceptions (do not “tighten” blindly)

| Product | Permissions-Policy |
|---------|-------------------|
| GuruVidyaZen / Riyaz | `camera=(self), microphone=(self), geolocation=()` |
| Saarthee Fleet | `geolocation=(self)` (Live trip map) |
| Default | `camera=(), microphone=(), geolocation=()` |

### Cookie inventory (Phase 1)

| Name / storage | Purpose | Category |
|----------------|---------|----------|
| `saaniya-cookie-consent` (localStorage) | Consent choice | Essential |
| `saaniya-site-lang` / `googtrans` | Language | Essential (functional) |
| Session / auth cookies | Sign-in | Essential — `HttpOnly; Secure; SameSite=Lax` (or Strict) |
| Analytics IDs / Vercel Web Analytics | Usage | Analytics — only after consent + GPC off |

### Ship ledger (Phase 1)

| Surface | Preview | Production | Notes |
|---------|---------|------------|-------|
| nasneeraj.com / saaniya-software.com | `f77cc67` | `f77cc67` | Static; `cookie-consent.js` via site-nav |
| milwaukeeshala.org | `834f187` | `21e05be` | GPC typing fix on prod |
| GuruVidyaZen (Gurukul) | `11f0cb6` (development) | `14d4135` → guruvidyazen.nasneeraj.com | Live prod = Vercel **guruvidyazen**; **Preview/`development` is a live Riyaz Studio branch — do NOT lock with Deployment Protection** |
| Saarthee Fleet | `5910477` | `4ad5963` → fleet.nasneeraj.com | GPC type fix after failed Preview |
| Saarthee CoPlanner | `7b9e883` | `645cc08` | Smoke 16/16 |
| nas-ops-hub / EMR / horoscope / others | Confirm one repo at a time | | Use Phase 1 prompt below |

---

## Phase 2 — Edge + CSP

**Intent:** Harden the edge and content sources after Phase 1 is universal.

| # | Work item | Done when |
|---|-----------|-----------|
| 2.1 | Confirm **Preview Deployment Protection = Standard** on marketing/ops Previews only | Dashboard checklist; **exclude GuruVidyaZen** (and any other “Preview = live product” env) |
| 2.2 | CSP **Report-Only** on marketing / simple sites (tighten until clean) | Reports reviewed; no critical breaks |
| 2.3 | Promote CSP to **enforcing** where safe (Gurukul already has product CSP — reconcile with Zoom/Turnstile needs) | Enforcing on prod without login/media breakage |
| 2.4 | WAF custom rules: rate-limit `/api/*` + contact/signup forms | Rules live; false-positive rate acceptable |
| 2.5 | Attack Challenge Mode runbook (enable when under abuse) | Doc in ops + owner |
| 2.6 | Shared headers snippet / small package for Next apps (optional) | One place to copy from |

**Out of Phase 2:** Semgrep enrollment (Phase 4); Cloudflare (Phase 5).

---

## Phase 3 — App security depth

**Intent:** Product apps match the privacy story with auth, bots, and data boundaries.

| # | Work item | Applies to | Done when |
|---|-----------|------------|-----------|
| 3.1 | Turnstile (or equivalent) on auth + public forms where missing | Gurukul, Fleet, CoPlanner, EMR, marketing contact | Forms covered |
| 3.2 | Audit session cookies: `HttpOnly; Secure; SameSite` | All apps with sessions | Checklist per app |
| 3.3 | RLS + least-privilege OAuth review (annual or after major auth change) | Gurukul, Fleet, CoPlanner, EMR | Notes in ops |
| 3.4 | No PHI / clinical pipelines without a written program | EMR / healthcare surfaces | Policy + architecture match |
| 3.5 | Public cookie inventory section on Privacy (or help) pages | Marketing + apps | Users can see categories |
| 3.6 | Resolve dual Gurukul Vercel projects / Production cancel pattern | GuruVidyaZen | One clear Production owner + aliases |

---

## Phase 4 — CI / supply chain

**Intent:** Catch regressions in git before prod. Do **not** block ship on tools not enrolled.

| # | Work item | Status / rule |
|---|-----------|----------------|
| 4.1 | Dependency audit in CI (`npm audit` / Dependabot / similar) | Prefer warn → gate later |
| 4.2 | SAST (e.g. Semgrep Cloud) | **Not enrolled** — do **not** require Semgrep tokens or CI gates until opted in |
| 4.3 | Secret scanning (GitHub / Vercel) | Enable where available |
| 4.4 | Lockfile + pinned major upgrades for security releases | Ongoing |
| 4.5 | Phase 1 header/consent smoke in e2e (optional) | Banner + GPC path covered |

---

## Phase 5 — Optional advanced

**Intent:** Buy depth only when abuse, compliance, or insurance needs it.

| # | Option | When to consider |
|---|--------|------------------|
| 5.1 | Vercel Bot Management / managed WAF rulesets | Sustained bot/abuse beyond custom rules |
| 5.2 | Cloudflare (or similar) in front of Vercel | Extra WAF/CDN control; usually redundant |
| 5.3 | E&O / cyber insurance | Ops/legal pack; not a website control |
| 5.4 | External pen test / bug bounty | After Phases 1–3 stable |
| 5.5 | Formal compliance program (e.g. SOC 2) | Business-driven; never implied by Phase 1 headers |

---

## Rollout order (recommended)

1. **Finish Phase 1** on any remaining public repos (one at a time).  
2. **Phase 2.1** — Preview Protection on marketing/ops only (skip Gurukul Riyaz Preview).  
3. **Phase 2.2–2.4** — CSP Report-Only → WAF rate limits (marketing APIs first, then product `/api/*`).  
4. **Phase 3** — Turnstile gaps + cookie flag audit + Gurukul Production ownership.  
5. **Phase 4** — CI when ready; Semgrep only after enrollment.  
6. **Phase 5** — only if triggered by abuse, customer, or insurance.

---

## Master rollout prompt (all phases — one repo at a time)

Paste into a chat **opened on that repo**. Edit the `PHASES=` line. No parallel agents.

```text
THIS REPO ONLY. No subagents. One shell step at a time (do not chain install+build+deploy).
$env:NODE_OPTIONS='--use-system-ca' for npm/vercel on Windows.

Read plan: nasneeraj.com/docs/legal/cybersecurity_coocie_plan.md
Canonical Phase 1 protocol: nasneeraj.com/docs/ops/saaniya-security-cookie-protocol.md

PHASES= next incomplete | 0 | 1 | 2 | 3 | 4 | 5 | 1+2 | all-ready
(Default if unset: inventory Phase 0–1 gaps; implement Phase 1 if missing; stop before Phase 2 unless PHASES includes 2+.
"all-ready" = audit only, no code/WAF/CI enrollments unless user said implement.)

Hard rules:
- No Semgrep / Semgrep Cloud / Semgrep CI gate unless PHASES includes 4 AND user said Semgrep is enrolled.
- No SOC 2 claims; no attorney PDFs in public repos.
- Document Permissions-Policy exceptions (Riyaz mic/camera; Fleet geolocation=(self)); do not blind-tighten.
- On deploy Error: Vercel logs → fix → commit → redeploy. Do not stop at "failed".
- Final reply ONLY Done or Blocked with evidence table.

---
PHASE 0 — Baseline (audit; fix only if broken)
- HTTPS/TLS + HTTP→HTTPS on project domains
- Secrets only in Vercel Env (scan for committed .env)
- Privacy/GPC language exists or link to company Privacy
Done when: short audit table (pass/fail) for this repo.

PHASE 1 — Headers + cookie/GPC (required before 2+)
1) Headers on all routes: HSTS max-age=63072000; includeSubDomains; preload; nosniff; X-Frame-Options DENY; Referrer-Policy strict-origin-when-cross-origin; Permissions-Policy; X-XSS-Protection 1; mode=block
2) No placeholder GA G-XXXXXXXXXX; gate analytics behind consent + GPC
3) Banner: localStorage saaniya-cookie-consent = essential|all; GPC forces essential; cast Navigator for globalPrivacyControl?: boolean
4) Add/keep docs/ops/saaniya-security-cookie-protocol.md + .cursor/rules/saaniya-security-cookie-protocol.mdc
Then /offline-verify-push (build or Vercel build if OneDrive blocks; e2e/smoke if present; Preview then Production).
Done when: evidence table with SHAs/URLs + headers confirmed on live URL.

PHASE 2 — Edge + CSP (only if PHASES includes 2)
2.1 Confirm Preview Deployment Protection = Standard on marketing/ops only (dashboard). SKIP GuruVidyaZen — Preview/`development` is live Riyaz Studio and must stay publicly reachable without Vercel login.
2.2 CSP Report-Only (marketing/simple) or reconcile existing CSP (e.g. Gurukul Zoom/Turnstile)
2.3 Promote CSP to enforcing only if Report-Only is clean (or product already enforces safely)
2.4 WAF: rate-limit /api/* + contact/signup forms (document rules)
2.5 Attack Challenge Mode runbook note in docs/ops (enable when abused)
Ship via /offline-verify-push if code/config changed.
Done when: checklist 2.1–2.5 status + deploy evidence if anything shipped.

PHASE 3 — App security depth (only if PHASES includes 3)
3.1 Turnstile (or equiv) on auth + public forms if missing
3.2 Session cookies HttpOnly; Secure; SameSite audit
3.3 Note RLS/OAuth least-privilege gaps (fix only if clearly broken / user asked)
3.4 No PHI pipelines without written program (EMR/healthcare)
3.5 Cookie category note on Privacy/help if missing
3.6 Gurukul only: resolve dual Vercel project / Production cancel if this is Gurukul-by-NAS
Ship via /offline-verify-push if code changed.
Done when: per-item table + SHAs if shipped.

PHASE 4 — CI / supply chain (only if PHASES includes 4)
4.1 Dependency audit path (CI or documented npm audit) — warn OK
4.2 Semgrep ONLY if user confirmed enrolled; else mark N/A skipped
4.3 Secret scanning note (GitHub/Vercel)
4.4 Optional: e2e smoke for cookie banner / GPC
Do not add paid/CI gates the org has not enrolled.
Done when: CI/doc status table.

PHASE 5 — Optional advanced (only if PHASES includes 5 AND user named the trigger)
5.1–5.5 Bot Management / Cloudflare / insurance / pen test / SOC 2 — recommend or implement ONLY what user named.
Default: recommendations + when-to-buy; no purchase/signup unless asked.
Done when: decision table (do / defer / N/A).

Evidence table (always):
| Check | Result |
| Phase(s) run | |
| Phase 0 audit | |
| npm run build / Vercel build | |
| e2e/smoke | |
| Preview SHA + URL | |
| Production SHA + URL | |
| Headers / CSP / WAF notes | |
| Semgrep | skipped unless enrolled |
| Residual risks | |
```

### Prompt examples

| Paste | Meaning |
|-------|---------|
| `PHASES=1` | Finish Phase 1 + OVP only |
| `PHASES=1+2` | Phase 1 gaps then Phase 2 edge/CSP/WAF |
| `PHASES=next incomplete` | Agent picks lowest incomplete phase for this repo |
| `PHASES=all-ready` | Audit Phases 0–5; no implement unless gaps in 0–1 and user allows |
| `PHASES=5` + “Bot Management only” | Phase 5 scoped recommendation/implement |

---

## Residual risks / ops notes

- **OneDrive** can break local `next build` (`UNKNOWN: read`) — use Vercel logs as verify evidence when needed.  
- **Dual Gurukul Vercel projects** — track under Phase 3.6.  
- **GPC typing** — always cast optional `globalPrivacyControl` before shipping TypeScript apps.  
- Do not publish attorney PDFs into public repos; do not claim SOC 2 from Phase 1 alone.
