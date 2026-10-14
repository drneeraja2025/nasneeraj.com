# Attack Challenge Mode runbook (nasneeraj.com)

**Owner:** Saaniya Software LLC ops  
**Project:** `saaniya-software/nasneeraj-com` (`prj_GkaOYJ1bBt6Cfoll2CDBnO2q7rdJ`)  
**When:** Sustained scrape/bot abuse, form flooding, or anomalous 429 spikes on `/api/*`.

## Enable (dashboard)

1. Vercel → Project **nasneeraj-com** → **Firewall** / **Attack Challenge Mode**.  
2. Turn **Attack Challenge Mode** on for Production (and Preview if needed).  
3. Monitor Traffic / Firewall logs for 15–30 minutes.  
4. Turn **off** when the incident ends so real users are not challenged.

## Related controls (always on where configured)

| Control | Location |
|---------|----------|
| Platform DDoS | Vercel default |
| Custom WAF rate-limit `/api/contact` | Firewall custom rule (Phase 2) |
| App rate limit + honeypot | `api/contact.js` + hidden `website` field |
| Optional Turnstile | Set `TURNSTILE_SECRET_KEY` (+ site key in HTML when wiring widget) |

## Do not

- Leave Challenge Mode on indefinitely without a reason.  
- Commit secrets or Turnstile keys to git.
