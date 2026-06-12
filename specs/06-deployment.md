# 06 — Deployment

**Last updated:** 2026-06-12

**Purpose:** Documents the Cloudflare Pages + R2 deployment architecture, environment variables, build pipeline, and cost structure.

---

## Deployment Architecture

The site is deployed on **Cloudflare Pages** with server-side rendering via the `@astrojs/cloudflare` adapter. Audio files are served from a separate **Cloudflare R2** public bucket.

```
┌─────────────────────────────────────┐
│         Cloudflare Pages            │
│  ┌───────────┐  ┌────────────────┐  │
│  │ Static    │  │ Server-side    │  │
│  │ assets    │  │ functions      │  │
│  │ (HTML,    │  │ (API routes,   │  │
│  │  CSS, JS, │  │  SSR pages)    │  │
│  │  images)  │  │                │  │
│  └───────────┘  └────────────────┘  │
└─────────────────────────────────────┘
         │                   │
         │    Audio files    │
         ▼                   ▼
┌─────────────────────────────────────┐
│         Cloudflare R2               │
│  Public bucket serving MP3 files    │
│  (via R2_PUBLIC_URL)                │
└─────────────────────────────────────┘
```

### Key Configuration

- **`wrangler.toml`**: Project name (`sam-music`), compatibility date, build output directory (`./dist`)
- **`astro.config.mjs`**: `output: 'server'`, `adapter: cloudflare()`, `site` from `SITE_URL` env var

---

## Environment Variables

All environment variables are documented in `.env.example`. Organized by category:

### Deployment

| Variable | Required | Scope | Default | Description |
|----------|----------|-------|---------|-------------|
| `R2_PUBLIC_URL` | ✅ | Server | `http://localhost:4321/r2` | Base URL for audio files on R2. Production: R2 bucket's public access URL (e.g., `https://pub-xxxx.r2.dev`). Dev with Wrangler: `http://localhost:4321/r2`. Dev with local samples: `http://localhost:4321/audio-samples` |
| `SITE_URL` | ❌ | Server | `https://sampaultoms.com` | Site URL for canonical tags, sitemap generation, and structured data. Used in `astro.config.mjs` as `site` property |

### Analytics

| Variable | Required | Scope | Default | Description |
|----------|----------|-------|---------|-------------|
| `PUBLIC_UMAMI_WEBSITE_ID` | ❌ | Public | — | Umami analytics website UUID. Leave blank to disable |
| `PUBLIC_UMAMI_SRC` | ❌ | Public | — | Full URL to Umami tracking script (e.g., `https://analytics.example.com/script.js`) |

### Social Links

| Variable | Required | Scope | Default | Description |
|----------|----------|-------|---------|-------------|
| `PUBLIC_SOCIAL_IMDB` | ❌ | Public | — | IMDB profile URL. Leave blank to hide icon |
| `PUBLIC_SOCIAL_TIDAL` | ❌ | Public | — | Tidal artist profile URL. Leave blank to hide icon |
| `PUBLIC_SOCIAL_SPOTIFY` | ❌ | Public | — | Spotify artist profile URL. Leave blank to hide icon |
| `PUBLIC_SOCIAL_INSTAGRAM` | ❌ | Public | — | Instagram profile URL. Leave blank to hide icon |
| `PUBLIC_SOCIAL_APPLE_MUSIC` | ❌ | Public | — | Apple Music artist profile URL. Leave blank to hide icon |

### WhatsApp

| Variable | Required | Scope | Default | Description |
|----------|----------|-------|---------|-------------|
| `PUBLIC_WHATSAPP_PHONE` | ❌ | Public | — | Phone number for WhatsApp link in contact modal. International format without `+` or spaces (e.g., `447123456789`). Leave blank to hide |

### Theme

| Variable | Required | Scope | Default | Description |
|----------|----------|-------|---------|-------------|
| `PUBLIC_ACCENT_COLOR` | ❌ | Public | `#852929` | Site-wide accent/brand color (hex). Controls buttons, focus rings, waveforms, and all accent highlights. Applied in `BaseLayout.astro` via inline style on `<html>` |

### Contact Form

| Variable | Required | Scope | Default | Description |
|----------|----------|-------|---------|-------------|
| `RESEND_API_KEY` | ✅* | Server | — | Resend API key for sending emails. Get at https://resend.com (*required for contact form to work) |
| `CONTACT_RECIPIENT_EMAIL` | ✅* | Server | — | Email address that receives contact form submissions |
| `CONTACT_FROM_EMAIL` | ✅* | Server | — | Verified sender address. Dev: `onboarding@resend.dev`. Production: verified domain address |

### Spam Protection

| Variable | Required | Scope | Default | Description |
|----------|----------|-------|---------|-------------|
| `PUBLIC_TURNSTILE_SITE_KEY` | ❌ | Public | — | Cloudflare Turnstile site key. Must have `PUBLIC_` prefix. Leave blank to disable (falls back to honeypot only) |
| `TURNSTILE_SECRET_KEY` | ❌ | Server | — | Cloudflare Turnstile secret key for server-side verification. Leave blank to skip verification |

### Instagram oEmbed (Build-Time)

| Variable | Required | Scope | Default | Description |
|----------|----------|-------|---------|-------------|
| `INSTAGRAM_OEMBED_CACHE_DIR` | ❌ | Build | — | Cache directory for Instagram oEmbed responses (e.g., `.cache/instagram-oembed`). Cache entries expire after 7 days. If not set, thumbnails are fetched on every build |
| `INSTAGRAM_ACCESS_TOKEN` | ❌* | Build | — | Facebook/Instagram access token for oEmbed endpoint. *Required as of 2024 — unauthenticated requests return 403. Used by `fetch-instagram-oembed.mjs` |

---

## Build Pipeline

The build pipeline is defined in `package.json` as a chained script:

```
npm run build
  │
  ├── 1. node scripts/fetch-instagram-oembed.mjs
  │     Fetches Instagram thumbnail images from oEmbed API
  │     Downloads to public/images/gallery/
  │     Uses INSTAGRAM_ACCESS_TOKEN
  │
  ├── 2. astro build
  │     Compiles Astro pages → static HTML + server functions
  │     Generates sitemap via @astrojs/sitemap
  │     Bundles client-side JS (Preact islands)
  │     Output to dist/
  │
  └── 3. node scripts/clean-dist-audio.mjs
        Removes dist/audio-samples (local dev files)
        Prevents sample audio from being deployed to production
```

### Additional Build Scripts

| Script | Purpose |
|--------|---------|
| `npm run fetch:oembed` | Run only the Instagram thumbnail fetcher |
| `npm run generate:waveforms` | Generate waveform peak JSON files from audio |

---

## Deployment Checklist

### Initial Setup

1. **Create R2 bucket** in Cloudflare dashboard
   - Enable public access (get the `R2_PUBLIC_URL`)
   - Upload audio files maintaining the directory structure: `releases/`, `works/`
   - Upload waveform JSON to `public/waveforms/` (or generate with `npm run generate:waveforms`)

2. **Create Pages project**
   - Connect to Git repository
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node.js version: ≥ 18

3. **Set environment variables** in Cloudflare Pages dashboard
   - All server-side variables (`R2_PUBLIC_URL`, `SITE_URL`, `RESEND_API_KEY`, etc.)
   - All public variables (`PUBLIC_*`)
   - Build-time variables (`INSTAGRAM_ACCESS_TOKEN`, `INSTAGRAM_OEMBED_CACHE_DIR`)

4. **Configure custom domain** in Pages settings

5. **Update `public/robots.txt`** with the production sitemap URL

6. **First deploy verification:**
   - Site loads at custom domain
   - Audio files play from R2
   - Contact form sends emails
   - Sitemap accessible at `/sitemap-index.xml`

---

## Cost Structure

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| **Cloudflare Pages** | Unlimited sites, 500 builds/month, unlimited bandwidth | $20/month (Teams) for more builds |
| **Cloudflare R2** | 10 GB storage, 1 million Class A ops, 10 million Class B ops, **free egress** | $0.015/GB/month storage |
| **Resend** | 3,000 emails/month, 100 emails/day | Pay-as-you-go at scale |
| **Cloudflare Turnstile** | Unlimited verifications | Free — no paid tier |
| **Umami Analytics** | Self-hosted (free on Cloudflare Pages/Workers) | Cloud-hosted plans available |

**Estimated monthly cost for a typical artist portfolio:** $0 (all within free tiers).
