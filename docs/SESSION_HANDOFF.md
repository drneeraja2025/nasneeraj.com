# Session handoff — 24 Sep 2026

Saaniya, the site chatbot, is on the marketing pages. She answers from a build-time index of the public HTML and can store a thumbs-up answer in Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set.

## Chat

- Widget: `assets/saaniya-chat.js` and `assets/saaniya-chat.css`
- Voice and language: mic, spoken replies, EN / HI / ES / MR, female or male voice. Spoken audio comes from `/api/chat-speech`. The reply language is sent to `/api/chat`.
- Avatar: `assets/mascot/girl/saaniya-chat-avatar.png` (the girl, from `girl-work-school-a.png`)
- Routes: `api/chat.js` (streams `openai/gpt-4.1-mini` through the AI Gateway), `api/chat-learn.js`
- Index: `node scripts/build-site-index.mjs` → `data/site-index.json`
- Check: `npm run verify:chat`
- Pages with the widget: home, services, FAQ, contact, SISLMS, SISMMS, Gurukul, Saarthee, Fleet, EMR, Office Suite, compare, security
- `guruvidyazen.html` is only a redirect, so it has no widget

## Env (Vercel, not git)

- AI Gateway on Vercel uses OIDC when deployed. Local calls need `AI_GATEWAY_API_KEY`.
- Learning stays off until `BLOB_READ_WRITE_TOKEN` exists. Chat still works.

## Earlier ship still live

Office Suite and EMR country pricing from 23 Sep. Astrology and demo video files in the working tree were left uncommitted.
