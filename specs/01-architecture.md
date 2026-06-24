# 01 — Architecture

**Last updated:** 2026-06-12

**Purpose:** Describes the tech stack, project structure, rendering model, and data-flow architecture of the music portfolio template.

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Astro 5 | Static-first with server-side rendering |
| UI Islands | Preact 10 | Lightweight React alternative for interactive components |
| State Management | `@preact/signals` | Reactive signals power the audio player store (`playlistStore.ts`) |
| Styling | Tailwind CSS v4 | CSS-first configuration via `@theme` block (no `tailwind.config.js`) |
| Deployment | Cloudflare Pages | `output: 'server'` mode with `@astrojs/cloudflare` adapter |
| Audio Storage | Cloudflare R2 | Public bucket for MP3 files; not served through the Astro app |
| Audio Playback | howler.js | Cross-browser audio with HTML5 streaming mode |
| Email | Resend | Contact form submissions via server-side API route |
| Spam Protection | Cloudflare Turnstile | Optional CAPTCHA on contact form |
| Testing | Vitest | With `@preact/preset-vite`, `jsdom`, and `@testing-library/preact` |
| Sitemap | `@astrojs/sitemap` | Generates `sitemap-index.xml` during build |

---

## Project Structure

```
/
├── astro.config.mjs          # Astro config: site URL, Cloudflare adapter, Preact/Tailwind integrations
├── wrangler.toml              # Cloudflare Pages: project name, build output dir
├── tsconfig.json              # TypeScript config (extends Astro defaults)
├── vitest.config.ts           # Vitest config: Preact plugin, test globals, setup file
├── eslint.config.mjs          # ESLint: TypeScript plugin, recommended rules
├── package.json               # Dependencies, npm scripts
├── .env.example               # All configurable environment variables
│
├── public/                    # Static assets served as-is
│   ├── favicon.svg            # Site favicon (SVG)
│   ├── robots.txt             # Search engine directives + sitemap URL
│   ├── fonts/                 # Self-hosted web fonts
│   └── images/                # All image assets
│       ├── banner/            # Hero banner images
│       ├── bio/               # Artist portrait photos
│       ├── carousel/          # Polaroid frame overlays for MediaCarousel
│       ├── gallery/           # Gallery thumbnails (including Instagram oEmbed)
│       ├── projects/          # Project card images
│       └── releases/          # Album artwork
│
├── src/
│   ├── content/               # Astro content collections (Markdown + frontmatter)
│   │   ├── config.ts          # Zod schemas for all five collections
│   │   ├── about/             # Artist bio (single file)
│   │   ├── gallery/           # Gallery items (image, video, instagram types)
│   │   ├── projects/          # Project entries with optional video
│   │   ├── releases/          # Albums, EPs, singles with track listings
│   │   └── works/             # Playlist sections (documentary, film, library, etc.)
│   │
│   ├── layouts/               # Page layouts
│   │   ├── BaseLayout.astro   # Root layout: global CSS, SEOHead, player + modal islands
│   │   └── ReleasesLayout.astro # Nested layout for release pages (breadcrumb nav)
│   │
│   ├── pages/                 # File-based routing
│   │   ├── index.astro        # Homepage (composes all homepage sections)
│   │   ├── releases/
│   │   │   ├── index.astro    # Releases listing page
│   │   │   └── [slug].astro   # Individual release detail page
│   │   └── api/
│   │       └── contact.ts     # POST endpoint for contact form (Resend + Turnstile)
│   │
│   ├── components/            # UI components (Astro .astro and Preact .tsx)
│   │   ├── AudioPlayer/       # Audio player module (see 05-audio-player.md)
│   │   ├── AboutModal.tsx     # Preact island: about/bio modal
│   │   ├── BioSection.astro   # Astro: photo + bio content layout
│   │   ├── CompactBio.astro   # Astro: condensed bio with "Read more" button
│   │   ├── ContactForm.astro  # Astro: standalone contact form (alternative to modal)
│   │   ├── ContactModal.tsx   # Preact island: contact form modal with Turnstile
│   │   ├── HeroBanner.astro   # Astro: fixed hero with scroll-driven parallax
│   │   ├── MediaCarousel.tsx  # Preact island: infinite-swipe gallery carousel
│   │   ├── PlaylistAccordion.tsx # Preact island: collapsible playlist sections
│   │   ├── ProjectGrid.astro  # Astro: responsive project card grid
│   │   ├── ProjectModal.tsx   # Preact island: project detail modal with video
│   │   ├── ReleaseCard.astro  # Astro: release thumbnail card (links to detail page)
│   │   ├── SEOHead.astro      # Astro: all meta tags, structured data, OG/Twitter
│   │   ├── SocialLinksBar.astro # Astro: play button + social icon links
│   │   ├── StreamingLinks.astro # Astro: streaming platform icon links
│   │   ├── TrackList.astro    # Astro: numbered track listing with play-on-click
│   │   ├── TrackRow.tsx       # Preact: single track row with mini waveform
│   │   └── YouTubeEmbed.astro # Astro: YouTube iframe embed
│   │
│   ├── scripts/               # Shared client/server utilities
│   │   ├── accent-color.ts    # Read accent CSS vars from DOM (for canvas/SVG consumers)
│   │   ├── about-modal-events.ts    # Custom events: about-modal:open/close
│   │   ├── audio-helpers.ts         # Audio URL resolution, waveform path derivation
│   │   ├── audio-player-events.ts   # Custom events: audio-player:play/pause/add/seek/fade-pause
│   │   ├── contact-modal-events.ts  # Custom events: contact-modal:open/close
│   │   ├── project-modal-events.ts  # Custom events: project-modal:open/close
│   │   ├── seo-helpers.ts           # Pure TS SEO tag generation (testable helpers)
│   │   ├── structured-data.ts       # Schema.org JSON-LD generators for music content
│   │   ├── youtube.ts               # YouTube helpers: extractYouTubeId, buildYouTubeEmbedUrl
│   │   └── youtube-audio-pause.ts   # Auto-fade player when YouTube video plays
│   │
│   ├── styles/
│   │   └── global.css         # Design token system + Tailwind v4 @theme + reusable classes
│   │
│   └── types/
│       └── youtube.d.ts       # Type declarations for YouTube IFrame API
│
├── tests/                     # Vitest test suite (mirrors src/ structure)
│   ├── setup.ts               # Imports @testing-library/jest-dom matchers
│   ├── about/                 # About page and content tests
│   ├── api/                   # Contact API endpoint tests
│   ├── audio-player/          # Audio engine, store, waveform, helpers tests
│   ├── components/            # Individual component rendering tests
│   ├── design-system/         # CSS token and mobile layout tests
│   ├── front-page/            # Homepage integration tests
│   ├── projects/              # Project content tests
│   ├── releases/              # Release content, artwork, and page tests
│   ├── scripts/               # Script utility tests
│   ├── seo/                   # SEO head and structured data tests
│   └── unit/                  # Standalone unit tests
│
├── scripts/                   # Build and dev helper scripts
│   ├── clean-dist-audio.mjs   # Removes local audio samples from dist/ after build
│   ├── convert-polaroid-frames.py # One-off utility for polaroid frame asset conversion
│   ├── fetch-instagram-oembed.mjs # Build-time Instagram thumbnail fetcher
│   ├── generate-sample-audio.cjs  # Creates synthetic MP3s for local development
│   ├── generate-waveforms.cjs     # Build-time waveform peak JSON generator
│   ├── generate-waveforms.ts      # TypeScript source for waveform generator (unused at runtime)
│   ├── setup-dev-audio.sh     # Legacy: generates 3-second silent placeholders (superseded by generate-sample-audio.cjs)
│   └── wav2mp3.cjs            # WAV to MP3 converter utility
│
├── docs/                      # Existing project documentation (deep-dive references)
│   ├── deployment.md          # Full Cloudflare Pages + R2 deployment guide
│   ├── initial-research.md    # Tech stack rationale
│   ├── implementation-plan.md # Original task breakdown
│   ├── analytics-setup.md     # Umami self-hosted analytics setup
│   ├── contact-form-research.md # Contact form backend research
│   └── dev-audio-research.md  # Local audio development guide
│
└── specs/                     # This directory — generalized template specifications
```

---

## Islands Architecture

The site uses Astro's **islands architecture** to minimize client-side JavaScript. Most of the page is server-rendered HTML (Astro `.astro` components), while interactive features are hydrated as isolated Preact "islands."

### Astro Components (`.astro`)

Server-rendered at build or request time. No client-side JavaScript. These compose the page layout and static content:

- `BaseLayout.astro`, `ReleasesLayout.astro` — page shells
- `HeroBanner.astro`, `CompactBio.astro`, `BioSection.astro` — static content display
- `ProjectGrid.astro`, `ReleaseCard.astro`, `TrackList.astro` — data-driven rendering with client-side scripts for interactivity
- `SEOHead.astro` — meta tag generation
- `StreamingLinks.astro` — pure rendering
- `ContactForm.astro`, `YouTubeEmbed.astro` — embed forms/media

### Preact Islands (`.tsx`)

Hydrated on the client with explicit directives. Each island is an independent interactive widget:

| Island | Directive | Where Mounted |
|--------|-----------|---------------|
| `Player` | `client:load` | `BaseLayout.astro` (fixed bottom bar, persistent) |
| `ContactModal` | `client:load` | `BaseLayout.astro` (global modal) |
| `ProjectModal` | `client:load` | `BaseLayout.astro` (global modal) |
| `AboutModal` | `client:load` | `BaseLayout.astro` (global modal, conditional on `aboutTitle`) |
| `PlaylistAccordion` | `client:load` | `index.astro` (homepage playlist section) |
| `MediaCarousel` | `client:visible` | `index.astro` (homepage gallery) |
| `TrackRow` | _(child of PlaylistAccordion)_ | Embedded within PlaylistAccordion |

### Communication Pattern: Custom Events

Astro components and Preact islands communicate via **custom events dispatched on `document`**. This avoids prop-drilling and coupling between islands:

- Astro components (e.g., `SocialLinksBar.astro`, `TrackList.astro`, `ProjectGrid.astro`) dispatch events from `<script>` blocks
- Preact islands (e.g., `Player.tsx`, `ContactModal.tsx`) listen for these events in `useEffect` hooks
- Shared event helper modules in `src/scripts/` (`audio-player-events.ts`, `contact-modal-events.ts`, etc.) provide typed dispatch functions

---

## `transition:persist` Directive

The audio player container in `BaseLayout.astro` uses the `transition:persist="audio-player"` attribute:

```astro
<div transition:persist="audio-player" class="fixed bottom-0 z-50">
  <Player client:load />
</div>
```

**Current state:** The `<ClientRouter />` component is **not** configured in this project. Without it, Astro does not enable client-side View Transitions — all page navigations are full MPA page reloads. The `transition:persist` directive exists as **forward-compatible setup** for future SPA-like transitions. When `<ClientRouter />` is eventually added, the player will persist across navigations without resetting state.

The `playlistStore.ts` module-level singleton pattern (Preact signals) also ensures state persistence: as long as the JS module stays loaded, the playlist survives. This would complement `transition:persist` when View Transitions are activated.

---

## Server-Side Rendering

The site uses `output: 'server'` in `astro.config.mjs` with the `@astrojs/cloudflare` adapter:

```javascript
export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  site: process.env.SITE_URL || 'https://sampaultoms.com',
  // ...
});
```

### API Routes

Server-side API routes live in `src/pages/api/` and run as Cloudflare Pages Functions:

- **`src/pages/api/contact.ts`** — `POST` endpoint for contact form submissions
  - Validates input with Zod
  - Checks honeypot field (`fax`) for bot detection
  - Optionally verifies Cloudflare Turnstile token
  - Sends email via Resend (notification + auto-reply)
  - `resend` is externalized from the Vite bundle via `rollupOptions.external: ['resend']`

### Page Routes

| Route | File | Description |
|-------|------|-------------|
| `/` | `src/pages/index.astro` | Homepage (composes all sections) |
| `/releases` | `src/pages/releases/index.astro` | Releases listing (albums, EPs, singles) |
| `/releases/[slug]` | `src/pages/releases/[slug].astro` | Individual release detail page |

---

## Data-Flow Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                    Content Collections (src/content/)                │
│  releases/  works/  about/  projects/  gallery/  (Markdown files)   │
└──────────┬───────────────────────────────────────────────────────────┘
           │  Astro frontmatter (server-side)
           │  getCollection() + Zod validation
           ▼
┌──────────────────────────────────────────────────────────────────────┐
│                      Astro Pages (src/pages/)                       │
│  index.astro / releases/index.astro / releases/[slug].astro         │
│                                                                      │
│  • Fetches content collections                                       │
│  • Builds Track[] arrays via buildTrackFromContent()                 │
│  • Resolves audio URLs via resolveAudioUrl() (prepends R2_PUBLIC_URL)│
│  • Passes data to components as props or serialized JSON             │
└──────┬───────────────────────────┬───────────────────────────────────┘
       │                           │
       │ Server-rendered HTML      │ Client-side scripts
       │ (Astro components)        │ (in <script> blocks)
       ▼                           ▼
┌──────────────┐    Custom Events     ┌──────────────────────────────┐
│ Astro        │ ─── dispatch ──────► │ Preact Islands               │
│ Components   │  (on document)       │                              │
│              │                      │  Player.tsx                  │
│ • SocialLinks│  audio-player:play   │  ├── listens for events      │
│   Bar        │  audio-player:pause  │  ├── updates playlistStore   │
│ • TrackList  │  audio-player:add    │  └── drives audioEngine      │
│ • ProjectGrid│  audio-player:seek   │                              │
│ • CompactBio │  audio-player:toggle │  ContactModal.tsx            │
│              │  audio-player:fade   │  ProjectModal.tsx            │
│              │                      │  AboutModal.tsx              │
│              │  contact-modal:open  │                              │
│              │  project-modal:open  │                              │
│              │  about-modal:open    │                              │
└──────────────┘                      └──────┬───────────────────────┘
                                             │
                                             │ Preact signals (reactive)
                                             ▼
                                      ┌──────────────────┐
                                      │ playlistStore.ts │
                                      │ (Preact signals) │
                                      │                  │
                                      │ tracks           │
                                      │ currentIndex     │
                                      │ currentTrack     │
                                      │ isPlaying        │
                                      │ playbackState    │
                                      │ volume           │
                                      │ currentTime      │
                                      │ duration         │
                                      └──────┬───────────┘
                                             │ effect() subscription
                                             ▼
                                      ┌──────────────────┐
                                      │ audioEngine.ts   │
                                      │ (howler.js)      │
                                      │                  │
                                      │ load() → Howl    │
                                      │ play() / pause() │
                                      │ seek()           │
                                      │ fadeAndPause()   │
                                      │ setVolume()      │
                                      └──────┬───────────┘
                                             │
                                             │ RAF time tracking
                                             ▼
                                      ┌──────────────────┐
                                      │ waveformRenderer │
                                      │ (SVG visual)     │
                                      │                  │
                                      │ init()           │
                                      │ loadPeaks()      │
                                      │ setProgress()    │
                                      │ onSeek()         │
                                      └──────────────────┘
```

### Key Data-Flow Paths

1. **Homepage playlist playback:**
   `works/` content → `index.astro` builds `Track[]` → serialized as JSON in DOM → `SocialLinksBar.astro` dispatches `audio-player:play` → `Player.tsx` receives → `setPlaylist()` updates signals → `effect()` triggers `audioEngine.load()` + `play()`

2. **Track row playback:**
   `PlaylistAccordion.tsx` receives `playableTracksMap` and `allTracks` as props → `TrackRow.tsx` click → accordion dispatches `audio-player:play` with global index → same player pipeline

3. **YouTube audio coordination:**
   `Player.tsx` mounts → `initYouTubeWatcher()` runs → detects YouTube iframes → attaches `YT.Player` → on PLAYING state → calls `fadeAndPausePlayer()` → dispatches `audio-player:fade-pause` → `Player.tsx` receives → `audioEngine.fadeAndPause()`

4. **Release page playback:**
   `releases/[slug].astro` → builds `playableTracks` → passes to `TrackList.astro` → click dispatches `audio-player:play` via inline `<script>` → same player pipeline
