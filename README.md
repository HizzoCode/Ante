# Ante — miss a habit, pay your friends

Waitlist landing page for **Ante** (working title): a habit app where you stake real money on your habits, prove them with AI-verified evidence, and squad pots redistribute stakes from slackers to finishers.

Built with Vite + React 19 + Tailwind CSS 3 + GSAP.

## Run it

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # production bundle → dist/
```

## Waitlist storage

The form POSTs JSON to the URL in `VITE_WAITLIST_WEBHOOK_URL` (see `.env.example`) — point it at an n8n webhook. Unset = demo mode (signups log to the browser console). UTM params from inbound links ride along on every signup for per-video attribution.

## Deploying

Static host (Vercel/Netlify/Cloudflare Pages) serving `dist/`. Enable SPA fallback (rewrite all routes to `/index.html`) so `/privacy` and `/terms` resolve on direct load. Set `VITE_WAITLIST_WEBHOOK_URL` in the host's env — it's baked in at build time.

## Status

Pre-launch validation: measuring waitlist conversion and niche pick ("what would you stake on?" dropdown) before building the app. Legal pages are placeholders — counsel review before any real money moves.
