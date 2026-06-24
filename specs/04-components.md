# 04 — Components

**Last updated:** 2026-06-24

**Purpose:** Catalogs every component in `src/components/` with type, client directive, props interface, and description. Documents the modal pattern and custom events system.

---

## Component Catalog

### `BaseLayout.astro`

| | |
|---|---|
| **Type** | Astro component |
| **Directive** | N/A (layout) |
| **File** | `src/layouts/BaseLayout.astro` |
| **Description** | Root page layout. Imports `global.css`, renders `<SEOHead>`, mounts persistent audio player (`Player`) with `transition:persist`, and conditionally renders `ContactModal`, `ProjectModal`, and `AboutModal` as `client:load` Preact islands. Overrides accent color CSS variables from `PUBLIC_ACCENT_COLOR` env var. |

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `'Sam Paul Toms'` | Page title |
| `description` | `string` | `'Official music portfolio...'` | Meta description |
| `image` | `string` | — | OG image path |
| `canonicalUrl` | `string` | `Astro.url.href` | Canonical URL |
| `type` | `'website' \| 'music.song' \| 'music.album' \| 'music.playlist'` | `'website'` | OG type |
| `structuredData` | `object \| object[]` | — | JSON-LD structured data |
| `noindex` | `boolean` | — | Prevent indexing |
| `aboutTitle` | `string` | `''` | About modal title (falsy = modal not rendered) |
| `aboutPhoto` | `string` | `''` | About modal portrait |
| `aboutPhotoAlt` | `string` | `''` | About modal portrait alt |
| `aboutGenreTags` | `string[]` | `[]` | About modal genre tags |
| `aboutPressQuotes` | `PressQuote[]` | `[]` | About modal press quotes |

---

### `SEOHead.astro`

| | |
|---|---|
| **Type** | Astro component |
| **Directive** | N/A (rendered in `<head>`) |
| **File** | `src/components/SEOHead.astro` |
| **Description** | Generates all `<head>` meta tags: title, description, canonical URL, Open Graph, Twitter Card, JSON-LD structured data, and noindex directive. Imports `SEOProps` type from `src/scripts/seo-helpers.ts`. |

**Props:** (matches `SEOProps` from `seo-helpers.ts`)

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | ✅ | Page title |
| `description` | `string` | ✅ | Meta description |
| `image` | `string` | ❌ | OG image path |
| `canonicalUrl` | `string` | ❌ | Defaults to `Astro.url.href` |
| `type` | `'website' \| 'music.song' \| 'music.album' \| 'music.playlist'` | ❌ | OG type |
| `structuredData` | `object \| object[]` | ❌ | JSON-LD |
| `noindex` | `boolean` | ❌ | Noindex flag |

**Note:** `og:site_name` is currently hardcoded as `"Sam Paul Toms"` — needs template-ization for new sites.

---

### `HeroBanner.astro`

| | |
|---|---|
| **Type** | Astro component |
| **Directive** | N/A (inline `<script>`) |
| **File** | `src/components/HeroBanner.astro` |
| **Description** | Fixed-position hero banner with scroll-driven parallax. Uses CSS `aspect-[16/5]` (mobile) / `aspect-[27/9]` (desktop). Scroll handler fades opacity (1→0) and shrinks scale (1.1→1.0) over ~300px with cubic ease-out. Post-scroll inertia via lerp-based RAF loop. Uses `.hero-top-fade` and `.hero-bottom-fade` gradient overlays. |

**Props:** None

---

### `CompactBio.astro`

| | |
|---|---|
| **Type** | Astro component |
| **Directive** | N/A (inline `<script>`) |
| **File** | `src/components/CompactBio.astro` |
| **Description** | Condensed bio section with summary text and "Read more" button. Clicking "Read more" dispatches `about-modal:open` event via `openAboutModal()` from `about-modal-events.ts`. Accepts a default `<slot>` for additional content (e.g., `SocialLinksBar`). |

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `summary` | `string` | ✅ | Short bio summary text |

---

### `SocialLinksBar.astro`

| | |
|---|---|
| **Type** | Astro component |
| **Directive** | N/A (inline `<script>`) |
| **File** | `src/components/SocialLinksBar.astro` |
| **Description** | "Play All" toggle button + social/streaming icon links. The play button reactively syncs with the audio player state via Preact `effect()`, swapping between play/pause icons. Social links are conditionally rendered based on `PUBLIC_SOCIAL_*` env vars. Also renders a "Contact" button that dispatches `contact-modal:open`. |

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `allTracksJson` | `string` | ✅ | Pre-serialized JSON string of `Track[]` objects |

---

### `PlaylistAccordion.tsx`

| | |
|---|---|
| **Type** | Preact island |
| **Directive** | `client:load` |
| **File** | `src/components/PlaylistAccordion.tsx` |
| **Description** | Interactive accordion with collapsible sections. All sections open by default. Track clicks dispatch `audio-player:play` with the global track index across all sections. Uses `isTrackCurrentlyPlaying()` to prevent restarting an already-playing track. Imports `TrackRow` for each track. |

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `sections` | `PlaylistSection[]` | ✅ | Section display data (title, slug, description, optional `credit?: string` free-text credit line rendered under the section title, tracks). Each track element also carries an optional per-track `credit?: string` free-text authorship line rendered as a muted line below the track's `subtitle` inside `TrackRow`. |
| `playableTracksMap` | `Record<string, PlayableTrack[]>` | ✅ | Map from section slug to playable Track objects |
| `allTracks` | `PlayableTrack[]` | ✅ | Concatenated track list across all sections |

---

### `TrackRow.tsx`

| | |
|---|---|
| **Type** | Preact component (child of PlaylistAccordion) |
| **Directive** | Inherited from parent |
| **File** | `src/components/TrackRow.tsx` |
| **Description** | Single track row with category icon, title/subtitle, mini SVG waveform, and duration. Creates an independent `SvgWaveformInstance` per row. Fetches peak data from static JSON. Progress synced reactively via `effect()`. Shows play/pause overlay on the currently active track. |

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `track` | `{ title: string; subtitle?: string; credit?: string; duration: string; icon: string }` | ✅ | Display track data (optional `credit` renders as a muted line below the `subtitle`) |
| `audioUrl` | `string` | ❌ | Resolved audio URL (for waveform) |
| `trackId` | `string` | ❌ | Track ID (for active state detection) |
| `onPlay` | `() => void` | ✅ | Click handler to trigger playback |

---

### `MediaCarousel.tsx`

| | |
|---|---|
| **Type** | Preact island |
| **Directive** | `client:visible` |
| **File** | `src/components/MediaCarousel.tsx` |
| **Description** | Infinite-swipeable media carousel. Clone-based infinite scroll with spacers for smooth wrapping. Supports image, video (YouTube), and Instagram types. Touch/drag scrolls freely. Keyboard navigation (arrow keys). Polaroid frame overlays cycled from `public/images/carousel/`. |

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `items` | `GalleryItem[]` | ✅ | Gallery items from the collection |

---

### `ProjectGrid.astro`

| | |
|---|---|
| **Type** | Astro component |
| **Directive** | N/A (inline `<script>`) |
| **File** | `src/components/ProjectGrid.astro` |
| **Description** | Responsive grid of project cards (1/2/3 columns). Sorted by `publishDate` descending. Each card dispatches `project-modal:open` via `openProjectModal()`. Project data is serialized in hidden `<script type="application/json">` tags. Uses `.card` and `.artwork-container` classes. |

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `projects` | `Project[]` | ✅ | Project data objects |

---

### `ProjectModal.tsx`

| | |
|---|---|
| **Type** | Preact island |
| **Directive** | `client:load` |
| **File** | `src/components/ProjectModal.tsx` |
| **Description** | Globally mounted modal for project detail views. Listens for `project-modal:open`/`project-modal:close` events. Features fade animation, click-outside-to-close, escape key, focus trap, body scroll lock. Displays the project image beside the title and summary in a two-column row (mirrors the AboutModal bio layout), with the optional YouTube video embedded full-width below. When `videoThumbnails` is provided, renders an accessible thumbnail strip beneath the embed: each thumbnail pairs a poster image with a YouTube URL and, on click, swaps the main embed to that video (`videoStartTime` applies only to the project's main video; each thumbnail may carry its own optional `startTime`). When there is no main `video`, the embed initialises from the first thumbnail. |

**Props:** None (data received via custom event payload of type `ProjectModalData`)

---

### `AboutModal.tsx`

| | |
|---|---|
| **Type** | Preact island |
| **Directive** | `client:load` |
| **File** | `src/components/AboutModal.tsx` |
| **Description** | Globally mounted modal for bio/about content. Listens for `about-modal:open`/`about-modal:close` events. Reads bio HTML from hidden DOM element `#about-bio-content`. Renders photo, bio text, genre tags, and press quotes. Same modal pattern as ContactModal. |

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | ✅ | Bio section title |
| `photo` | `string` | ✅ | Portrait image path |
| `photoAlt` | `string` | ✅ | Portrait alt text |
| `genreTags` | `string[]` | ✅ | Genre tag labels |
| `pressQuotes` | `PressQuote[]` | ✅ | Press quote objects |

---

### `ContactModal.tsx`

| | |
|---|---|
| **Type** | Preact island |
| **Directive** | `client:load` |
| **File** | `src/components/ContactModal.tsx` |
| **Description** | Globally mounted modal for the contact form. Listens for `contact-modal:open`/`contact-modal:close` events. Includes name/email/message fields, honeypot bot trap, optional Cloudflare Turnstile CAPTCHA, and WhatsApp link. Submits to `/api/contact` via fetch. |

**Props:** None (data from env vars and Turnstile API)

---

### `ReleaseCard.astro`

| | |
|---|---|
| **Type** | Astro component |
| **Directive** | N/A |
| **File** | `src/components/ReleaseCard.astro` |
| **Description** | Album artwork card linking to `/releases/[slug]`. Shows artwork, title, artist, release date, and type badge (ALBUM/EP/SINGLE). Uses `.artwork-container` for hover zoom. |

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `release` | `{ id: string; data: { title, artist, credit?, releaseDate, type, artwork } }` | ✅ | Release collection entry |
| `showType` | `boolean` | ❌ | Show type badge (default: `true`) |

---

### `TrackList.astro`

| | |
|---|---|
| **Type** | Astro component |
| **Directive** | N/A (inline `<script>`) |
| **File** | `src/components/TrackList.astro` |
| **Description** | Numbered track listing. Clicking a track dispatches `audio-player:play` with the track's index in the `playableTracks` array. Shows track number, title, streaming indicator icon, and duration. Alternating row backgrounds. |

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `tracks` | `TrackData[]` | ✅ | Track display data from frontmatter |
| `playableTracks` | `PlayableTrack[]` | ❌ | Resolved Track objects for audio dispatch |

---

### `StreamingLinks.astro`

| | |
|---|---|
| **Type** | Astro component |
| **Directive** | N/A |
| **File** | `src/components/StreamingLinks.astro` |
| **Description** | Renders platform icon links (Spotify, Apple Music, YouTube Music, Bandcamp) for a release. Only platforms with URLs are shown. Each link opens in a new tab. |

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `links` | `{ spotify?: string; appleMusic?: string; youtubeMusic?: string; bandcamp?: string }` | ✅ | Streaming URLs |

---

### `YouTubeEmbed.astro`

| | |
|---|---|
| **Type** | Astro component |
| **Directive** | N/A (inline `<script>`) |
| **File** | `src/components/YouTubeEmbed.astro` |
| **Description** | Direct YouTube iframe embed with lazy loading. Extracts the video ID and builds the embed URL via the shared `src/scripts/youtube.ts` helpers (`extractYouTubeId`, `buildYouTubeEmbedUrl`). Uses `?enablejsapi=1` for YouTube audio-pause integration. The embed is wrapped in a `.youtube-embed-wrapper` div. When the optional `videoThumbnails` prop is provided (non-empty), a clickable thumbnail strip renders below the iframe; clicking a thumbnail swaps the main embed to that video without a page reload. The click-to-swap behaviour lives in a top-level Astro-processed inline `<script>` that calls `initYouTubeThumbnails` from `src/scripts/youtube-thumbnails.ts` (a safe no-op when no thumbnail strip is present). **Active consumer:** the homepage showreel section (`src/pages/index.astro`), where it renders bound to the page's `youtubeUrl` constant (`watch?v=xlt63O1YvSM`). The inline `<script>` only bundles when the component is actually rendered on a page. |

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `url` | `string` | ✅ | YouTube video URL |
| `title` | `string` | ❌ | Accessible title (default: `"YouTube video"`) |
| `startTime` | `number` | ❌ | Start position in seconds (appended as YouTube `&start=` param; only applied when positive; applies ONLY to the initial `url`, never to thumbnail videos) |
| `videoThumbnails` | `Array<{ image: string; youtubeUrl: string }>` | ❌ | Optional clickable poster thumbnails rendered below the iframe. Clicking one swaps the main embed to that video (resolved without `startTime`) via the inline `<script>` + `initYouTubeThumbnails`. Omitted/empty = no strip (byte-identical embed). |

---

### `ContactForm.astro`

| | |
|---|---|
| **Type** | Astro component |
| **Directive** | N/A (inline `<script>`) |
| **File** | `src/components/ContactForm.astro` |
| **Description** | Standalone contact form (alternative to `ContactModal`). Includes honeypot field, client-side validation, optional Turnstile widget, and submission to `/api/contact`. This is the Astro-only version; `ContactModal.tsx` duplicates the form in Preact for the modal experience. |

**Props:** None (reads `PUBLIC_TURNSTILE_SITE_KEY` env var directly)

---

### `BioSection.astro`

| | |
|---|---|
| **Type** | Astro component |
| **Directive** | N/A |
| **File** | `src/components/BioSection.astro` |
| **Description** | Two-column layout (photo + text content) for bio display. Accepts a default `<slot>` for body text. |

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `photo` | `string` | ✅ | Portrait image path |
| `photoAlt` | `string` | ✅ | Portrait alt text |
| `title` | `string` | ✅ | Section heading |

---

### Audio Player Components

The audio player is a multi-file Preact module in `src/components/AudioPlayer/`. See [05-audio-player.md](./05-audio-player.md) for full documentation.

| File | Type | Description |
|------|------|-------------|
| `Player.tsx` | Preact island (`client:load`) | Main player bar UI |
| `playlistStore.ts` | Preact signals module | Singleton state store |
| `audioEngine.ts` | TypeScript module | howler.js wrapper |
| `waveformRenderer.ts` | TypeScript module | Thin wrapper around svgWaveform |
| `svgWaveform.ts` | TypeScript module | SVG rect-based waveform renderer |
| `types.ts` | TypeScript types | `Track`, `PlaybackState`, `PlaylistState` |
| `index.ts` | Barrel export | Re-exports types and event constants |
| `Player.css` | CSS | Player bar styles |

---

## Modal Pattern

All modals follow a consistent pattern:

1. **Global mounting:** Modals are mounted in `BaseLayout.astro`'s `<body>` with `client:load`
2. **Custom event driven:** Open/close via custom events dispatched on `document`
3. **Animation:** 200ms opacity fade transition (`transition-opacity duration-200`)
4. **Accessibility:** `role="dialog"`, `aria-modal="true"`, `aria-label`, focus trap, escape key
5. **Body scroll lock:** `document.body.classList.add/remove('overflow-hidden')` (active in all modals)
6. **Layout shift prevention:** `scrollbar-gutter: stable` on `<html>` reserves scrollbar space

### Modal Event Flow

```
Astro component (e.g., CompactBio)          Preact modal (e.g., AboutModal)
       │                                              │
       │  import { openAboutModal }                   │
       │  from 'about-modal-events'                   │
       │                                              │
       ├── openAboutModal() ───────────────────────►  │ document.addEventListener
       │   dispatches CustomEvent                     │ 'about-modal:open'
       │                                              │ → setIsOpen(true)
       │                                              │ → RAF → setIsVisible(true)
       │                                              │
       │                                              │ Close:
       │                                              │ → setIsVisible(false)
       │                                              │ → setTimeout(200ms)
       │                                              │ → setIsOpen(false)
       │                                              │ → restore focus
```

---

## Custom Events System

All inter-component communication uses custom events dispatched on `document`. Each domain has its own events module in `src/scripts/`.

### Audio Player Events (`src/scripts/audio-player-events.ts`)

| Event Name | Detail | Dispatched By | Purpose |
|------------|--------|---------------|---------|
| `audio-player:play` | `{ tracks: Track[], startIndex?: number }` | `SocialLinksBar.astro`, `PlaylistAccordion.tsx`, `TrackList.astro` | Start playing a playlist |
| `audio-player:pause` | None | — | Pause playback |
| `audio-player:add` | `{ track: Track }` | — | Add track to queue |
| `audio-player:seek` | `{ trackId: string, fraction: number }` | `TrackRow.tsx` (waveform click) | Seek to position in track |
| `audio-player:toggle` | None | `SocialLinksBar.astro`, `TrackRow.tsx` (overlay click) | Toggle play/pause |
| `audio-player:fade-pause` | None | `youtube-audio-pause.ts` | Gradually fade out when YouTube plays |

**Helper functions:** `playTracks()`, `pausePlayer()`, `addToQueue()`, `seekPlayer()`, `togglePlayer()`, `fadeAndPausePlayer()`

**Constants exported from `AudioPlayer/index.ts`:**
```typescript
export const AUDIO_PLAYER_EVENTS = {
  PLAY: 'audio-player:play',
  PAUSE: 'audio-player:pause',
  ADD: 'audio-player:add',
  SEEK: 'audio-player:seek',
  FADE_PAUSE: 'audio-player:fade-pause',
} as const;
```

### Contact Modal Events (`src/scripts/contact-modal-events.ts`)

| Event Name | Detail | Dispatched By |
|------------|--------|---------------|
| `contact-modal:open` | None | `SocialLinksBar.astro` |
| `contact-modal:close` | None | — |

**Helper functions:** `openContactModal()`, `closeContactModal()`

### Project Modal Events (`src/scripts/project-modal-events.ts`)

| Event Name | Detail | Dispatched By |
|------------|--------|---------------|
| `project-modal:open` | `ProjectModalData` | `ProjectGrid.astro` |
| `project-modal:close` | None | — |

**Helper functions:** `openProjectModal(data)`, `closeProjectModal()`

**Payload type:**
```typescript
interface ProjectModalData {
  title: string;
  summary: string;
  image: string;
  video?: string;
  videoStartTime?: number;
  videoThumbnails?: Array<{ image: string; youtubeUrl: string; startTime?: number }>;
  dir?: string;
  publishDate: string;
}
```

### About Modal Events (`src/scripts/about-modal-events.ts`)

| Event Name | Detail | Dispatched By |
|------------|--------|---------------|
| `about-modal:open` | None | `CompactBio.astro` |
| `about-modal:close` | None | — |

**Helper functions:** `openAboutModal()`, `closeAboutModal()`
