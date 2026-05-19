# Task: KB-004 - Track & Release Listing Pages

**Created:** 2026-05-19
**Size:** M

## Review Level: 1 (Plan Only)

**Assessment:** This task builds pages and components on top of the scaffolded project. The content schema, page routes, and component interfaces are all well-defined upfront. Risk is low since it's primarily rendering read-only data from content collections.
**Score:** 3/8 — Blast radius: 1, Pattern novelty: 1, Security: 0, Reversibility: 1

## Mission

Create release listing and detail pages that display all of Sam's music releases (albums, EPs, singles) as a responsive album art grid grouped by release type. Each release gets a detail page with full track listing and streaming platform links (Spotify, Apple Music, YouTube Music, Bandcamp). These pages are the primary way visitors discover and navigate Sam's music catalog.

## Dependencies

- **Task:** KB-002 (Project Scaffolding — Astro project must exist with `src/content/config.ts`, `BaseLayout.astro`, Tailwind v4, and a working dev server)

## Context to Read First

- `src/content/config.ts` — existing placeholder `releases` collection schema from KB-002
- `src/layouts/BaseLayout.astro` — layout to wrap all pages
- `src/styles/global.css` — Tailwind v4 theme colors (`--color-bg`, `--color-text`, `--color-accent`)
- `astro.config.mjs` — project configuration (Astro 5, `output: 'server'`)
- `docs/initial-research.md` — Section 3 (design trends: large album art, dark mode, minimal typography)

## File Scope

- `src/content/config.ts` (modified — expand releases schema)
- `src/content/releases/*.md` (new — sample release content files)
- `src/pages/releases/index.astro` (new — release listing page)
- `src/pages/releases/[slug].astro` (new — individual release detail page)
- `src/components/ReleaseCard.astro` (new — album art card component)
- `src/components/StreamingLinks.astro` (new — streaming platform links)
- `src/components/TrackList.astro` (new — track listing with durations)
- `src/layouts/ReleasesLayout.astro` (new — shared layout for release pages)

## Steps

### Step 0: Preflight

- [ ] KB-002 is complete: `package.json`, `astro.config.mjs`, `src/layouts/BaseLayout.astro`, `src/content/config.ts` all exist
- [ ] `npm run dev` starts without errors
- [ ] `src/content/` directory exists

### Step 1: Expand Content Collection Schema

- [ ] Modify `src/content/config.ts` to finalize the `releases` collection schema. Replace the placeholder with a complete schema using Astro 5's `glob()` loader and `z` from `astro:content`:
  ```ts
  // Loader: glob({ pattern: '**/*.md', base: './src/content/releases' })
  // Schema fields:
  //   title: z.string() — release title (e.g. "Midnight Sessions")
  //   artist: z.string() — artist name (defaults to "Sam" but allows collabs)
  //   releaseDate: z.date() — release date parsed from frontmatter string
  //   type: z.enum(['album', 'ep', 'single']) — release category
  //   artwork: z.string() — path to album art image (relative to /images/ or full URL)
  //   description: z.string().optional() — short blurb about the release
  //   tracks: z.array(z.object({
  //     title: z.string(),
  //     duration: z.string(),  // "3:42" format
  //     spotifyUrl: z.string().url().optional(),
  //     appleMusicUrl: z.string().url().optional(),
  //     youtubeMusicUrl: z.string().url().optional(),
  //     bandcampUrl: z.string().url().optional(),
  //     audioFile: z.string().optional(),  // path in R2, used by KB-003 audio player
  //   }))
  //   streamingLinks: z.object({
  //     spotify: z.string().url().optional(),
  //     appleMusic: z.string().url().optional(),
  //     youtubeMusic: z.string().url().optional(),
  //     bandcamp: z.string().url().optional(),
  //   }).optional()
  ```
- [ ] Verify the schema by running `npx astro check` — must pass with zero type errors in `config.ts`

**Artifacts:**
- `src/content/config.ts` (modified)

### Step 2: Create Sample Release Content

- [ ] Create `src/content/releases/` directory with 4 sample Markdown files. Use realistic but fictional data. File names become slugs:
  - `midnight-sessions.md` — type: `album`, 6 tracks, all streaming links, artwork path
  - `echoes-ep.md` — type: `ep`, 4 tracks, some streaming links
  - `neon-lights.md` — type: `single`, 1 track, all streaming links
  - `gravity.md` — type: `single`, 1 track, minimal streaming links
- [ ] Each file's frontmatter must conform exactly to the schema from Step 1. Dates use `YYYY-MM-DD` format (Astro auto-parses to `Date`).
- [ ] The Markdown body of each file can contain a longer description/notes section (optional, rendered on detail page).
- [ ] Place placeholder artwork images in `public/images/releases/` — use solid-color SVG placeholders (e.g. 600x600 SVG with release title text). Name them to match: `midnight-sessions.svg`, `echoes-ep.svg`, `neon-lights.svg`, `gravity.svg`.
- [ ] Run `npx astro check` to confirm all content validates against the schema

**Artifacts:**
- `src/content/releases/midnight-sessions.md` (new)
- `src/content/releases/echoes-ep.md` (new)
- `src/content/releases/neon-lights.md` (new)
- `src/content/releases/gravity.md` (new)
- `public/images/releases/*.svg` (new — placeholder artwork)

### Step 3: Build Components

- [ ] Create `src/components/ReleaseCard.astro`:
  - Props: `release` (full release collection entry), `showType?: boolean` (default true)
  - Renders a card with: album art image (fill the card, use `object-cover`), release title, artist name, release date (formatted), and type badge (e.g. "ALBUM", "EP", "SINGLE")
  - Card links to `/releases/{slug}`
  - Hover effect: slight scale transform (1.02) and subtle shadow increase via Tailwind transition classes
  - Dark mode compatible: card background slightly lighter than page bg (`bg-white/5` or similar)
- [ ] Create `src/components/StreamingLinks.astro`:
  - Props: `links` — object with optional `spotify`, `appleMusic`, `youtubeMusic`, `bandcamp` URLs
  - Renders a horizontal list of "Listen on {Platform}" links with platform icons (use inline SVG icons — no external dependency)
  - Each link opens in new tab (`target="_blank"`, `rel="noopener noreferrer"`)
  - Use brand-adjacent colors on hover (Spotify green, Apple Music red/pink, YouTube red, Bandcamp teal)
  - If a platform URL is missing, that link is simply not rendered
- [ ] Create `src/components/TrackList.astro`:
  - Props: `tracks` — array of `{ title, duration, spotifyUrl?, appleMusicUrl?, ... }`
  - Renders an ordered list with track number, title, duration (right-aligned)
  - Each track row is hoverable — on hover, show a small "play" icon on the left (where the track number was) to indicate clickability. Note: actual playback is KB-003's responsibility; for now, rows are non-interactive but visually ready
  - Alternate row background (`even:bg-white/5`) for readability
  - If a track has streaming URLs, show a small external link icon on the right side of the row
- [ ] All components use TypeScript props via `Astro.props` with proper type annotations

**Artifacts:**
- `src/components/ReleaseCard.astro` (new)
- `src/components/StreamingLinks.astro` (new)
- `src/components/TrackList.astro` (new)

### Step 4: Release Listing Page

- [ ] Create `src/layouts/ReleasesLayout.astro` extending `BaseLayout.astro`:
  - Adds a page title section and consistent padding for release pages
  - Includes a breadcrumb-like nav: "Sam / Releases"
- [ ] Create `src/pages/releases/index.astro`:
  - Import all releases from content collection: `getCollection('releases')`
  - Sort releases by `releaseDate` descending (newest first)
  - Group into three sections: Albums, EPs, Singles (each rendered as an `<h2>` heading + grid)
  - Use `ReleaseCard` component in a responsive grid: 1 col mobile, 2 cols `md:`, 3 cols `lg:`, 4 cols `xl:`
  - If a group is empty (e.g. no EPs), skip that section entirely
  - Page title: "Releases" with `<title>Sam — Releases</title>`
- [ ] Verify the page renders at `/releases` with all 4 sample releases appearing in correct groups

**Artifacts:**
- `src/layouts/ReleasesLayout.astro` (new)
- `src/pages/releases/index.astro` (new)

### Step 5: Release Detail Page

- [ ] Create `src/pages/releases/[slug].astro`:
  - Use `getCollection('releases')` then find entry matching `Astro.params.slug`
  - If no match, `return Astro.redirect('/releases')` (not a 404 — gracefully redirect to listing)
  - Generate `getStaticPaths`-style slugs — actually since `output: 'server'`, use dynamic route directly without `getStaticPaths`
  - Page layout:
    - Hero section: large album art (max 400x400 on mobile, 500x500 on desktop) centered or left-aligned with release metadata on the right
    - Release metadata: title (`<h1>`), artist, release date (formatted nicely, e.g. "May 19, 2026"), type badge
    - Description paragraph (from frontmatter or Markdown body)
    - `StreamingLinks` component with the release-level streaming links
    - `TrackList` component with all tracks
    - If release-level streaming links exist, show `StreamingLinks` above the track list; if individual tracks have streaming links, those appear per-row in `TrackList`
  - Page `<title>`: "Sam — {release title}"
  - Add `export async function GET({ params })` that returns all valid slugs — actually for server output, just handle the slug dynamically
- [ ] Verify `/releases/midnight-sessions` renders with all tracks and streaming links
- [ ] Verify `/releases/nonexistent` redirects to `/releases`

**Artifacts:**
- `src/pages/releases/[slug].astro` (new)

### Step 6: Testing & Verification

> ZERO test failures allowed. Full test suite as quality gate.

- [ ] Set up Vitest if not already configured: install `vitest` and `@astrojs/testing` (or `vitest` alone for Astro 5), add `test` script to `package.json` (`"test": "vitest run"`)
- [ ] Create `tests/releases/content.test.ts`:
  - Test that all 4 sample releases parse correctly against the schema (import via `getCollection` or directly parse frontmatter)
  - Test that each release has required fields (title, artist, releaseDate, type, artwork, tracks with at least one track)
  - Test that slugs are URL-safe (lowercase, hyphens only, no spaces)
- [ ] Create `tests/releases/pages.test.ts`:
  - Test that the releases listing page renders without errors (use Astro's `render()` or fetch the `/releases` route)
  - Test that individual release pages render for each valid slug
  - Test that invalid slugs redirect to `/releases`
- [ ] Run `npm run build` — must succeed with exit code 0
- [ ] Run `npm run test` — all tests pass

**Artifacts:**
- `vitest.config.ts` (new, if not present)
- `tests/releases/content.test.ts` (new)
- `tests/releases/pages.test.ts` (new)

### Step 7: Documentation & Delivery

- [ ] Update `README.md` — add "Content Collections" section documenting the `releases` collection: frontmatter fields, file naming convention, how to add a new release
- [ ] Verify all files in File Scope exist with correct content
- [ ] Commit with message: `feat(KB-004): add release listing pages with content collections`
- [ ] Out-of-scope findings created as new tasks via `task_create` tool (if any)

## Documentation Requirements

**Must Update:**
- `README.md` — add Content Collections section describing the `releases` collection schema and how to add new releases

**Check If Affected:**
- `src/content/config.ts` — this file is directly modified, not just documentation

## Completion Criteria

- [ ] `src/content/config.ts` has complete `releases` schema with all fields (title, artist, releaseDate, type, artwork, description, tracks, streamingLinks)
- [ ] 4 sample release Markdown files exist in `src/content/releases/` and validate against the schema
- [ ] `/releases` page renders all releases grouped by type (Albums, EPs, Singles) in responsive grid
- [ ] `/releases/[slug]` renders individual release detail with artwork, metadata, track list, and streaming links
- [ ] Invalid slug gracefully redirects to `/releases`
- [ ] `ReleaseCard`, `StreamingLinks`, and `TrackList` components render correctly with proper TypeScript props
- [ ] Responsive grid: 1 col mobile, 2 col tablet, 3-4 col desktop
- [ ] All pages use `BaseLayout` (via `ReleasesLayout`)
- [ ] `npm run build` succeeds
- [ ] All tests pass (`npm run test`)
- [ ] No streaming platform link opens in the same tab (all use `target="_blank"`)

## Git Commit Convention

Commits at step boundaries. All commits include the task ID:

- **Step completion:** `feat(KB-004): complete Step N — description`
- **Bug fixes:** `fix(KB-004): description`
- **Tests:** `test(KB-004): description`

## Do NOT

- Build the audio player or integrate wavesurfer.js/howler.js (that's KB-003)
- Add SEO meta tags, Open Graph, or JSON-LD structured data (that's KB-006)
- Set up Cloudflare deployment or R2 configuration (that's KB-008)
- Add analytics tracking (that's KB-009)
- Modify the design system or global theme colors (that's KB-007)
- Create pages beyond releases (bio, about — that's KB-005)
- Install audio-related npm packages
- Modify `docs/initial-research.md`
- Add CMS integration or admin UI
- Make track rows trigger actual audio playback (just visual hover effects for now)
