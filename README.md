# Sam Paul Toms — Portfolio

A music portfolio website for Sam, built with modern web technologies. Dark-themed, responsive, and designed to showcase music releases with an integrated audio player.

## Tech Stack

- **[Astro 5](https://astro.build)** — Static site framework with islands architecture
- **[Preact](https://preactjs.com)** — Lightweight reactive UI for interactive components
- **[Tailwind CSS v4](https://tailwindcss.com)** — Utility-first CSS with CSS-first configuration (`@theme` block)
- **[Cloudflare Pages](https://pages.cloudflare.com)** — Deployment platform with server-side rendering
- **[howler.js](https://howlerjs.com)** — Cross-browser audio engine with format fallback
- **SVG Waveform Renderer** — Lightweight SVG-based waveform visualization from pre-computed peak data
- **TypeScript (strict)** — Type-safe development

## Quick Start

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:4321`.

## Local Development Audio

By default, the app resolves audio URLs using `R2_PUBLIC_URL` (defaults to the Wrangler R2 proxy at `http://localhost:4321/r2`). To hear audio in local dev without R2 access, you can generate placeholder MP3 files:

### Prerequisites

- **ffmpeg** — Install with `brew install ffmpeg` (macOS) or `apt install ffmpeg` (Ubuntu/Debian).

### Setup

1. Generate duration-matching synthetic audio for local development:

   ```bash
   npm run generate:sample-audio
   ```

   This script reads release frontmatter from `src/content/releases/*.md` and generates synthetic MP3 files matching each track's stated duration under `public/audio-samples/`. Each track gets unique ambient tones for realistic waveform visualization. The script is idempotent — re-running skips files with correct durations.

   > **Legacy:** The older `bash scripts/setup-dev-audio.sh` generates 3-second silent placeholders. `npm run generate:sample-audio` is preferred as it produces duration-accurate files with audio content.

2. Add the following to your `.env` (or `.env.local`) to point the audio player at the generated placeholders:

   ```
   R2_PUBLIC_URL=http://localhost:4321/audio-samples
   ```

   This overrides the default Wrangler R2 proxy URL so that audio URLs resolve to the local placeholder files served by Astro's static file server.

> **Note:** Generated files under `public/audio-samples/` are gitignored and should never be committed.

## Scripts

| Command                         | Description                                             |
| ------------------------------- | ------------------------------------------------------- |
| `npm run test`                  | Run Vitest test suite                                   |
| `npm run dev`                   | Start Astro dev server                                  |
| `npm run build`                 | Build for production                                    |
| `npm run preview`               | Preview production build locally                        |
| `npm run lint`                  | Run ESLint on source files                              |
| `npm run format`                | Format all files with Prettier                          |
| `npm run generate:sample-audio` | Generate duration-matching synthetic MP3s for local dev |
| `npm run generate:waveforms`    | Generate waveform peak JSON from audio files            |
| `npm run fetch:oembed`          | Fetch Instagram oEmbed thumbnails for gallery items     |

## Directory Structure

```
sam/
├── public/             # Static assets (favicon, images)
├── src/
│   ├── components/     # Reusable UI components
│   │   └── AudioPlayer/ # Persistent audio player (Preact island)
│   ├── content/        # Astro content collections
│   │   ├── about/      # About/bio page content
│   │   ├── releases/   # Release markdown files
│   │   └── works/      # Works/portfolio playlist sections
│   ├── layouts/        # Page layouts
│   ├── pages/          # File-based routing
│   ├── scripts/        # Utility scripts (custom events, helpers)
│   └── styles/         # Global CSS (Tailwind v4)
├── tests/              # Test files (Vitest + Testing Library)
├── astro.config.mjs    # Astro + Preact + Cloudflare + Tailwind config
├── vitest.config.ts    # Vitest configuration with Preact JSX support
├── tsconfig.json       # TypeScript strict mode
└── .env.example        # Environment variable template
```

## Audio Player

The site features a persistent sticky-bottom audio player that continues playing across page navigations using Astro's View Transitions.

### Architecture

The player is built as a **Preact island** (`client:load`) with three main layers:

1. **Playlist Store** (`playlistStore.ts`) — Preact signals-based singleton store that manages playlist state (tracks, current index, playback state, volume, time). Signals persist across View Transitions since the JS module stays loaded.

2. **Audio Engine** (`audioEngine.ts`) — Wraps howler.js for cross-browser audio playback. Provides OGG/MP3 format fallback, HTML5 streaming mode for large files, RAF-based time tracking, and reactive auto-load via Preact's `effect()`.

3. **Waveform Renderer** (`waveformRenderer.ts`) — SVG-based waveform visualization using pre-computed peak data. Peak data is generated at build time by `npm run generate:waveforms` and served as static JSON. Visual progress is synced via RAF loop.

The player uses `transition:persist` in the layout to survive Astro View Transitions without destroying the component or interrupting playback.

### Custom Events API

Pages and components can control the player via custom events (no framework coupling):

```typescript
import {
  playTracks,
  pausePlayer,
  addToQueue,
} from '../scripts/audio-player-events';

// Start playing a playlist
playTracks(
  [
    { id: '1', title: 'Song A', artist: 'Sam', audioUrl: '/audio/song-a.mp3' },
    { id: '2', title: 'Song B', artist: 'Sam', audioUrl: '/audio/song-b.mp3' },
  ],
  0,
); // startIndex

// Pause playback
pausePlayer();

// Add a track to the queue
addToQueue({
  id: '3',
  title: 'Song C',
  artist: 'Sam',
  audioUrl: '/audio/song-c.mp3',
});
```

### Environment Variable

- `R2_PUBLIC_URL` — Base URL for Cloudflare R2 object storage. Audio URLs are constructed as `${R2_PUBLIC_URL}/${track-relative-path}`. For local development with Wrangler's R2 emulation, use `http://localhost:4321/r2`.

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `R2_PUBLIC_URL` — Base URL for Cloudflare R2 object storage (audio files, artwork)
- `SITE_URL` — Production site URL for canonical tags, sitemap, and structured data (defaults to `https://sampaultoms.com`)
- `PUBLIC_SITE_NAME` — Site name used in page titles, `og:site_name`, navigation, and descriptions (defaults to `"Sam Paul Toms"`)
- `PUBLIC_UMAMI_WEBSITE_ID` / `PUBLIC_UMAMI_SRC` — Umami analytics (leave blank to disable)

## Deployment

The site deploys to **Cloudflare Pages** with audio served from **Cloudflare R2**. Configuration is in `wrangler.toml` and `astro.config.mjs` uses the `SITE_URL` env var for production URLs.

See **[`docs/deployment.md`](docs/deployment.md)** for the complete step-by-step guide covering R2 setup, Pages deployment, DNS configuration, and local development with R2 emulation.

## Content Collections

### Releases Collection (`src/content/releases/`)

The `releases` collection stores all music releases (albums, EPs, singles) as Markdown files. Each file's frontmatter defines the release metadata, track listing, and streaming links.

#### File Naming Convention

File names become URL slugs: `midnight-sessions.md` → `/releases/midnight-sessions`. Use lowercase letters and hyphens only (no spaces or special characters).

#### Frontmatter Schema

```yaml
---
title: 'Release Title' # Required — release name
artist: 'Sam' # Required — artist name
releaseDate: 2025-11-15 # Required — YYYY-MM-DD format
type: album # Required — album | ep | single
artwork: /images/releases/foo.svg # Required — path to artwork image
description: 'Short blurb' # Optional — release description
tracks: # Required — at least one track
  - title: 'Track Name'
    duration: '3:42' # M:SS format
    spotifyUrl: https://... # Optional per-track streaming URL
    appleMusicUrl: https://... # Optional
    youtubeMusicUrl: https://... # Optional
    bandcampUrl: https://... # Optional
    audioFile: 'path/in/r2' # Optional — R2 audio path (for player)
streamingLinks: # Optional — release-level streaming links
  spotify: https://open.spotify.com/album/...
  appleMusic: https://music.apple.com/album/...
  youtubeMusic: https://music.youtube.com/...
  bandcamp: https://sam.bandcamp.com/album/...
---
```

The Markdown body (below the frontmatter) can contain an extended description or liner notes, rendered on the release detail page.

#### Adding a New Release

1. Create a new `.md` file in `src/content/releases/` with a URL-safe slug name
2. Fill in all required frontmatter fields (see schema above)
3. Add a placeholder or real artwork image to `public/images/releases/`
4. Run `npx astro check` to validate against the schema
5. Verify the release appears on `/releases` and `/releases/{slug}`

## SEO

### SEOHead Component (`src/components/SEOHead.astro`)

A reusable component that renders all per-page SEO tags inside `<head>`. It is included by `BaseLayout.astro` and accepts these props:

| Prop             | Type                                                             | Default                                                                  | Description                                                          |
| ---------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| `title`          | `string`                                                         | `"Sam Paul Toms"`                                                        | Page `<title>` and OG/Twitter title                                  |
| `description`    | `string`                                                         | `"Official music portfolio of Sam — listen to tracks, albums, and EPs."` | Meta description, OG/Twitter description                             |
| `image`          | `string?`                                                        | —                                                                        | OG/Twitter image (relative path or absolute URL)                     |
| `canonicalUrl`   | `string?`                                                        | `Astro.url.href`                                                         | Canonical URL override                                               |
| `type`           | `'website' \| 'music.song' \| 'music.album' \| 'music.playlist'` | `'website'`                                                              | `og:type` value                                                      |
| `structuredData` | `object \| object[]?`                                            | —                                                                        | JSON-LD object(s) to inject as `<script type="application/ld+json">` |
| `noindex`        | `boolean?`                                                       | `false`                                                                  | If true, adds `<meta name="robots" content="noindex, nofollow">`     |

Pages pass SEO props through their layout, which forwards them to `BaseLayout` → `SEOHead`.

### Structured Data Helpers (`src/scripts/structured-data.ts`)

Pure TypeScript functions that generate Schema.org JSON-LD objects:

- **`generateMusicAlbumSchema(release, siteUrl)`** — Produces a `MusicAlbum` schema with nested `MusicRecording` entries per track, release date, artwork, and album release type.
- **`generateMusicRecordingSchema(track, release, siteUrl, slug)`** — Produces a `MusicRecording` schema for individual tracks with `inAlbum` reference.
- **`durationToISO8601(duration)`** — Converts `"3:42"` → `"PT3M42S"` (ISO 8601 duration).
- **`resolveAbsoluteUrl(path, siteUrl)`** — Resolves relative paths to absolute URLs using the site's base URL.

### Adding SEO to New Pages

1. Pass SEO props (`title`, `description`, `image`, `type`) through the page's layout
2. For structured data, import helpers from `src/scripts/structured-data.ts` and pass the result as `structuredData`
3. `Astro.site.href` provides the base URL (set by `site` in `astro.config.mjs`)

### Sitemap

The `@astrojs/sitemap` integration automatically generates `sitemap-index.xml` and `sitemap-0.xml` during build. The `site` property in `astro.config.mjs` determines the canonical base URL:

```js
// astro.config.mjs
export default defineConfig({
  site: 'https://sampaultoms.com', // update for production domain
  integrations: [sitemap()],
});
```

### robots.txt

Located at `public/robots.txt`. Allows all crawlers and references the sitemap:

```
User-agent: *
Allow: /

Sitemap: https://sampaultoms.com/sitemap-index.xml
```

## Background

See [`docs/initial-research.md`](docs/initial-research.md) for the full research report on platform comparison, design trends, and technology choices.

## Template Specifications

The [`/specs`](specs/README.md) directory contains generalized specification documents that describe the design system, architecture, content model, component API, and deployment process in an artist-agnostic way — useful for forking this template for a new artist site.
