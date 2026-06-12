# 07 — Configuration

**Last updated:** 2026-06-12

**Purpose:** Documents everything that needs to change when creating a new site from this template, including configuration files, content, assets, and hardcoded references.

---

## What Needs to Change

When forking this template for a new artist, the following categories of changes are required:

1. **Configuration files** — project name, site URL, adapter settings
2. **Environment variables** — all artist-specific env vars
3. **Content files** — all markdown files in `src/content/`
4. **Static assets** — images, favicon, banner
5. **Audio files** — uploaded to Cloudflare R2
6. **Hardcoded references** — artist name strings in source code (see [Known Hardcodes](#known-hardcodes) below)

---

## Configuration Files

### `package.json`

| Field | Current Value | Change To |
|-------|--------------|-----------|
| `name` | `"sam"` | Project identifier (lowercase, no spaces) |
| `description` | `"Sam Paul Toms — Portfolio"` | `"Artist Name — Portfolio"` |

### `astro.config.mjs`

| Setting | Current Value | Change To |
|---------|--------------|-----------|
| `site` | `process.env.SITE_URL \|\| 'https://sampaultoms.com'` | Set `SITE_URL` env var to new domain; optionally update fallback |
| `adapter` | `cloudflare()` | No change needed (unless using a different host) |
| `integrations` | `[preact(), sitemap()]` | No change needed |

### `wrangler.toml`

| Setting | Current Value | Change To |
|---------|--------------|-----------|
| `name` | `"sam-music"` | New Cloudflare Pages project name |

### `.env.example`

Copy to `.env` and fill in all artist-specific values. See [06-deployment.md](./06-deployment.md) for the full env var reference.

### `public/robots.txt`

```
User-agent: *
Allow: /

Sitemap: https://sampaultoms.com/sitemap-index.xml
```

Update the `Sitemap` URL to the new domain.

### `tsconfig.json`

No changes needed — uses Astro defaults.

---

## Content Replacement

### Process

1. Delete all markdown files in `src/content/` subdirectories
2. Create new content files matching the Zod schemas (see [03-content-model.md](./03-content-model.md))
3. Each collection has specific requirements:

| Collection | Files | Notes |
|-----------|-------|-------|
| `about/` | Single `bio.md` | Required for AboutModal to render |
| `works/` | One file per playlist section | Update `sectionOrder` in `src/pages/index.astro` |
| `releases/` | One file per release | Filenames become URL slugs |
| `projects/` | One file per project | Sorted by `publishDate` descending |
| `gallery/` | One file per gallery item | `order` field controls display position |

### Critical: `sectionOrder` in `index.astro`

The homepage sorts works sections by a hardcoded array in `src/pages/index.astro`:

```typescript
const sectionOrder = [
  'documentary',
  'film',
  'library',
  'trailers-themes-idents',
];
```

This must be updated to match the new `slug` values in the `works/` content.

---

## Asset Replacement

### Images (`public/images/`)

| Directory | Contents | Replacement Notes |
|-----------|----------|-------------------|
| `banner/` | Hero banner image(s) | Full-bleed cinematic image; aspect ratio ~27:9 (desktop) |
| `bio/` | Artist portrait | Square crop, ~500px max |
| `carousel/` | Polaroid frame overlays (`polaroid1.png` — `polaroid4.png`) | Optional decorative frames; keep or replace |
| `gallery/` | Gallery thumbnails | Including Instagram oEmbed thumbnails |
| `projects/` | Project card images | Landscape orientation preferred |
| `releases/` | Album artwork | Square, high-res (used in cards and detail pages) |

### Favicon

- `public/favicon.svg` — Currently contains an artist-specific "S" glyph. Replace with the new artist's favicon SVG.
- `public/favicon.ico` — Replace with matching ICO version.

### Fonts (`public/fonts/`)

Self-hosted Inter web fonts. Replace if the new site uses a different typeface (also update `--font-display` and `--font-body` in `global.css`).

### Audio Files (Cloudflare R2)

Upload to R2 maintaining the directory structure:
- `releases/{album-slug}/01-track-name.mp3`
- `works/{section-slug}/track-name.mp3`

Then set `R2_PUBLIC_URL` to the R2 bucket's public URL.

---

## Known Hardcodes

The following artist-specific strings are hardcoded in source code and **must** be updated when forking the template. These are not configurable via environment variables and require editing the source files.

### SEO / Meta Tags

| File | Line | Hardcoded Value | Status |
|------|------|----------------|--------|
| `src/components/SEOHead.astro` | 30 | `og:site_name` = `"Sam Paul Toms"` | ✅ Resolved via `PUBLIC_SITE_NAME` env var |
| `src/scripts/seo-helpers.ts` | 64 | `og:site_name` = `"Sam Paul Toms"` | ✅ Resolved via `PUBLIC_SITE_NAME` env var |

> **Template-ization resolved:** `og:site_name` is now configurable via the `PUBLIC_SITE_NAME` environment variable (defaults to `"Sam Paul Toms"`). Set it in `.env` when forking the template for a new artist.

### Default Titles & Descriptions

| File | Line(s) | Hardcoded Value | Status |
|------|---------|----------------|--------|
| `src/layouts/BaseLayout.astro` | 31–32 | Default `title`: `"Sam Paul Toms"`, default `description` | ✅ Resolved via `PUBLIC_SITE_NAME` env var |
| `src/layouts/ReleasesLayout.astro` | 15 | Default `title`: `"Sam Paul Toms — Releases"` | ✅ Resolved via `PUBLIC_SITE_NAME` env var |
| `src/layouts/ReleasesLayout.astro` | 36 | Nav link text: `"Sam Paul Toms"` | ✅ Resolved via `PUBLIC_SITE_NAME` env var |
| `src/pages/releases/[slug].astro` | 48 | Fallback URL: `'https://sampaultoms.com/'` | Open — requires `SITE_URL` env var |
| `src/pages/releases/[slug].astro` | 52, 56, 63 | Meta description, title pattern, nav text: `"Sam Paul Toms"` | ✅ Resolved via `PUBLIC_SITE_NAME` env var |
| `src/pages/releases/index.astro` | 17–18 | `"Sam Paul Toms — Releases"` title and description | ✅ Resolved via `PUBLIC_SITE_NAME` env var |
| `src/pages/index.astro` | 82 | `bioSummary` text | ✅ Resolved via `PUBLIC_SITE_NAME` env var |
| `src/pages/index.astro` | 86–87 | `title`: `"Sam Paul Toms — Composer & Producer"`, `description` | ✅ Resolved via `PUBLIC_SITE_NAME` env var |

### Contact Form

| File | Line | Hardcoded Value | Status |
|------|------|----------------|--------|
| `src/pages/api/contact.ts` | ~141 | Auto-reply sign-off `"Sam"` and domain `"sampaultoms.com"` | **Resolved** — uses `PUBLIC_ARTIST_NAME` env var and derives hostname from `SITE_URL` |

### WhatsApp Link

| File | Line | Hardcoded Value | Status |
|------|------|----------------|--------|
| `src/components/ContactModal.tsx` | ~439 | WhatsApp greeting `"Hi%20Sam"` | **Resolved** — uses `PUBLIC_ARTIST_NAME` env var |

### Search Pattern

To find all hardcoded references:

```bash
grep -rn "Sam Paul Toms\|sampaultoms\|sam-music\|Sam," src/ \
  --include="*.astro" --include="*.ts" --include="*.tsx"
```

---

## New Site Checklist

Follow these steps in order to fork this template for a new artist:

### 1. Project Setup

- [ ] Clone the repository
- [ ] Update `package.json`: `name`, `description`
- [ ] Update `wrangler.toml`: `name` (Cloudflare Pages project name)
- [ ] Copy `.env.example` to `.env` and fill in all values
- [ ] Run `npm install`

### 2. Brand & Theme

- [ ] Set `PUBLIC_ACCENT_COLOR` in `.env` to the artist's brand color
- [ ] Set `PUBLIC_SITE_NAME` in `.env` to the artist's name (used in titles, meta tags, and navigation)
- [ ] Replace `public/favicon.svg` with artist's favicon
- [ ] Replace `public/favicon.ico` with matching ICO
- [ ] (Optional) Replace fonts in `public/fonts/` and update `--font-display`/`--font-body` in `global.css`

### 3. Content

- [ ] Delete all files in `src/content/about/`, `src/content/works/`, `src/content/releases/`, `src/content/projects/`, `src/content/gallery/`
- [ ] Create new `src/content/about/bio.md` matching the about schema
- [ ] Create new works sections in `src/content/works/`
- [ ] Update `sectionOrder` array in `src/pages/index.astro` to match new slugs
- [ ] Create new releases in `src/content/releases/`
- [ ] Create new projects in `src/content/projects/`
- [ ] Create new gallery items in `src/content/gallery/`
- [ ] Update `bioSummary` text in `src/pages/index.astro`

### 4. Images

- [ ] Replace hero banner image(s) in `public/images/banner/`
- [ ] Replace artist portrait in `public/images/bio/`
- [ ] Replace project images in `public/images/projects/`
- [ ] Replace release artwork in `public/images/releases/`
- [ ] Replace gallery images in `public/images/gallery/`
- [ ] (Optional) Replace or remove polaroid frames in `public/images/carousel/`

### 5. Audio

- [ ] Create Cloudflare R2 bucket and enable public access
- [ ] Upload MP3 files to R2 (maintaining `releases/` and `works/` directory structure)
- [ ] Set `R2_PUBLIC_URL` in `.env`
- [ ] Run `npm run generate:waveforms` to create waveform JSON files
- [ ] Run `npm run generate:sample-audio` for local development samples

### 6. Hardcoded References

- [ ] Search and replace all "Sam Paul Toms" references (see [Known Hardcodes](#known-hardcodes))
- [ ] Update `og:site_name` in `src/components/SEOHead.astro` and `src/scripts/seo-helpers.ts`
- [ ] Update default title/description in `src/layouts/BaseLayout.astro`
- [ ] Update nav links in `src/layouts/ReleasesLayout.astro` and release pages
- [ ] ~~Update auto-reply text in `src/pages/api/contact.ts`~~ — now configured via `PUBLIC_ARTIST_NAME` and `SITE_URL` env vars
- [ ] ~~Update WhatsApp message in `src/components/ContactModal.tsx`~~ — now configured via `PUBLIC_ARTIST_NAME` env var
- [ ] Update `public/robots.txt` sitemap URL

### 7. Infrastructure

- [ ] Create Cloudflare Pages project (connected to repo)
- [ ] Set all environment variables in Cloudflare Pages dashboard
- [ ] Configure custom domain
- [ ] Set up Resend account and verify sending domain
- [ ] (Optional) Set up Umami analytics instance

### 8. Verification

- [ ] `npm run build` succeeds
- [ ] `npm run dev` — site loads at `localhost:4321`
- [ ] Audio plays from R2
- [ ] Contact form sends email
- [ ] All pages render without errors
- [ ] SEO meta tags show correct artist name
- [ ] Sitemap generates at `/sitemap-index.xml`
