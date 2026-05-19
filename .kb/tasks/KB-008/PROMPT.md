# Task: KB-008 - Cloudflare Pages + R2 Deployment Pipeline

**Created:** 2026-05-19
**Size:** M

## Review Level: 1 (Plan Only)

**Assessment:** This task adds configuration files (`wrangler.toml`, updated `astro.config.mjs`) and a documentation guide — all well-understood patterns. No security-sensitive code, no novel architecture, and changes are easily reversible. Review the plan for correctness, then let the agent execute.
**Score:** 3/8 — Blast radius: 1, Pattern novelty: 0, Security: 0, Reversibility: 2

## Mission

Configure the deployment pipeline so the Astro site can be deployed to Cloudflare Pages and audio files served from Cloudflare R2. This task creates the `wrangler.toml` configuration, ensures `astro.config.mjs` has the correct Cloudflare adapter and production `site` URL, updates `.env.example` with all deployment-related variables, and writes a comprehensive step-by-step deployment guide (`docs/deployment.md`). No actual deployment happens here — the guide enables a human to deploy from a fresh Cloudflare account in under 30 minutes.

## Dependencies

- **Task:** KB-002 (Project Scaffolding) — must be complete. This task assumes:
  - Astro 5 project exists in `~/dev/sam` with `package.json`, `astro.config.mjs`, `tsconfig.json`
  - `@astrojs/cloudflare` adapter already installed and configured in `astro.config.mjs` with `output: 'server'` and `adapter: cloudflare()`
  - `npm run build` succeeds and produces output suitable for Cloudflare Pages
  - `.env.example` exists with `R2_PUBLIC_URL=http://localhost:8788/r2`
  - `src/layouts/BaseLayout.astro` exists
- **Task:** KB-003 (Audio Player) — must be complete. This task assumes:
  - Audio player uses `R2_PUBLIC_URL` env var to construct audio file URLs (client-side)
  - `src/scripts/audio-player-events.ts` exists
  - Player works with audio URLs in the format `${R2_PUBLIC_URL}/${track-relative-path}`
- **Task:** KB-006 (SEO) — must be complete. This task assumes:
  - `astro.config.mjs` has `site: 'https://sam.music'` (placeholder domain set by KB-006)
  - `@astrojs/sitemap` integration is installed and configured
  - Structured data helpers use `Astro.site.href` for canonical URL resolution
  - `public/robots.txt` references `https://sam.music/sitemap-index.xml`

## Context to Read First

- `astro.config.mjs` — current adapter, integrations, and `site` configuration
- `package.json` — current dependencies (confirm `@astrojs/cloudflare` is installed)
- `.env.example` — existing env vars to extend
- `docs/initial-research.md` — Section 5 (audio hosting: R2 pricing, CDN, S3-compatible) and Section 6 (recommended tech stack)
- `docs/implementation-plan.md` — tech stack table and KB-008 entry
- `public/robots.txt` — contains placeholder domain that deployment guide must address

## File Scope

### New Files

- `wrangler.toml` — Cloudflare Pages + R2 configuration for local dev and deployment
- `docs/deployment.md` — step-by-step deployment guide

### Modified Files

- `astro.config.mjs` — verify/adjust Cloudflare adapter config, update `site` to use env-aware production URL
- `.env.example` — add deployment-related environment variables with documentation

## Steps

### Step 0: Preflight

- [ ] `~/dev/sam` is a git repository with KB-002, KB-003, and KB-006 completed
- [ ] `astro.config.mjs` exists with `@astrojs/cloudflare` adapter and `site` property
- [ ] `package.json` has `@astrojs/cloudflare` in dependencies
- [ ] `.env.example` exists with `R2_PUBLIC_URL`
- [ ] `npm run build` succeeds with zero errors

### Step 1: Create `wrangler.toml`

- [ ] Create `wrangler.toml` at project root with:
  ```toml
  name = "sam-music"
  compatibility_date = "2026-05-19"
  pages_build_output_dir = "./dist"

  # R2 bucket binding for server-side access (optional, for future use)
  # Audio files are served via R2 public URL (client-side), not through bindings
  # [[r2_buckets]]
  # binding = "AUDIO_BUCKET"
  # bucket_name = "sam-audio"

  [vars]
  # Environment variables set here are available in Cloudflare Pages Functions
  # R2_PUBLIC_URL should be set via Cloudflare dashboard (not committed)
  ```
- [ ] Verify `npm run build` still succeeds with `wrangler.toml` present
- [ ] Verify `wrangler pages dev dist --r2 sam-audio` can start (or document this in the deployment guide if Wrangler is not installed globally)

**Artifacts:**
- `wrangler.toml` (new)

### Step 2: Update `astro.config.mjs` for Production Deployment

- [ ] Read the current `astro.config.mjs` to understand the existing configuration
- [ ] Verify the Cloudflare adapter is configured with `output: 'server'` and `adapter: cloudflare()` — if not present, add it (but KB-002 should have set this up)
- [ ] Update the `site` property to use a clear placeholder that the deployment guide explains how to customize: `site: process.env.SITE_URL || 'https://sam.music'` — this allows overriding via env var during builds while keeping a sensible default. The `SITE_URL` env var is set in the Cloudflare Pages dashboard (documented in deployment guide).
- [ ] Verify `@astrojs/sitemap` integration is still in the integrations array (added by KB-006)
- [ ] Ensure the build output directory is `dist/` (Astro's default, which Cloudflare Pages expects)
- [ ] Run `npm run build` — succeeds with zero errors, produces `dist/` with `sitemap-index.xml`

**Artifacts:**
- `astro.config.mjs` (modified)

### Step 3: Update `.env.example`

- [ ] Add the following deployment-related environment variables to `.env.example`, preserving existing entries:
  ```
  # === Deployment (Cloudflare Pages + R2) ===

  # Public URL where audio files are served
  # Local dev with Wrangler: http://localhost:8788/r2
  # Production: your R2 bucket's public access URL (e.g., https://pub-xxxx.r2.dev)
  R2_PUBLIC_URL=http://localhost:8788/r2

  # Site URL used for canonical tags, sitemap, and structured data
  # Production: your actual domain (e.g., https://sam.music)
  SITE_URL=https://sam.music
  ```
- [ ] Ensure existing entries are preserved and not duplicated — if `R2_PUBLIC_URL` was already present (from KB-002), update its comment to be more descriptive and move it under the Deployment section

**Artifacts:**
- `.env.example` (modified)

### Step 4: Write `docs/deployment.md`

- [ ] Create `docs/deployment.md` with the following sections, written as a step-by-step guide a developer can follow from scratch:

  **1. Prerequisites**
  - Cloudflare account (free tier is sufficient)
  - Domain name (optional — `pages.dev` subdomain works for testing)
  - Wrangler CLI installed: `npm install -g wrangler` or `npx wrangler`
  - Node.js ≥ 18

  **2. R2 Bucket Setup**
  - Log into Cloudflare Dashboard → R2 Object Storage
  - Create a new bucket named `sam-audio` (or your preferred name)
  - Enable public access:
    - Go to bucket Settings → Public access
    - Enable "Allow public access" and note the generated public URL (format: `https://pub-<hash>.r2.dev`)
    - This URL becomes your `R2_PUBLIC_URL` in production
  - Upload audio files:
    - Use Wrangler: `npx wrangler r2 object put sam-audio/releases/midnight-sessions/01-track.mp3 --file ./local-audio/01-track.mp3`
    - Or use the Cloudflare Dashboard upload UI
    - Recommended folder structure: `releases/{slug}/{track-number}-{track-slug}.mp3`
    - Supported formats: MP3 (primary), OGG (fallback for howler.js)
  - Verify: open the public URL + file path in a browser, confirm audio plays

  **3. Cloudflare Pages Project**
  - Connect to git repository:
    - Cloudflare Dashboard → Pages → Create a project → "Connect to Git"
    - Select the repository (GitHub/GitLab)
    - Or use direct upload: `npx wrangler pages deploy dist --project-name sam-music`
  - Build settings:
    - Framework preset: `Astro`
    - Build command: `npm run build`
    - Build output directory: `dist`
    - Root directory: `/` (default)
    - Node.js version: `18` (or `20`)
  - Environment variables (set in Pages → Settings → Environment variables):
    - `R2_PUBLIC_URL` = your R2 public URL from step 2 (e.g., `https://pub-xxxx.r2.dev`)
    - `SITE_URL` = your production domain (e.g., `https://sam.music`)
    - `NODE_VERSION` = `18`

  **4. DNS Configuration (Custom Domain)**
  - In Cloudflare Pages → your project → Custom domains → "Set up a custom domain"
  - Enter your domain (e.g., `sam.music`)
  - Cloudflare will provide a CNAME target (e.g., `sam-music.pages.dev`)
  - If your domain is on Cloudflare:
    - DNS record is added automatically
  - If your domain is elsewhere:
    - Add a CNAME record: `@ → sam-music.pages.dev` (apex domain, if registrar supports CNAME flattening)
    - Add a CNAME record: `www → sam-music.pages.dev`
    - Wait for DNS propagation (usually <5 minutes on Cloudflare, up to 48 hours elsewhere)
  - Update `public/robots.txt` Sitemap URL to match your production domain
  - SSL is handled automatically by Cloudflare

  **5. Local Development with R2**
  - Install Wrangler: `npm install -D wrangler` (or use `npx wrangler`)
  - Create a local R2 bucket: `npx wrangler r2 bucket create sam-audio --local`
  - Upload test audio: `npx wrangler r2 object put sam-audio/test.mp3 --file ./test-audio.mp3 --local`
  - Run the Astro dev server with R2 emulation: `npx wrangler pages dev -- npm run dev`
    - This starts a local Cloudflare Pages emulator with R2 available at `http://localhost:8788/r2`
    - The `R2_PUBLIC_URL=http://localhost:8788/r2` in `.env` makes audio files accessible
  - Alternatively, for simpler dev without R2: `npm run dev` (audio player will show errors for missing files, but the site works)

  **6. Deployment Checklist**
  - [ ] R2 bucket created with public access enabled
  - [ ] Audio files uploaded to R2 in the expected folder structure
  - [ ] Pages project created and linked to git repository
  - [ ] Environment variables set: `R2_PUBLIC_URL`, `SITE_URL`
  - [ ] Custom domain configured (if applicable)
  - [ ] `public/robots.txt` Sitemap URL matches production domain
  - [ ] `SITE_URL` in Pages env vars matches production domain
  - [ ] First deploy succeeds and site loads at production URL
  - [ ] Audio player loads and plays a track from R2
  - [ ] Sitemap accessible at `/sitemap-index.xml` and lists all pages with correct domain
  - [ ] Structured data (JSON-LD) uses correct production URLs
  - [ ] Open Graph / Twitter Card images resolve correctly

  **7. Ongoing: Adding New Audio Files**
  - Upload MP3 and OGG files to R2: `npx wrangler r2 object put sam-audio/releases/{slug}/{filename}.mp3 --file ./local-file.mp3`
  - Add release content in `src/content/releases/{slug}.md` (following existing frontmatter schema)
  - Reference audio files in frontmatter `tracks[].audioFile` as relative paths (e.g., `releases/midnight-sessions/01-track.mp3`)
  - Git push triggers automatic redeployment via Cloudflare Pages

  **8. Costs and Limits**
  - Cloudflare Pages: free for unlimited requests, 500 builds/month
  - R2: 10 GB storage free, no egress fees (sufficient for ~100-200 MP3s)
  - Domain: ~$12/year (if using custom domain)
  - Total hosting cost: $0/month (free tier) + domain registration

**Artifacts:**
- `docs/deployment.md` (new)

### Step 5: Testing & Verification

> ZERO test failures allowed. Full test suite as quality gate.

- [ ] Run `npm run build` — succeeds with zero errors
- [ ] Verify `dist/` contains the expected output: `index.html`, `releases/`, `sitemap-index.xml`, `robots.txt`
- [ ] Verify `wrangler.toml` parses correctly: `npx wrangler pages deploy dist --dry-run --project-name sam-music` (dry-run validates config without deploying)
- [ ] Run full test suite (`npx vitest run`) — all existing tests still pass
- [ ] Verify no hardcoded production URLs in source code (except `public/robots.txt` and default fallbacks in `astro.config.mjs`) — all URLs should derive from `SITE_URL` env var or `Astro.site`

### Step 6: Documentation & Delivery

- [ ] Update `README.md` — add a "Deployment" section linking to `docs/deployment.md` with a one-line summary
- [ ] Verify `docs/deployment.md` is complete, accurate, and follows the section structure from Step 4
- [ ] Verify all files in File Scope exist and contain expected content
- [ ] Commit with message: `feat(KB-008): add Cloudflare Pages + R2 deployment configuration and guide`
- [ ] Out-of-scope findings created as new tasks via `task_create` tool (if any)

## Documentation Requirements

**Must Update:**
- `docs/deployment.md` — new file, comprehensive deployment guide (primary deliverable)
- `README.md` — add "Deployment" section with link to `docs/deployment.md`
- `.env.example` — add `SITE_URL` and improve `R2_PUBLIC_URL` documentation

**Check If Affected:**
- `public/robots.txt` — deployment guide explains when to update the Sitemap URL to the production domain
- `astro.config.mjs` — modified to use `SITE_URL` env var for the `site` property

## Completion Criteria

- [ ] `wrangler.toml` exists at project root with valid Cloudflare Pages configuration
- [ ] `astro.config.mjs` uses `process.env.SITE_URL || 'https://sam.music'` for the `site` property
- [ ] `@astrojs/cloudflare` adapter is configured with `output: 'server'`
- [ ] `.env.example` documents both `R2_PUBLIC_URL` and `SITE_URL` with clear comments
- [ ] `docs/deployment.md` covers all 8 sections: Prerequisites, R2 Setup, Pages Project, DNS, Local Dev, Deployment Checklist, Adding Audio Files, Costs
- [ ] `npm run build` succeeds with zero errors
- [ ] `dist/sitemap-index.xml` is generated and lists all pages
- [ ] Full test suite passes (`npx vitest run`)
- [ ] `README.md` links to the deployment guide

## Git Commit Convention

Commits at step boundaries. All commits include the task ID:

- **Step completion:** `feat(KB-008): complete Step N — description`
- **Bug fixes:** `fix(KB-008): description`
- **Config:** `chore(KB-008): description`

## Do NOT

- Actually deploy to Cloudflare (this task creates the configuration and guide only)
- Create R2 buckets or upload files (documented in the guide for manual execution)
- Modify `src/components/`, `src/pages/`, or `src/content/` — those are owned by KB-003, KB-004, KB-005
- Remove or change the Cloudflare adapter configuration added by KB-002 (only verify and extend it)
- Remove `@astrojs/sitemap` integration added by KB-006
- Hardcode production URLs in source code — use `SITE_URL` env var or `Astro.site`
- Set up CI/CD pipelines beyond Cloudflare Pages' built-in git integration (no GitHub Actions, etc.)
- Configure Cloudflare Workers, KV, or D1 (out of scope)
- Modify `docs/initial-research.md` or `docs/implementation-plan.md`
- Install new runtime dependencies — `wrangler` should be a devDependency only if needed
- Create a `Dockerfile` or any containerization
