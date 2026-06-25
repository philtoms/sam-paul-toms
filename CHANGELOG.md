# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Recorded the KB-263 trigger-watch (KB-177 Option-3 Markdown-preference chain) as BLOCKED by a force-reset of `main`/`origin/main` from KB-253 (`076b0b4`) back to KB-145 (`77002915`) on 2026-06-20 (GitUp `[gitup] set tip`), which rolled back the 89-commit KB-146→KB-254 lineage — including KB-158's `src/data/name-links.ts` registry and the chain's own CHANGELOG history — from `main`; no data lost (the lineage is fully recoverable via reflog, e.g. `712f8c9`/`076b0b4`/`0a9149a` are all valid commits). KB-263 stopped at its Step 0 Preflight with zero commits / zero tracked changes. Full forensic record + binary board decision (retire the chain vs. restore `main` and re-dispatch) escalated in `docs/main-rollback-blocker.md` (KB-266)
- Replaced gallery placeholder images with real Instagram post thumbnails for sammytoms-01, -02, -04, -05; updated `instagramUrl` fields from profile root to specific post permalinks (KB-115)
- Switched the shared `vitest.config.ts` from `defineConfig` (`vitest/config`) to `getViteConfig` (`astro/config`), booting Astro's vite plugin pipeline so `.astro` files compile inside vitest and the Astro Container API can server-render them; dropped the manual `preact()` plugin (re-added automatically by the `@astrojs/preact` integration). Per-file `// @vitest-environment` annotations continue to drive the environment (KB-138)

### Tests

- Migrated `tests/front-page/YouTubeEmbed.test.ts` and `tests/front-page/CompactBio.test.ts` from source-substring grep to behavioural Astro Container API render-then-assert tests (assert on parsed-DOM attributes like `iframe.getAttribute('src')`), via a new shared `tests/helpers/renderAstro.ts` helper. `HeroBanner` and `mobile-layout` are intentionally kept as source-grep (animation-math / CSS-regex concerns); `ProjectGrid` and `SocialLinksBar` deferred to KB-148 (KB-138)

### Added

- Build-time Instagram oEmbed thumbnail fetching: `scripts/fetch-instagram-oembed.mjs` reads gallery items with `type: instagram`, fetches thumbnail URLs from the Instagram oEmbed endpoint, downloads the images to `public/images/gallery/`, and writes local paths into markdown frontmatter. Graceful degradation on failure — never blocks the build. Profile URLs are detected and skipped with clear warnings. Optional disk caching via `INSTAGRAM_OEMBED_CACHE_DIR` env var (KB-114, KB-116)

### Fixed

- Music player now fades out and pauses when a YouTube video starts playing, preventing competing audio sources (KB-101)

### Changed

- Removed published date display from project cards grid and project detail modal (KB-102)

### Added

- wav2mp3 CLI utility for converting `.wav` files to `.mp3` via ffmpeg (KB-082)
- Projects section on homepage: responsive grid of project cards sourced from a new `projects` content collection, replacing the YouTube embed section (KB-086)
- Project modal (Preact) — clicking a project card opens a detail modal with image, summary, date, and optional YouTube video embed, following the AboutModal pattern (KB-086)
- Populated real project content: accurate summaries for all 6 projects based on works catalogue evidence, corrected Solace from incorrect 'meditation/mindfulness' to dramatic film score (KB-087)
- Expanded project summaries for The Bon-Bons and Void and Vista from narrow catalogue-track descriptions to full project-level descriptions (KB-090)
- Audited YouTube video URLs for all project content files — only "A Life On The Farm" has a verified URL; remaining 5 projects (Heimat, Solace, The Solent, The Bon-Bons, Void and Vista) have no videos available on the Sam Paul Toms Music channel (KB-088)
- Publish date audit: all 6 project `publishDate` values flagged as unverified (invented during scaffold). Added `dateStatus` field to each file and created `docs/publish-date-audit.md` report for content owner review (KB-089)
- Release date audit: all 4 release `releaseDate` values flagged as unverified (invented during scaffold). Added `dateStatus` field to each file and created `docs/release-date-audit.md` report for content owner review (KB-092)
- `generate:sample-audio` script — generates duration-matching synthetic MP3 files from release frontmatter using ffmpeg, replacing the 3-second silent placeholders from `setup-dev-audio.sh`. Idempotent, per-track frequency variation, ±1s duration verification via ffprobe (KB-097)

## [1.0.0] - 2026-05-20

### Added

- Scaffold Astro project with Tailwind v4 and Cloudflare config (KB-002)
- Base layout, index page, directory structure, and content schema (KB-002)
- Developer tooling configuration — ESLint, Prettier, Vitest (KB-002)
- Project README with documentation (KB-002)
- About page with content collection, BioSection, PressQuotes, GenreTags, and ContactForm components (KB-005)
- Audio player system with engine, waveform visualizer, UI controls, and Astro integration (KB-003)
- Playable audio tracks on release pages (KB-010)
- SEO integration with structured data, sitemap, and meta tags (KB-006)
- Design system with tokens, typography, and utility classes (KB-007)
- Self-hosted Umami analytics integration (KB-009)
- Cloudflare Pages deployment config and guide (KB-008)
- Local development audio setup script and docs (KB-013)
- Front page with hero, bio, social, music, and video sections (KB-011)
- Fixed-position hero with scroll-over parallax effect (KB-015)
- Transparent main element for hero scroll-through effect (KB-017)
- Hover-reveal platform names on social links (KB-019)
- Bottom fade gradient overlay on HeroBanner (KB-032)
- Full-bleed banner cover image replacing gradient hero (KB-028)
- Restyled social links bar with horizontal alignment and improved labels (KB-029)
- Standardized max-width to 1052px across all main content areas (KB-030)
- SVG icons replacing emoji throughout player bar styling (KB-033)
- Single-row horizontal audio player layout (KB-039)
- Player bar restyled with solid bg, reordered layout, and vertical volume slider (KB-040)
- Expanded player bar converted from flexbox to CSS grid (KB-041)
- Live waveform rendering on track rows (KB-048)
- SocialLinksBar moved into CompactBio via slot (KB-049)
- Widened waveform container from w-24 to w-48 (KB-050)
- Updated social icons — reduced sizes, added Apple Music at 2x, replaced Contact with text pill (KB-051, KB-052)
- Apple Music icon replaced with scaled Apple logo across components (KB-053)

### Changed

- Rebranded site identity to Sam Paul Toms (KB-023)
- YouTube embed title updated to Sam Paul Toms (KB-026)
- YouTubeEmbed rewritten to direct iframe embed (KB-018)
- Removed scroll indicator from HeroBanner (KB-020)
- Removed icon and title from CompactBio component (KB-024)
- Stripped heading from home page and removed accordion styling (KB-021)
- Moved accordion chevron before title with right-pointing icon (KB-022)
- Restructured social link hover labels to vertical bordered-pill pattern (KB-025)
- Replaced Play All button with yellow circle icon (KB-027)
- Updated `--color-player-bg` from `#1f1f1f` to `#2a2a2a` (KB-045)

### Fixed

- Added `.worktrees` and `.kb` to `.gitignore` (KB-002)
- YouTube embed autoplay fix and component tests (KB-016)
- Merge conflict resolution and pre-existing test failures (general)
- Repositioned hero-bottom-fade gradient to anchor at bottom of banner (KB-035)
- Centered play icon in circular button (KB-037)
- Added `overflow-hidden` to hero banner container (KB-036)
- Fixed volume slider hover gap with `::after` bridge pseudo-element (KB-042)
- Removed OGG fallback, using MP3 URL directly in audio engine (KB-043)
- Used `volume.peek()` to avoid reactive subscription in `load()` (KB-044)
- Called `loadAudio` on track change to render waveform (KB-046)
- Added `z-50` to audio player bar for correct stacking order (KB-047)

### Tests

- About page tests (KB-005)
- Banner image and overlay assertions (KB-028)

### Docs

- Dev audio files research document (KB-012)
- About page documentation (KB-005)
- Implementation plan summary (KB-001)

### Chores

- Removed `node_modules` from git tracking (KB-002)
- Clean reinstalled `node_modules` for native bindings (KB-002)
- Added `public/audio-samples/` to `.gitignore` (KB-014)
- Removed `.kb/config` from repository (general)
