# Deployment Guide — Cloudflare Pages + R2

This guide walks you through deploying the Sam music portfolio to Cloudflare Pages with audio files served from Cloudflare R2. Follow these steps from a fresh Cloudflare account to a fully deployed site in under 30 minutes.

---

## 1. Prerequisites

- **Cloudflare account** — [Sign up](https://dash.cloudflare.com/sign-up) (free tier is sufficient)
- **Domain name** — Optional; `<project>.pages.dev` subdomain works for testing
- **Wrangler CLI** — Install globally or use via npx:
  ```bash
  npm install -g wrangler    # global install
  # or
  npx wrangler <command>     # ad-hoc via npx
  ```
- **Node.js ≥ 18** — Required for Astro build
- **Git repository** — Project code pushed to GitHub or GitLab

---

## 2. R2 Bucket Setup

Audio files are stored in a Cloudflare R2 bucket and served via R2's public URL. The client-side audio player constructs URLs as `${R2_PUBLIC_URL}/${track-relative-path}`.

### Create the bucket

1. Log into the [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **R2 Object Storage** (left sidebar)
3. Click **Create bucket**
4. Name it `sam-audio` (or your preferred name — this must match the value in `wrangler.toml`)
5. Choose a location close to your audience
6. Click **Create bucket**

### Enable public access

1. Go to your bucket → **Settings** → **Public access**
2. Under **R2.dev subdomain**, click **Allow access**
3. Agree to the terms and note the generated public URL (format: `https://pub-<hash>.r2.dev`)
4. This URL becomes your `R2_PUBLIC_URL` in production

### Upload audio files

Using Wrangler CLI:

```bash
# Upload a single track
npx wrangler r2 object put sam-audio/releases/midnight-sessions/01-track.mp3 \
  --file ./local-audio/01-track.mp3

# Upload with content type (recommended)
npx wrangler r2 object put sam-audio/releases/midnight-sessions/01-track.mp3 \
  --file ./local-audio/01-track.mp3 \
  --content-type audio/mpeg
```

Or use the **Cloudflare Dashboard** upload UI (bucket → Upload).

### Recommended folder structure

```
sam-audio/
  releases/
    midnight-sessions/
      01-intro.mp3
      02-pulse.mp3
      03-echoes.mp3
    neon-dreams/
      01-awakening.mp3
      02-reflection.mp3
```

- Path pattern: `releases/{release-slug}/{track-number}-{track-slug}.mp3`
- Supported formats: **MP3** (primary), **OGG** (fallback for howler.js cross-browser support)
- The `audioFile` field in release frontmatter should match the path relative to the bucket root (e.g., `releases/midnight-sessions/01-intro.mp3`)

### Verify

Open the public URL + file path in a browser:

```
https://pub-<hash>.r2.dev/releases/midnight-sessions/01-intro.mp3
```

Confirm the audio file loads and plays.

---

## 3. Cloudflare Pages Project

### Connect to Git repository

1. Go to **Cloudflare Dashboard** → **Pages** → **Create a project**
2. Select **Connect to Git**
3. Choose your repository (GitHub or GitLab)
4. Authorize Cloudflare to access the repo if prompted

### Build settings

Configure these in the Pages project setup:

| Setting                | Value           |
| ---------------------- | --------------- |
| Framework preset       | `Astro`         |
| Build command          | `npm run build` |
| Build output directory | `dist`          |
| Root directory         | `/` (default)   |
| Node.js version        | `18` (or `20`)  |

### Environment variables

Set these in **Pages** → **your project** → **Settings** → **Environment variables**:

| Variable                    | Value                     | Notes                                                                               |
| --------------------------- | ------------------------- | ----------------------------------------------------------------------------------- |
| `R2_PUBLIC_URL`             | `https://pub-xxxx.r2.dev` | Your R2 public URL from step 2                                                      |
| `SITE_URL`                  | `https://sampaultoms.com` | Your production domain                                                              |
| `NODE_VERSION`              | `18`                      | Ensures correct Node.js in build                                                    |
| `RESEND_API_KEY`            | `re_xxxxxxxxxxxx`         | API key for Resend email delivery (contact form)                                    |
| `CONTACT_RECIPIENT_EMAIL`   | `you@example.com`         | Email address that receives contact form submissions                                |
| `CONTACT_FROM_EMAIL`        | `noreply@yourdomain.com`  | Verified sender address for contact form emails (Resend requires a verified domain) |
| `PUBLIC_TURNSTILE_SITE_KEY` | `0x4AAAAAAAA...`          | Cloudflare Turnstile site key (client-side, safe to expose; leave blank to disable) |
| `TURNSTILE_SECRET_KEY`      | `0x4AAAAAAAA...`          | Cloudflare Turnstile secret key (server-side verification; leave blank to disable)  |

> **Important:** Set these for **both** Production and Preview environments. `RESEND_API_KEY`, `CONTACT_RECIPIENT_EMAIL`, `CONTACT_FROM_EMAIL`, and `TURNSTILE_SECRET_KEY` are server-side secrets — never prefix with `PUBLIC_`. `PUBLIC_TURNSTILE_SITE_KEY` is intentionally public (it's rendered in the browser). The Turnstile variables are optional — if either is empty, the contact form falls back to honeypot-only spam protection.

### Alternative: Direct Upload

If not using Git integration:

```bash
npm run build
npx wrangler pages deploy dist --project-name sam-paul-toms
```

---

## 4. DNS Configuration (Custom Domain)

Skip this section if using the default `<project>.pages.dev` subdomain.

### Set up custom domain

1. In **Cloudflare Pages** → your project → **Custom domains** → **Set up a custom domain**
2. Enter your domain (e.g., `sampaultoms.com`)
3. Cloudflare provides a CNAME target (e.g., `sam-music.pages.dev`)

### If your domain is on Cloudflare

- The DNS record is added automatically — no manual configuration needed

### If your domain is elsewhere

Add DNS records at your registrar:

| Type  | Name  | Target                                                          |
| ----- | ----- | --------------------------------------------------------------- |
| CNAME | `@`   | `sam-music.pages.dev` (apex domain — requires CNAME flattening) |
| CNAME | `www` | `sam-music.pages.dev`                                           |

- Wait for DNS propagation (< 5 minutes on Cloudflare, up to 48 hours elsewhere)
- SSL is handled automatically by Cloudflare

### Update robots.txt

After configuring your domain, update `public/robots.txt` to use your production domain:

```
User-agent: *
Allow: /

Sitemap: https://sampaultoms.com/sitemap-index.xml
```

Replace `https://sampaultoms.com` with your actual domain. This file is committed to the repo, so update it before deploying.

---

## 5. Local Development with R2

For local development with R2 emulation:

### Install Wrangler as a dev dependency

```bash
npm install -D wrangler
```

### Create a local R2 bucket

```bash
npx wrangler r2 bucket create sam-audio --local
```

### Upload test audio locally

```bash
npx wrangler r2 object put sam-audio/releases/test/01-demo.mp3 \
  --file ./test-audio.mp3 --local
```

### Run with R2 emulation

```bash
npx wrangler pages dev -- npm run dev
```

This starts a local Cloudflare Pages emulator with R2 available at `http://localhost:4321/r2`. The `R2_PUBLIC_URL=http://localhost:4321/r2` in `.env` makes audio files accessible.

### Simpler dev without R2

```bash
npm run dev
```

The site will work, but the audio player will show errors for missing files since R2 is not emulated.

---

## 6. Deployment Checklist

Before going live, verify:

- [ ] R2 bucket created with public access enabled
- [ ] Audio files uploaded to R2 in the expected folder structure (`releases/{slug}/{filename}.mp3`)
- [ ] Pages project created and linked to git repository (or direct upload configured)
- [ ] Environment variables set in Pages dashboard: `R2_PUBLIC_URL`, `SITE_URL`, `NODE_VERSION`
- [ ] Resend API key (`RESEND_API_KEY`) configured and contact form sends email successfully
- [ ] Verified sender domain configured for `CONTACT_FROM_EMAIL` in Resend dashboard
- [ ] Contact form recipient email (`CONTACT_RECIPIENT_EMAIL`) set to desired inbox
- [ ] Cloudflare Turnstile keys configured (optional — form works without them using honeypot fallback)
- [ ] Custom domain configured (if applicable)
- [ ] `public/robots.txt` Sitemap URL matches production domain
- [ ] `SITE_URL` in Pages env vars matches production domain
- [ ] First deploy succeeds and site loads at production URL
- [ ] Audio player loads and plays a track from R2
- [ ] Sitemap accessible at `/sitemap-index.xml` and lists all pages with correct domain
- [ ] Structured data (JSON-LD) uses correct production URLs
- [ ] Open Graph / Twitter Card images resolve correctly

---

## 7. Ongoing: Adding New Audio Files

To add new releases to the site:

### 1. Upload audio to R2

```bash
# MP3 (required)
npx wrangler r2 object put sam-audio/releases/{slug}/{filename}.mp3 \
  --file ./local-file.mp3 \
  --content-type audio/mpeg

# OGG fallback (optional but recommended)
npx wrangler r2 object put sam-audio/releases/{slug}/{filename}.ogg \
  --file ./local-file.ogg \
  --content-type audio/ogg
```

### 2. Add release content

Create `src/content/releases/{slug}.md` with the release metadata:

```yaml
---
title: 'Release Title'
artist: 'Sam'
releaseDate: 2025-11-15
type: album
artwork: /images/releases/{slug}.svg
tracks:
  - title: 'Track Name'
    duration: '3:42'
    audioFile: 'releases/{slug}/01-track.mp3'
---
Extended description or liner notes here.
```

### 3. Deploy

Git push triggers automatic redeployment via Cloudflare Pages:

```bash
git add .
git commit -m "feat: add new release {slug}"
git push
```

---

## 8. Costs and Limits

| Service                  | Free Tier                            | Notes                                              |
| ------------------------ | ------------------------------------ | -------------------------------------------------- |
| **Cloudflare Pages**     | Unlimited requests, 500 builds/month | Sufficient for a music portfolio                   |
| **R2 Storage**           | 10 GB free                           | Sufficient for ~100–200 MP3 files                  |
| **R2 Operations**        | 1M Class A, 10M Class B per month    | Well within free tier                              |
| **R2 Egress**            | **Free** — no egress fees            | Key advantage over AWS S3                          |
| **Custom domain**        | ~$12/year                            | If not using `.pages.dev` subdomain                |
| **Resend (email)**       | 100 emails/day, 3,000/month          | Contact form delivery                              |
| **Cloudflare Turnstile** | Unlimited verifications              | CAPTCHA/bot protection for contact form (optional) |

**Total hosting cost: $0/month** (free tier) + domain registration if applicable.

### Scaling limits

- Pages builds: 500/month on free plan (upgrade to $20/month for 5,000)
- R2 storage: $0.015/GB/month beyond 10 GB free tier
- R2 operations: $4.50/million Class A, $0.36/million Class B beyond free tier

For a typical music portfolio with occasional updates, the free tier is more than sufficient.
