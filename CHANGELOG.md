# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- wav2mp3 CLI utility for converting `.wav` files to `.mp3` via ffmpeg (KB-082)
- Projects section on homepage: responsive grid of project cards sourced from a new `projects` content collection, replacing the YouTube embed section (KB-086)
- Project modal (Preact) — clicking a project card opens a detail modal with image, summary, date, and optional YouTube video embed, following the AboutModal pattern (KB-086)
- Populated real project content: accurate summaries for all 6 projects based on works catalogue evidence, corrected Solace from incorrect 'meditation/mindfulness' to dramatic film score (KB-087)
- Expanded project summaries for The Bon-Bons and Void and Vista from narrow catalogue-track descriptions to full project-level descriptions (KB-090)
- Audited YouTube video URLs for all project content files — only "A Life On The Farm" has a verified URL; remaining 5 projects (Heimat, Solace, The Solent, The Bon-Bons, Void and Vista) have no videos available on the Sam Paul Toms Music channel (KB-088)
- Publish date audit: all 6 project `publishDate` values flagged as unverified (invented during scaffold). Added `dateStatus` field to each file and created `docs/publish-date-audit.md` report for content owner review (KB-089)
- Release date audit: all 4 release `releaseDate` values flagged as unverified (invented during scaffold). Added `dateStatus` field to each file and created `docs/release-date-audit.md` report for content owner review (KB-092)

## [1.0.0] - 2026-05-20

### Added

- Scaffold Astro project with Tailwind v4 and Cloudflare config (KB-002)
- Base layout, index page, directory structure, and content schema (KB-002)
- Developer tooling configuration — ESLint, Prettier, Vitest (KB-002)
- Project README with documentation (KB-002)
- About page with content collection, BioSection, PressQuotes, GenreTags, and ContactForm components (KB-005)
- Audio player system with engine, waveform visualizer, UI controls, and Astro integration (KB-003)
- Releases content collection with listing and detail pages (KB-004)
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
