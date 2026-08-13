# Facebook & Instagram — how to publish from the social kits

Meta needs you signed in (or an official Meta API connection with your Business account). These kits prepare copy and images; you publish them in Meta Business Suite. You are **not** uploading website HTML to Instagram or Facebook.

**One account for everything:** Facebook Page + Instagram `@saaniyasoftware` (Saaniya Software LLC). Product kits are posts under that same account — not separate Pages.

## Open the kits

| Kit | URL |
|-----|-----|
| Company hub | https://saaniya-software.nasneeraj.com/social-kit |
| GuruVidyaZen | https://saaniya-software.nasneeraj.com/social-guruvidyazen |
| SISLMS | https://saaniya-software.nasneeraj.com/social-sislms |
| Riyaz Studio | https://saaniya-software.nasneeraj.com/social-riyaz |
| Saarthee CoPlanner | https://saaniya-software.nasneeraj.com/social-saarthee-coplanner |
| Saarthee Fleet | https://saaniya-software.nasneeraj.com/social-saarthee-fleet |
| Astrology book | https://saaniya-software.nasneeraj.com/social-astrology |
| Saaniya EMR | https://saaniya-software.nasneeraj.com/social-saaniya-emr |

Local files: `social-kit.html` and `social-*.html`. Assets live in `assets/social/`.

**Visiting card** (brand front + website QR): https://saaniya-software.nasneeraj.com/visiting-card · files in `assets/visiting-card/`.

## One-time Meta setup

1. Open [Meta Business Suite](https://business.facebook.com/).
2. Create a Facebook **Page** (Business) named **Saaniya Software LLC**.
3. Create an Instagram **Professional** account; connect it to that Facebook Page.
4. From the company kit: upload **profile photo** (avatar) + **Facebook cover**.
5. Set website to `https://saaniya-software.nasneeraj.com` and email to `saaniyasoftware@nasneeraj.com`.
6. Use downloadable art from `assets/social/` — footers show `saaniya-software.nasneeraj.com` and `saaniyasoftware@nasneeraj.com`.
7. Paste bio / About text from the company kit.
8. Publish the first brand post + story; pin highlights (e.g. Products · Cybersecurity · Contact).

## Post each product

For each product kit:

1. Download the square feed image (and story image if you want).
2. In Business Suite → **Create post**.
3. Paste the caption from the kit.
4. Publish to **Facebook + Instagram** together.

Suggested order:

1. Brand intro (company kit)
2. GuruVidyaZen
3. SISLMS
4. Riyaz
5. CoPlanner
6. Fleet
7. Astrology
8. Saaniya EMR

## What Cursor / an agent cannot do

Posting requires your Meta login (or Graph API tokens you create). An agent can tighten captions, draft a schedule, or help wire Meta Graph API later — it cannot click Publish inside your Facebook/Instagram account.

## Related

- Branding rule: `.cursor/rules/saaniya-branding.mdc`
- Contact email: `saaniyasoftware@nasneeraj.com`
- Marketing host: `https://saaniya-software.nasneeraj.com`

## DNS

Marketing host is already live with CNAME `saaniya-software` → `ff02ea68469414bf.vercel-dns-016.com.` Apex/`www` redirect to this host in `vercel.json`.
