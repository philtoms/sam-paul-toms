# Task: KB-001 - Implementation Plan from Research

**Created:** 2026-05-19
**Size:** M

## Review Level: 1 (Plan Only)

**Assessment:** This task only reads a document and creates kanban tasks via the `task_create` tool — no code is written or deployed. Low risk.
**Score:** 2/8 — Blast radius: 0, Pattern novelty: 0, Security: 0, Reversibility: 2

## Mission

Read `~/dev/sam/docs/initial-research.md` thoroughly and translate its recommendations (especially Sections 2 and 6) into a set of concrete, ordered kanban tasks. Each task must be specific enough for an autonomous developer to execute independently. The output of this task is the set of kanban cards themselves — no code is written.

## Dependencies

- **None**

## Context to Read First

- `~/dev/sam/docs/initial-research.md` — the full research report (Sections 1–7); this is the primary input

## File Scope

- `~/dev/sam/docs/implementation-plan.md` — a written summary document of the plan (created by this task)
- Kanban tasks created via the `task_create` tool

## Steps

### Step 0: Preflight

- [ ] `~/dev/sam/docs/initial-research.md` exists and is readable
- [ ] No existing kanban tasks duplicate what this task will create (check `task_list`)

### Step 1: Read and Analyze Research

- [ ] Read `~/dev/sam/docs/initial-research.md` in full
- [ ] Extract every actionable recommendation from Section 6 (tech stack and key features) and Section 2 (feature list — Must-Have, Should-Have, Nice-to-Have)
- [ ] Note the recommended stack: Astro, wavesurfer.js, howler.js, Cloudflare Pages + R2, Umami analytics

### Step 2: Create Kanban Tasks

Using `task_create`, create the following tasks. Each task description must include: goal, specific deliverables, tech details from the research, and dependency references. Use the working directory `~/dev/sam` for all tasks and `~/dev/sam/docs` for documentation output.

Create them in this order (so IDs are sequential), with the noted dependencies:

#### 1. Project Scaffolding — `KB-002`
- **Goal:** Initialize an Astro project in `~/dev/sam` with the directory structure, base config, Tailwind CSS, and developer tooling (linting, formatting).
- **Details from research:** Astro framework (islands architecture, minimal JS). Directory layout: `src/layouts/`, `src/components/`, `src/pages/`, `src/styles/`, `src/content/` (for Markdown content collections — releases, bio). `astro.config.mjs` with Cloudflare adapter preset. Tailwind CSS v4 for styling. Dark mode via `prefers-color-scheme` + toggle. TypeScript strict.
- **Deliverables:** `package.json`, `astro.config.mjs`, `tsconfig.json`, `tailwind.config.ts`, base layout component, `public/` directory, `.gitignore`, README.
- **Dependencies:** None.
- **Size:** M

#### 2. Audio Player Component — `KB-003`
- **Goal:** Build a persistent sticky-bottom audio player bar that continues playing across Astro page navigations using View Transitions.
- **Details from research:** wavesurfer.js v7 for waveform visualization. howler.js as the cross-browser audio engine (format fallback MP3/OGG, Web Audio API). Playlist support: play/pause, next/prev, progress bar, volume, track title + artist display. The player must be an Astro island (client-side JS component) that persists via View Transitions `transition:persist`. Audio files served from Cloudflare R2 (URLs configured via env variable).
- **Deliverables:** `src/components/AudioPlayer/` — player component, playlist store, waveform renderer, howler wrapper. CSS for sticky bottom bar. Player-reactive state that survives page transitions.
- **Dependencies:** KB-002 (project scaffolding must exist).
- **Size:** L

#### 3. Track & Release Listing Pages — `KB-004`
- **Goal:** Create pages that list all releases (albums, EPs, singles) with album art grid, grouped by release type, with streaming platform links per track.
- **Details from research:** Content collections in Astro (`src/content/releases/`) using Markdown frontmatter for metadata (title, artist, release date, type, tracks list, album art path, streaming links). Grid layout with large album art thumbnails (per Section 3 design trends). Individual release pages (`/releases/[slug]`) with track listing, "Listen on Spotify / Apple Music / YouTube Music / Bandcamp" links. Responsive grid — 1 col mobile, 2 col tablet, 3-4 col desktop.
- **Deliverables:** `src/content/config.ts` (release schema), sample release content, `src/pages/releases/index.astro`, `src/pages/releases/[slug].astro`, `src/components/ReleaseCard.astro`, `src/components/StreamingLinks.astro`, `src/components/TrackList.astro`.
- **Dependencies:** KB-002 (scaffolding).
- **Size:** M

#### 4. Artist Bio / About Page — `KB-005`
- **Goal:** Build an about/bio page with photo, bio text, genre tags, press quotes, and a contact form.
- **Details from research:** Content-driven page using Astro content collections or a single Markdown file (`src/content/about.md`) with frontmatter for genre tags and press quotes. Responsive layout: hero photo + bio text on larger screens, stacked on mobile. Contact form that submits to a Cloudflare Worker or third-party service (e.g., Formspree, Resend). Genre tags as styled badges. Press quotes in a blockquote carousel or grid.
- **Deliverables:** `src/pages/about.astro`, `src/components/BioSection.astro`, `src/components/GenreTags.astro`, `src/components/PressQuotes.astro`, `src/components/ContactForm.astro`, sample about content.
- **Dependencies:** KB-002 (scaffolding).
- **Size:** M

#### 5. SEO & Meta Tags — `KB-006`
- **Goal:** Implement per-page SEO: Open Graph tags, Twitter Cards, MusicRecording structured data (JSON-LD), sitemap, and canonical URLs.
- **Details from research:** Per-page `<title>` and `<meta name="description">`. Open Graph `og:title`, `og:description`, `og:image` (album art or artist photo), `og:type=music.song` or `music.album`. Twitter Card `summary_large_image`. JSON-LD `MusicRecording` and `MusicAlbum` schema on release pages. Astro `@astrojs/sitemap` integration. Robots.txt. Every release page gets unique structured data.
- **Deliverables:** `src/components/SEOHead.astro` (reusable head component), JSON-LD templates, `astro.config.mjs` updated with sitemap integration, `public/robots.txt`.
- **Dependencies:** KB-002 (scaffolding), KB-004 (release pages — needed to know the page structure for structured data).
- **Size:** S

#### 6. Dark Mode, Responsive, Minimal Design System — `KB-007`
- **Goal:** Establish the visual design system: dark mode default, responsive breakpoints, typography scale, spacing, and micro-animations.
- **Details from research:** Dark mode by default (per Section 3 trends). Minimal typography — one display font + one body font (variable fonts). Large album art as visual anchor. Micro-animations on hover (play button morphs, album art slight zoom). Tailwind CSS utilities for spacing and responsive design. Color palette: near-black backgrounds, off-white text, one accent color. Mobile-first breakpoints. Touch-friendly player controls (per Section 2, Must-Have #4).
- **Deliverables:** `tailwind.config.ts` (theme customization — colors, fonts, spacing), `src/styles/global.css` (base styles, dark mode, animations), updated base layout applying design tokens.
- **Dependencies:** KB-002 (scaffolding).
- **Size:** M

#### 7. Cloudflare Pages + R2 Deployment — `KB-008`
- **Goal:** Set up deployment pipeline: Cloudflare Pages for the Astro site, Cloudflare R2 bucket for audio files, and CI/CD configuration.
- **Details from research:** Astro Cloudflare adapter (`@astrojs/cloudflare`). `wrangler.toml` for Pages config. R2 bucket for audio hosting (free tier: 10 GB storage, free egress). Environment variables for R2 public URL. Build command: `npm run build`. Output directory: `dist/`. DNS setup instructions (not automated — documented steps). 
- **Deliverables:** `wrangler.toml`, updated `astro.config.mjs` with Cloudflare adapter, `docs/deployment.md` with step-by-step setup guide (R2 bucket creation, Pages project linking, DNS config, environment variables), `.env.example`.
- **Dependencies:** KB-002 (scaffolding), KB-003 (audio player — needs R2 URL config), KB-006 (SEO — needs production URL for canonical tags).
- **Size:** M

#### 8. Analytics (Umami Self-Hosted) — `KB-009`
- **Goal:** Integrate Umami analytics tracking into the site.
- **Details from research:** Umami is self-hosted, free, open-source, privacy-friendly (per Section 2 Nice-to-Have #13). Add Umami tracking script to the base layout. Configuration via environment variables (UMAMI_WEBSITE_ID, UMAMI_SRC). Document the Umami self-hosting setup (Docker compose on the user's Linux server) in a separate doc.
- **Deliverables:** Umami script integration in base layout (conditional on env vars), `docs/analytics-setup.md` with Umami Docker hosting instructions, `.env.example` updated with Umami vars.
- **Dependencies:** KB-002 (scaffolding).
- **Size:** S

### Step 3: Write Plan Summary Document

- [ ] Write `~/dev/sam/docs/implementation-plan.md` that summarizes all created tasks, their IDs, dependencies, and the overall implementation sequence
- [ ] Include a dependency graph (text-based, e.g., ASCII or Mermaid)
- [ ] Include the recommended implementation order

**Artifacts:**
- `~/dev/sam/docs/implementation-plan.md` (new)

### Step 4: Verification

- [ ] Run `task_list` and confirm all 8 tasks (KB-002 through KB-009) are created
- [ ] Confirm each task has a clear description, deliverables list, and dependency references
- [ ] Confirm the dependency chain is valid (no circular deps, scaffolding has no deps, deployment depends on core features)
- [ ] Confirm `~/dev/sam/docs/implementation-plan.md` exists and accurately reflects all created tasks

## Documentation Requirements

**Must Update:**
- `~/dev/sam/docs/implementation-plan.md` — the primary output of this task; full plan summary with task IDs, dependencies, and implementation order

**Check If Affected:**
- N/A (no other docs exist yet)

## Completion Criteria

- [ ] All 8 kanban tasks (KB-002 through KB-009) created via `task_create`
- [ ] Each task description includes: goal, deliverables, tech details from research, dependencies
- [ ] `~/dev/sam/docs/implementation-plan.md` written with dependency graph and implementation order
- [ ] Dependency chain is acyclic and logical (scaffolding → components → integration → deployment)

## Git Commit Convention

Commits at step boundaries. All commits include the task ID:

- **Step completion:** `docs(KB-001): complete Step N — description`
- **Bug fixes:** `fix(KB-001): description`

## Do NOT

- Write any application code (this is a planning task only)
- Create tasks beyond the 8 listed above
- Skip creating the `implementation-plan.md` summary document
- Modify `initial-research.md`
- Implement features — only plan them
- Assign time estimates to tasks (size labels S/M/L are sufficient)
