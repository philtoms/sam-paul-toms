# Sam — Music Portfolio

A music portfolio website for Sam, built with modern web technologies. Dark-themed, responsive, and designed to showcase music releases with an integrated audio player.

## Tech Stack

- **[Astro 5](https://astro.build)** — Static site framework with islands architecture
- **[Preact](https://preactjs.com)** — Lightweight reactive UI for interactive components
- **[Tailwind CSS v4](https://tailwindcss.com)** — Utility-first CSS with CSS-first configuration (`@theme` block)
- **[Cloudflare Pages](https://pages.cloudflare.com)** — Deployment platform with server-side rendering
- **[howler.js](https://howlerjs.com)** — Cross-browser audio engine with format fallback
- **[wavesurfer.js v7](https://wavesurfer.xyz)** — Audio waveform visualization
- **TypeScript (strict)** — Type-safe development

## Quick Start

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:4321`.

## Scripts

| Command             | Description                        |
| ------------------- | ---------------------------------- |
| `npm run dev`       | Start Astro dev server             |
| `npm run build`     | Build for production               |
| `npm run preview`   | Preview production build locally   |
| `npm run lint`      | Run ESLint on source files         |
| `npm run format`    | Format all files with Prettier     |
| `npm run test`      | Run tests with Vitest              |
| `npm run test:watch`| Run tests in watch mode            |

## Directory Structure

```
sam/
├── public/             # Static assets (favicon, images)
├── src/
│   ├── components/     # Reusable UI components
│   │   └── AudioPlayer/ # Persistent audio player (Preact island)
│   ├── content/        # Astro content collections
│   │   ├── about/      # About/bio page content
│   │   └── releases/   # Release markdown files
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

3. **Waveform Renderer** (`waveformRenderer.ts`) — Wraps wavesurfer.js v7 for waveform visualization. Audio output is muted so howler.js is the sole audio source. Visual progress is synced via RAF loop.

The player uses `transition:persist` in the layout to survive Astro View Transitions without destroying the component or interrupting playback.

### Custom Events API

Pages and components can control the player via custom events (no framework coupling):

```typescript
import { playTracks, pausePlayer, addToQueue } from '../scripts/audio-player-events';

// Start playing a playlist
playTracks([
  { id: '1', title: 'Song A', artist: 'Sam', audioUrl: '/audio/song-a.mp3' },
  { id: '2', title: 'Song B', artist: 'Sam', audioUrl: '/audio/song-b.mp3' },
], 0); // startIndex

// Pause playback
pausePlayer();

// Add a track to the queue
addToQueue({ id: '3', title: 'Song C', artist: 'Sam', audioUrl: '/audio/song-c.mp3' });
```

### Environment Variable

- `R2_PUBLIC_URL` — Base URL for Cloudflare R2 object storage. Audio URLs are constructed as `${R2_PUBLIC_URL}/${track-relative-path}`. For local development with Wrangler's R2 emulation, use `http://localhost:8788/r2`.

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `R2_PUBLIC_URL` — Base URL for Cloudflare R2 object storage (audio files, artwork)

## About Page

The `/about` page showcases Sam's artist identity with a bio section, genre tags, press quotes, and a contact form. Content is managed through the `about` Astro content collection.

### Content Collection: `about`

The about collection is defined in `src/content/config.ts` and uses Markdown files in `src/content/about/`.

**Frontmatter fields:**

| Field         | Type                                       | Description                                |
| ------------- | ------------------------------------------ | ------------------------------------------ |
| `title`       | `string`                                   | Page heading (e.g. "About Sam")            |
| `photo`       | `string`                                   | Path to bio photo (e.g. `/images/bio/...`) |
| `photoAlt`    | `string`                                   | Alt text for the photo                     |
| `genreTags`   | `string[]`                                 | Genre badge labels                         |
| `pressQuotes` | `Array<{ text, source, url? }>`            | Press/review quotes with attribution       |
| `contactEmail`| `string?` (optional)                       | Reference only; not used in frontend       |

The Markdown body contains the bio text (rendered as HTML).

### Editing the Bio

Edit `src/content/about/bio.md` to update any content:

- **Bio text:** Edit the Markdown body below the frontmatter
- **Genre tags:** Add/remove entries in the `genreTags` array
- **Press quotes:** Add/remove entries in the `pressQuotes` array (each needs `text` and `source`; `url` is optional)
- **Photo:** Update the `photo` path and place the image in `public/images/bio/`

### Contact Form

The contact form (`src/components/ContactForm.astro`) is currently **frontend-only** — it has client-side validation but no backend submission handler. Actual email delivery (via Cloudflare Worker, Formspree, Resend, etc.) will be wired up in a future task.

## Design System

The visual design system is defined in `src/styles/global.css` using Tailwind v4's CSS-first `@theme` block. All components consume these design tokens for consistent visual output.

### Color Palette

**Background layers** (near-black with subtle warmth):
| Token                  | Value                     | Purpose                            |
| ---------------------- | ------------------------- | ---------------------------------- |
| `--color-bg`           | `#0a0a0a`                 | Page background                    |
| `--color-bg-elevated`  | `#141414`                 | Cards, panels, elevated surfaces   |
| `--color-bg-overlay`   | `#1a1a1a`                 | Overlays, modals, dropdowns        |

**Text hierarchy:**
| Token                    | Value     | Purpose              |
| ------------------------ | --------- | -------------------- |
| `--color-text`           | `#f5f5f5` | Primary text         |
| `--color-text-secondary` | `#a3a3a3` | Muted/secondary text |
| `--color-text-tertiary`  | `#737373` | Disabled/hint text   |

**Accent (purple-violet, music-forward):**
| Token                | Value     | Purpose              |
| -------------------- | --------- | -------------------- |
| `--color-accent`     | `#8b5cf6` | Primary accent       |
| `--color-accent-hover` | `#a78bfa` | Hover state accent  |

**Semantic colors:** `--color-success` (#22c55e), `--color-error` (#ef4444), `--color-warning` (#f59e0b)

**Borders:** `--color-border` (#262626), `--color-border-subtle` (#1f1f1f)

### Typography

**Font:** Inter variable font (weights 100–900) loaded via Google Fonts CDN. Serves both display and body roles.

**Heading classes:**
- `.heading-1` — 4xl (36px) / 5xl (48px) on md+, weight 800, tight leading
- `.heading-2` — 2xl (24px), weight 700
- `.heading-3` — xl (20px), weight 600

**Font size scale:** `--text-xs` (12px) through `--text-6xl` (60px) in rem-based steps.

### Spacing

Explicit `--space-*` scale: `--space-1` (0.25rem) through `--space-24` (6rem). Use Tailwind's default spacing utilities (`p-4`, `gap-6`) in templates; the CSS variables are available for custom components.

### Animations

Five keyframe animations with corresponding `--animate-*` tokens:

| Keyframe       | Token                   | Usage                          |
| --------------- | ----------------------- | ------------------------------ |
| `artwork-zoom`  | `--animate-artwork-zoom` | Album art hover zoom (0.3s)   |
| `play-pulse`    | `--animate-play-pulse`  | Play button pulse (1.5s loop) |
| `fade-in-up`    | `--animate-fade-in-up`  | Page section entrance (0.5s)  |
| `shimmer`       | `--animate-shimmer`     | Loading placeholder (2s loop) |
| `spin`          | `--animate-spin`        | Loading spinner (1s loop)      |

### Reusable CSS Classes

| Class                | Purpose                                        |
| -------------------- | ---------------------------------------------- |
| `.card`              | Elevated card with border, hover scale + shadow |
| `.artwork-container` | Square aspect-ratio container with hover zoom  |
| `.pill`              | Badge/tag with hover accent effect             |
| `.section`           | Consistent vertical padding (py-16 equivalent) |
| `.container`         | Max-width 1280px with responsive horizontal padding |

### How to Use Design Tokens

**In CSS / Astro styles:**
```css
background-color: var(--color-bg-elevated);
border: 1px solid var(--color-border);
```

**In templates (Tailwind utilities):**
```html
<div class="bg-bg text-text border border-border">
  <span class="text-text-secondary">Muted text</span>
</div>
```

### Responsive Approach

Mobile-first. Use Tailwind's built-in breakpoints:
- `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px), `2xl:` (1536px)

No light mode theme or toggle in v1 — dark-mode-only.

## Background

See [`docs/initial-research.md`](docs/initial-research.md) for the full research report on platform comparison, design trends, and technology choices.
