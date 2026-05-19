# Task: KB-006 - Per-Page SEO, Structured Data & Sitemap

**Created:** 2026-05-19
**Size:** S

## Review Level: 1 (Plan Only)

**Assessment:** This task adds a reusable Astro component, static files, and an integration plugin — all well-understood patterns with no security or architectural risk. The primary complexity is correctly wiring structured data schemas to the content collection fields.
**Score:** 2/8 — Blast radius: 1, Pattern novelty: 0, Security: 0, Reversibility: 1

## Mission

Implement comprehensive per-page SEO for the music portfolio: a reusable `SEOHead.astro` component that generates unique `<title>`, `<meta name="description">`, Open Graph tags, Twitter Cards, and JSON-LD structured data (`MusicRecording` for tracks, `MusicAlbum` for releases) on every page. Additionally, add `@astrojs/sitemap` for automatic sitemap generation and a `robots.txt` allowing all crawlers. This ensures Sam's music is discoverable via search engines and renders rich previews when shared on social media.

## Dependencies

- **Task:** KB-002 (Project Scaffolding) — must be complete. This task assumes:
  - Astro 5 project exists with `astro.config.mjs`, `package.json`, `tsconfig.json`
  - `src/layouts/BaseLayout.astro` exists with a `<head>` section and a `<title>` prop
  - Tailwind CSS v4 configured via `@tailwindcss/vite`
  - `public/` directory exists
  - `npm run build` and `npm run dev` work
- **Task:** KB-004 (Track & Release Listing Pages) — must be complete. This task assumes:
  - `src/content/config.ts` has a finalized `releases` collection with schema fields: `title`, `artist`, `releaseDate`, `type` (album/ep/single), `artwork`, `description`, `tracks[]` (each with `title`, `duration`, `audioFile?`, streaming URLs), `streamingLinks` object
  - `src/pages/releases/index.astro` — release listing page exists
  - `src/pages/releases/[slug].astro` — individual release detail page exists, renders release data from content collection
  - `src/layouts/ReleasesLayout.astro` — shared layout for release pages
  - Sample release content exists in `src/content/releases/` (e.g. `midnight-sessions.md`, `echoes-ep.md`, `neon-lights.md`, `gravity.md`)
  - Placeholder artwork images exist in `public/images/releases/`

## Context to Read First

- `src/layouts/BaseLayout.astro` — current `<head>` implementation; SEOHead will integrate here
- `src/pages/releases/[slug].astro` — release detail page; primary consumer of structured data
- `src/pages/releases/index.astro` — listing page; needs its own OG tags
- `src/pages/index.astro` — homepage; needs its own OG tags
- `src/content/config.ts` — releases collection schema (source of truth for structured data field mapping)
- `astro.config.mjs` — current config where sitemap integration will be added
- `package.json` — current dependencies

## File Scope

### New Files

- `src/components/SEOHead.astro` — reusable `<head>` content component (meta tags, OG, Twitter Cards, JSON-LD)
- `src/scripts/structured-data.ts` — helper functions that produce `MusicRecording` and `MusicAlbum` JSON-LD objects
- `public/robots.txt` — crawler directives
- `tests/seo/SEOHead.test.ts` — unit tests for the SEOHead component output
- `tests/seo/structured-data.test.ts` — unit tests for JSON-LD helper functions

### Modified Files

- `astro.config.mjs` — add `@astrojs/sitemap` integration
- `package.json` — add `@astrojs/sitemap` dependency
- `src/layouts/BaseLayout.astro` — replace inline `<title>` with `SEOHead` component
- `src/pages/index.astro` — pass unique SEO props to SEOHead
- `src/pages/releases/index.astro` — pass unique SEO props to SEOHead
- `src/pages/releases/[slug].astro` — pass unique SEO props with structured data to SEOHead

## Steps

### Step 0: Preflight

- [ ] `astro.config.mjs`, `package.json`, `src/layouts/BaseLayout.astro` all exist (KB-002 complete)
- [ ] `src/pages/releases/[slug].astro` and `src/content/releases/*.md` exist (KB-004 complete)
- [ ] `npm run build` succeeds with zero errors

### Step 1: Create Structured Data Helpers

- [ ] Create `src/scripts/structured-data.ts` with two exported helper functions:

  **`generateMusicAlbumSchema(release: ReleaseData, siteUrl: string): object`**
  - Maps to `https://schema.org/MusicAlbum`
  - `siteUrl` is the base URL of the site (e.g. `https://sam.music`), passed from `Astro.site.href` in the calling page. Used to resolve relative artwork paths to absolute URLs and construct canonical page URLs.
  - Fields: `@context: "https://schema.org"`, `@type: "MusicAlbum"`, `name` (release title), `byArtist: { @type: "MusicGroup", name: artist }`, `datePublished` (releaseDate as ISO string), `image` (artwork resolved to absolute via `resolveAbsoluteUrl(release.artwork, siteUrl)`), `albumReleaseType` (map `album` → `AlbumRelease`, `ep` → `EPRelease`, `single` → `SingleRelease` — use schema.org `MusicAlbumReleaseType` enumeration), `numTracks` (tracks.length), `track` (array of `MusicRecording` objects, one per track, each with `@type`, `name`, `duration` — convert "3:42" format to ISO 8601 duration `PT3M42S` via `durationToISO8601`)
  - `description` if available from the release frontmatter

  **`generateMusicRecordingSchema(track: TrackData, release: ReleaseData, siteUrl: string, slug: string): object`**
  - Maps to `https://schema.org/MusicRecording`
  - `siteUrl` is the base URL of the site. `slug` is the release slug used to construct the track's page URL.
  - Fields: `@context: "https://schema.org"`, `@type: "MusicRecording"`, `name` (track title), `byArtist: { @type: "MusicGroup", name: artist }`, `duration` (ISO 8601 format), `inAlbum: { @type: "MusicAlbum", name: release title }`, `url` (`${siteUrl}releases/${slug}`)
  - `image` from release artwork, resolved to absolute via `resolveAbsoluteUrl(release.artwork, siteUrl)`

  **Helper: `durationToISO8601(duration: string): string`**
  - Convert `"3:42"` → `"PT3M42S"`, `"1:05"` → `"PT1M5S"`, `"10:00"` → `"PT10M0S"`
  - Handle edge cases: `":42"` → `"PT0M42S"`, `"3:"` → `"PT3M0S"`, `"0:00"` → `"PT0M0S"`

  **Helper: `resolveAbsoluteUrl(path: string, siteUrl: string): string`**
  - If path starts with `http` → return as-is
  - Otherwise → `${siteUrl}${path.startsWith('/') ? '' : '/'}${path}`

- [ ] Write `tests/seo/structured-data.test.ts`:
  - Test `durationToISO8601`: "3:42" → "PT3M42S", "1:05" → "PT1M5S", "0:00" → "PT0M0S", "10:30" → "PT10M30S"
  - Test `resolveAbsoluteUrl`: relative path becomes absolute, already-absolute is unchanged, path without leading slash gets one added
  - Test `generateMusicAlbumSchema`: returns valid JSON-LD with correct `@type`, all required fields present, tracks array has correct length, dates are ISO format, image is absolute URL using provided `siteUrl`, `albumReleaseType` maps correctly (`album` → `AlbumRelease`, `ep` → `EPRelease`, `single` → `SingleRelease`)
  - Test `generateMusicRecordingSchema`: returns valid JSON-LD with `@type: "MusicRecording"`, `inAlbum` references correct album name, duration is ISO 8601, `url` is constructed correctly from `siteUrl` + `slug`
- [ ] Run targeted tests: `npx vitest run tests/seo/structured-data.test.ts` — all pass

**Artifacts:**
- `src/scripts/structured-data.ts` (new)
- `tests/seo/structured-data.test.ts` (new)

### Step 2: Create SEOHead Component

- [ ] Create `src/components/SEOHead.astro` accepting these props via `Astro.props`:
  ```ts
  interface SEOProps {
    title: string;              // Page title (e.g. "Sam — Midnight Sessions")
    description: string;        // Meta description (max ~160 chars)
    image?: string;             // OG/Twitter image URL (absolute or relative path)
    canonicalUrl?: string;      // Canonical URL override (defaults to Astro.url)
    type?: 'website' | 'music.song' | 'music.album' | 'music.playlist';  // og:type, default 'website'
    structuredData?: object | object[];  // JSON-LD object(s) to inject
    noindex?: boolean;          // If true, add <meta name="robots" content="noindex">
  }
  ```
- [ ] The component renders the following into `<head>`:
  - `<title>{title}</title>`
  - `<meta name="description" content={description} />`
  - `<link rel="canonical" href={canonicalUrl || Astro.url.href} />`
  - Open Graph tags: `og:title`, `og:description`, `og:url` (canonical), `og:type`, `og:image` (resolve to absolute URL using `resolveAbsoluteUrl`), `og:site_name` → "Sam"
  - `og:image:width` and `og:image:height` — set to `1200` and `630` if an image is provided (standard OG image dimensions). Note: KB-004's placeholder artwork is 600×600 SVG; these dimensions serve as the intended OG crop size for when real album art images are added. The attributes are informational hints for social platforms.
  - Twitter Card tags: `twitter:card` → `summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`
  - If `structuredData` is provided, render `<script type="application/ld+json">{JSON.stringify(structuredData)}</script>` — if it's an array, render one `<script>` per item; if a single object, render one `<script>`
  - If `noindex` is true: `<meta name="robots" content="noindex, nofollow" />`
- [ ] The component does NOT render `<html>`, `<head>`, or `<body>` tags — it only renders `<title>`, `<meta>`, `<link>`, and `<script>` elements that go inside `<head>`. It is used as a fragment inside `BaseLayout.astro`'s `<head>`.
- [ ] Write `tests/seo/SEOHead.test.ts` (note: testing `.astro` components requires Astro's test utilities. If KB-004 already set up `@astrojs/testing` or similar, use that. Otherwise, an alternative approach is to test the rendered HTML string from `npm run build` output, or test the logic by extracting the tag-generation into a pure TypeScript helper that `SEOHead.astro` calls, and testing the helper directly):
  - Test that with basic props (title, description), the component (or helper) produces `<title>`, `<meta name="description">`, and `<link rel="canonical">`
  - Test that OG tags are rendered with correct values
  - Test that Twitter Card tags are rendered with `summary_large_image`
  - Test that when `structuredData` is provided, a `<script type="application/ld+json">` is rendered with the JSON content
  - Test that `noindex: true` adds the robots meta tag
  - Test that `image` prop resolves relative URLs to absolute
- [ ] Run targeted tests: `npx vitest run tests/seo/SEOHead.test.ts` — all pass

**Artifacts:**
- `src/components/SEOHead.astro` (new)
- `tests/seo/SEOHead.test.ts` (new)

### Step 3: Integrate SEOHead into Pages

- [ ] Modify `src/layouts/BaseLayout.astro`:
  - Import `SEOHead` from `../components/SEOHead.astro`
  - The layout should accept optional SEO-related props (`title`, `description`, `image`, `type`, `structuredData`, `noindex`) and pass them through to `<SEOHead />` inside `<head>`
  - Remove the existing inline `<title>` logic — `SEOHead` now handles it
  - Default props: `title: "Sam — Music"`, `description: "Official music portfolio of Sam — listen to tracks, albums, and EPs."`
  - The `<SEOHead />` component renders inside `<head>` alongside existing meta tags (`charset`, `viewport`, `generator`)
- [ ] Modify `src/pages/index.astro`:
  - Pass SEO props to the layout: `title="Sam — Music"`, `description="Official music portfolio of Sam. Listen to tracks, albums, and EPs."`, `image="/favicon.svg"`, `type="website"`
- [ ] Modify `src/pages/releases/index.astro`:
  - Pass SEO props: `title="Sam — Releases"`, `description="Browse all releases by Sam — albums, EPs, and singles with streaming links."`, `type="website"`
- [ ] Modify `src/pages/releases/[slug].astro`:
  - Import structured data helpers from `src/scripts/structured-data.ts`
  - Derive `siteUrl` from `Astro.site.href` (set by `site` in `astro.config.mjs`)
  - For each release, call `generateMusicAlbumSchema(release, siteUrl)` to produce JSON-LD
  - Pass to layout: `title={`Sam — ${release.title}`}`, `description={release.description || `Listen to ${release.title} by Sam.`}`, `image={release.artwork}`, `type={release.type === 'single' ? 'music.song' : 'music.album'}`, `structuredData={albumSchema}`
- [ ] Verify each page renders correct meta tags by running `npm run dev` and inspecting `<head>` output:
  - Homepage: title "Sam — Music", OG type "website"
  - Releases index: title "Sam — Releases"
  - Release detail: title "Sam — {title}", JSON-LD `MusicAlbum` schema present
- [ ] Run `npm run build` — succeeds with zero errors

**Artifacts:**
- `src/layouts/BaseLayout.astro` (modified)
- `src/pages/index.astro` (modified)
- `src/pages/releases/index.astro` (modified)
- `src/pages/releases/[slug].astro` (modified)

### Step 4: Sitemap and robots.txt

- [ ] Install `@astrojs/sitemap`: `npm install @astrojs/sitemap`
- [ ] Modify `astro.config.mjs`:
  - Import `sitemap` from `@astrojs/sitemap`
  - Add `sitemap()` to the `integrations` array
  - Add `site: 'https://sam.music'` to the top-level Astro config (required by `@astrojs/sitemap` — this is the canonical base URL; KB-008 may update it to the actual production domain). This also populates `Astro.site` used by structured data helpers in Step 3.
- [ ] Create `public/robots.txt`:
  ```
  User-agent: *
  Allow: /

  Sitemap: https://sam.music/sitemap-index.xml
  ```
- [ ] Run `npm run build` — confirm `dist/sitemap-index.xml` is generated and contains URLs for all pages (homepage, `/releases`, `/releases/*` for each release)
- [ ] Verify `dist/robots.txt` is present in build output

**Artifacts:**
- `astro.config.mjs` (modified)
- `package.json` (modified — new dependency)
- `public/robots.txt` (new)

### Step 5: Testing & Verification

> ZERO test failures allowed. Full test suite as quality gate.

- [ ] Run full test suite: `npx vitest run` — all tests pass (including any tests from KB-003/KB-004)
- [ ] Run `npm run build` — succeeds with zero errors
- [ ] Inspect the built HTML in `dist/`:
  - `dist/index.html`: contains `<title>Sam — Music</title>`, `og:title`, `og:description`, `twitter:card`, `<link rel="canonical">`
  - `dist/releases/index.html`: contains unique title and description
  - `dist/releases/midnight-sessions/index.html`: contains `<script type="application/ld+json">` with `@type: "MusicAlbum"`, has `og:type` set correctly, has `og:image` with album artwork URL
- [ ] Validate JSON-LD output against Google's Rich Results Test structure (manual spot-check: `@context`, `@type`, `name`, `byArtist` fields are present and correctly typed)
- [ ] `dist/sitemap-index.xml` exists and lists all public pages
- [ ] `dist/robots.txt` exists and allows all crawlers

### Step 6: Documentation & Delivery

- [ ] Update `README.md` — add "SEO" section documenting: `SEOHead` component props, how to add structured data to new pages, sitemap configuration (the `site` property in `astro.config.mjs`), and `robots.txt` location
- [ ] Verify all files in File Scope exist with expected content
- [ ] Commit with message: `feat(KB-006): add per-page SEO with structured data and sitemap`
- [ ] Out-of-scope findings created as new tasks via `task_create` tool (if any)

## Documentation Requirements

**Must Update:**
- `README.md` — add SEO section: SEOHead component usage, structured data helpers, sitemap config, robots.txt

**Check If Affected:**
- `src/layouts/BaseLayout.astro` — modified to use SEOHead (document the new prop interface)

## Completion Criteria

- [ ] `src/components/SEOHead.astro` accepts props for title, description, image, canonical URL, og:type, structured data, and noindex
- [ ] Every page has unique `<title>` and `<meta name="description">`
- [ ] Open Graph tags (`og:title`, `og:description`, `og:image`, `og:type`, `og:url`) present on every page
- [ ] Twitter Card tags (`summary_large_image` format) present on every page
- [ ] `<link rel="canonical">` present on every page
- [ ] Release detail pages include `<script type="application/ld+json">` with `MusicAlbum` schema (containing nested `MusicRecording` entries per track)
- [ ] `durationToISO8601` correctly converts "3:42" → "PT3M42S"
- [ ] `@astrojs/sitemap` integration added to `astro.config.mjs` with `site` URL configured
- [ ] `public/robots.txt` allows all crawlers and references sitemap
- [ ] `npm run build` succeeds and produces `sitemap-index.xml` and `robots.txt` in `dist/`
- [ ] All tests pass (`npx vitest run`)
- [ ] `astro.config.mjs` has `site: 'https://sam.music'` (placeholder domain; KB-008 updates for production)

## Git Commit Convention

Commits at step boundaries. All commits include the task ID:

- **Step completion:** `feat(KB-006): complete Step N — description`
- **Bug fixes:** `fix(KB-006): description`
- **Tests:** `test(KB-006): description`

## Do NOT

- Add `MusicRecording` structured data as standalone pages for individual tracks (tracks are displayed within release pages, not as separate URLs)
- Modify content collection schema or frontmatter fields (that's KB-004's scope)
- Build new pages or components beyond `SEOHead.astro` and `structured-data.ts`
- Add a CMS, admin UI, or SEO dashboard
- Configure Cloudflare deployment, R2, or production domain (KB-008)
- Add analytics tracking (KB-009)
- Modify design system or theme colors (KB-007)
- Install audio-related packages (KB-003)
- Use `helmet`, `react-helmet`, or any React-based SEO library — this is an Astro project using native Astro components
- Hardcode production domain URLs — use the `site` config from `astro.config.mjs` as the base
- Add `og:audio` or direct audio file URLs in structured data (those are R2 URLs managed by KB-003/KB-008)
- Modify `docs/initial-research.md` or `docs/implementation-plan.md`
