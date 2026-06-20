# 09 — Testing

**Last updated:** 2026-06-19

**Purpose:** Documents the test framework, configuration, directory structure, test categories, and commands.

---

## Test Framework

| Component             | Package                                           | Purpose                                                                                              |
| --------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Test runner           | Vitest 4                                          | Fast, Vite-native test framework                                                                     |
| Vite config bridge    | `astro/config` (`getViteConfig`)                  | Wraps the user vitest config in Astro's vite plugin pipeline so `.astro` files compile inside vitest |
| `.astro` rendering    | `astro/container` (`experimental_AstroContainer`) | Server-renders `.astro` components to HTML strings inside tests (Container API)                      |
| Rendered-HTML parsing | `jsdom` (devDependency)                           | Parses Container-API HTML strings into a `Document` for behavioural assertions                       |
| JSX transform         | `@preact/preset-vite`                             | Compiles TSX for Preact component tests                                                              |
| DOM simulation        | `jsdom` (devDependency)                           | Provides DOM API for component tests                                                                 |
| Component testing     | `@testing-library/preact`                         | Queries and interacts with Preact components                                                         |
| DOM matchers          | `@testing-library/jest-dom`                       | Custom matchers like `toBeInTheDocument()`                                                           |

---

## Test Configuration

### `vitest.config.ts`

```typescript
import { getViteConfig } from 'astro/config';

// `getViteConfig` boots Astro's own vite plugin pipeline (reading
// `astro.config.mjs`), so `.astro` files import and compile correctly inside
// vitest and the Astro Container API can server-render them. The `@astrojs/preact`
// integration re-adds the Preact plugin automatically, so no manual `preact()`.
export default getViteConfig({
  test: {
    include: ['tests/**/*.test.{ts,tsx}'],
    setupFiles: ['tests/setup.ts'],
    globals: true,
  },
} as Parameters<typeof getViteConfig>[0]);
```

Key settings:

- **`getViteConfig` (from `astro/config`)** — wraps the user config in Astro's vite plugin pipeline by reading `astro.config.mjs`, so `.astro` imports compile correctly inside vitest (replacing the plain `defineConfig` from `vitest/config`). This is what unblocks the Astro Container API for behavioural `.astro` tests.
- **No manual `preact()` plugin** — the `@astrojs/preact` integration in `astro.config.mjs` re-adds the Preact vite plugin automatically via Astro's config-setup hooks, so the explicit `plugins: [preact()]` of the old config is intentionally omitted (doubling it up risks plugin conflicts).
- **No default `test.environment`** — left unset so per-file `// @vitest-environment` annotations drive the environment: `jsdom` for Preact `.tsx` component tests, `node` for Astro Container API render tests.
- **`include`** — matches all test files in `tests/` with `.test.ts` or `.test.tsx` extension
- **`setupFiles`** — runs `tests/setup.ts` before each test suite
- **`globals: true`** — `describe`, `it`, `expect`, `vi` are available globally (no imports needed)
- _(The `as Parameters<typeof getViteConfig>[0]` cast is a typing-only affordance: Astro types `getViteConfig` against plain Vite's `UserConfig`, which does not statically include vitest's `test` key. Vitest reads `test` at runtime regardless.)_

### `tests/setup.ts`

```typescript
import '@testing-library/jest-dom';
```

Imports `@testing-library/jest-dom` matchers so they're available in all test files without explicit imports.

---

## Test Directory Structure

```
tests/
├── setup.ts                          # Global test setup (jest-dom matchers)
│
├── helpers/                          # Shared test helpers
│   ├── renderAstro.ts                # Astro Container API render helper (memoised container + jsdom parse)
│   └── renderAstro.test.ts           # Smoke test for the renderAstro helper
│
├── about/                            # About page and content tests
│   ├── content.test.ts               # Bio frontmatter validation (title, photo, genreTags, pressQuotes)
│   └── page-render.test.ts           # About page rendering
│
├── api/                              # API endpoint tests
│   └── contact.test.ts               # Contact form API: validation, honeypot, Turnstile, Resend mock
│
├── audio-player/                     # Audio player module tests
│   ├── audio-helpers.test.ts         # resolveAudioUrl(), getWaveformPeaksUrl(), buildTrackFromContent()
│   ├── audioEngine.test.ts           # Load, play, pause, seek, fadeAndPause (Howler mocked)
│   ├── Player.test.tsx               # Player UI component rendering and interaction
│   ├── playlistStore.test.ts         # Signal state: setPlaylist, playTrack, nextTrack, prevTrack, clearPlaylist
│   ├── svgWaveform.test.ts           # SVG waveform renderer: createSvgWaveform, loadPeaks, setProgress, onSeek
│   └── waveformRenderer.test.ts      # Waveform renderer wrapper: init, loadPeaks, setProgress, onSeek, destroy
│
├── components/                       # Individual component rendering tests
│   ├── about-modal/                  # AboutModal component tests
│   │   └── AboutModal.test.tsx
│   ├── audio-player/                 # Player styling tests
│   │   └── player-style.test.tsx
│   ├── contact-modal/                # ContactModal component tests
│   │   └── ContactModal.test.tsx
│   ├── media-carousel/               # MediaCarousel component tests
│   │   └── MediaCarousel.test.tsx
│   ├── project-modal/                # ProjectModal component tests
│   │   └── ProjectModal.test.tsx
│   └── PlaylistAccordion.test.tsx    # PlaylistAccordion component tests
│
├── docs/                             # Documentation structural-validation tests
│   └── main-rollback-blocker.test.ts # Locks the required structure of docs/main-rollback-blocker.md (KB-266)
│
├── design-system/                    # Design token and layout tests
│   ├── mobile-layout.test.ts         # Mobile viewport layout validation
│   └── tokens.test.ts                # CSS custom property existence and format validation
│
├── front-page/                       # Homepage integration tests
│   ├── CompactBio.test.ts            # CompactBio behavioural test (Astro Container API)
│   ├── HeroBanner.test.ts            # HeroBanner rendering (source-grep — animation math)
│   ├── PlaylistAccordion.test.tsx    # PlaylistAccordion on homepage
│   ├── ProjectGrid.test.ts           # ProjectGrid rendering
│   ├── SocialLinksBar.test.ts        # SocialLinksBar rendering
│   ├── TrackRow.test.tsx             # TrackRow rendering
│   └── YouTubeEmbed.test.ts          # YouTubeEmbed behavioural test (Astro Container API; incl. startTime)
│
├── projects/                         # Project content tests
│   └── content.test.ts               # Project frontmatter validation
│
├── releases/                         # Release content and page tests
│   ├── artwork.test.ts               # Release artwork validation
│   ├── content.test.ts               # Release frontmatter validation (incl. optional `credit` field)
│   └── pages.test.ts                 # Release page rendering
│
├── works/                            # Works content tests
│   └── content.test.ts               # Works frontmatter validation (incl. optional `credit` field)
│
├── scripts/                          # Script utility tests
│   ├── audio-player-events.test.ts   # Custom event dispatch helpers
│   ├── fetch-instagram-oembed.test.ts # Instagram oEmbed fetcher
│   ├── generate-sample-audio.test.ts # Sample audio generator
│   ├── wav2mp3.test.ts               # WAV to MP3 converter
│   ├── youtube.test.ts               # extractYouTubeId + buildYouTubeEmbedUrl contract
│   └── youtube-audio-pause.test.ts   # YouTube audio-pause watcher
│
├── seo/                              # SEO tests
│   ├── SEOHead.test.ts               # generateSEOTags() helper output validation
│   └── structured-data.test.ts       # JSON-LD generators: durationToISO8601, album/track schemas
│
└── unit/                             # Standalone unit tests
    └── accent-color.test.ts          # getAccentColor(), getAccentHoverColor() helpers
```

---

## Test Categories

### Content Validation Tests

Tests that verify content collection frontmatter matches the Zod schemas:

- **`about/content.test.ts`** — Validates bio frontmatter: title, photo, genreTags, pressQuotes
- **`releases/content.test.ts`** — Validates release frontmatter: title, artist, tracks, type enum, and guards the optional `credit` field
- **`releases/artwork.test.ts`** — Validates release artwork paths
- **`projects/content.test.ts`** — Validates project frontmatter
- **`works/content.test.ts`** — Validates works frontmatter: title, slug, tracks; guards that section-level `credit` and per-track `credit`, when present, are strings

### Audio Player Tests

Tests for the audio player module, mocking howler.js:

- **`playlistStore.test.ts`** — Tests all signal operations: setPlaylist, playTrack, nextTrack, prevTrack, clearPlaylist, isTrackCurrentlyPlaying
- **`audioEngine.test.ts`** — Tests load, play, pause, seek, fadeAndPause with mocked Howl constructor
- **`audio-helpers.test.ts`** — Tests URL resolution, waveform path derivation, track building
- **`svgWaveform.test.ts`** — Tests SVG waveform factory: loadPeaks, setProgress, onSeek, destroy
- **`waveformRenderer.test.ts`** — Tests the waveformRenderer wrapper API
- **`Player.test.tsx`** — Tests the Player UI component

### Component Tests

Tests for Preact island components using `@testing-library/preact`:

- **`components/about-modal/AboutModal.test.tsx`** — Modal open/close, content rendering
- **`components/contact-modal/ContactModal.test.tsx`** — Form validation, submission, Turnstile
- **`components/project-modal/ProjectModal.test.tsx`** — Modal open/close, video embed
- **`components/media-carousel/MediaCarousel.test.tsx`** — Carousel navigation, item rendering
- **`components/PlaylistAccordion.test.tsx`** — Section toggle, track click handling, section-credit rendering, and per-track `credit` threading through to `TrackRow`

### Astro Component (`.astro`) Tests

Behavioural tests for `.astro` components that render the component to a real HTML
string via the **Astro Container API** (`experimental_AstroContainer` from
`astro/container`) and then assert on the parsed DOM — mirroring the
`getAttribute('src')` / `className` / element-presence style of the Preact
component tests. The shared helper `tests/helpers/renderAstro.ts` memoises one
container per vitest worker and parses the rendered HTML with the `jsdom`
_package_.

- **`front-page/YouTubeEmbed.test.ts`** — iframe `src`/`title`/`loading`/`allowfullscreen`, URL-format coverage (`watch`, `youtu.be`, `embed`), the `{videoId && …}` conditional omitting the iframe for an unrecognised URL, and the `startTime` prop (`&start=` appended only for positive values).
- **`front-page/CompactBio.test.ts`** — `summary` prop rendering, `#about-modal-btn` "Read more" button, default slot rendering, and the `text-lg` bio paragraph.

**Environment requirement:** these tests must carry a `// @vitest-environment node`
annotation at the top. The Container API must NOT run under a jsdom _test
environment_ — that combination triggers an esbuild `TextEncoder`/`Uint8Array`
invariant. The `jsdom` _package_ is safe to `import` (it only parses the already-
rendered HTML string) and is not used as the test runtime. The per-file
`@vitest-environment` annotations drive the environment because `vitest.config.ts`
sets no default `test.environment`.

**Currently kept as source-grep (not migrated):** `HeroBanner.test.ts` (scroll-
animation math that does not surface in the DOM) and `design-system/mobile-
layout.test.ts` (CSS `@media`/`grid-template-areas` rules). `ProjectGrid.test.ts`
and `SocialLinksBar.test.ts` are tracked for a future behavioural migration
(see follow-up task KB-148).

### Front Page Integration Tests

Tests for homepage components and their rendering:

- CompactBio, HeroBanner, PlaylistAccordion, ProjectGrid, SocialLinksBar, TrackRow, YouTubeEmbed

### API Tests

- **`api/contact.test.ts`** — Tests the POST /api/contact endpoint with mocked Resend. Covers: input validation, honeypot detection, Turnstile verification, email sending, auto-reply, error handling

### SEO Tests

- **`seo/SEOHead.test.ts`** — Tests `generateSEOTags()` helper: title, meta description, canonical URL, OG tags, Twitter cards, structured data, noindex
- **`seo/structured-data.test.ts`** — Tests `durationToISO8601()`, `resolveAbsoluteUrl()`, `generateMusicAlbumSchema()`, `generateMusicRecordingSchema()`

### Design System Tests

- **`design-system/tokens.test.ts`** — Validates all CSS custom properties exist in `global.css` with correct hex format
- **`design-system/mobile-layout.test.ts`** — Validates mobile viewport layout

### Script Tests

- **`scripts/audio-player-events.test.ts`** — Tests custom event dispatch functions
- **`scripts/youtube-audio-pause.test.ts`** — Tests YouTube watcher init/destroy
- **`scripts/fetch-instagram-oembed.test.ts`** — Tests Instagram thumbnail fetcher
- **`scripts/generate-sample-audio.test.ts`** — Tests sample audio generator
- **`scripts/wav2mp3.test.ts`** — Tests WAV to MP3 converter

### Documentation Tests

- **`docs/main-rollback-blocker.test.ts`** — Locks the required structure of `docs/main-rollback-blocker.md` (KB-266): asserts every required section heading, both decision branches (`INTENTIONAL abandon` / `UNINTENDED defect`), both rollback endpoints (KB-253 `076b0b4` / KB-145 `77002915`), the do-no-harm invariant (no commits to `main`, no ref changes), and references to KB-263 / KB-265. Pure filesystem read mirroring the `tests/scripts/*` discipline (no `// @vitest-environment` pragma).

---

## Test Commands

| Command              | Purpose                                           |
| -------------------- | ------------------------------------------------- |
| `npm run test`       | Run all tests once (single run)                   |
| `npm run test:watch` | Run tests in watch mode (re-runs on file changes) |

### Running Specific Tests

```bash
# Run a single test file
npx vitest run tests/audio-player/playlistStore.test.ts

# Run all tests in a directory
npx vitest run tests/components/

# Run tests matching a pattern
npx vitest run --reporter=verbose "audio"
```
