# Task: KB-003 - Persistent Audio Player with Waveform Visualization

**Created:** 2026-05-19
**Size:** L

## Review Level: 3 (Full)

**Assessment:** This task introduces client-side framework integration (Preact), complex third-party library integration (wavesurfer.js + howler.js), View Transitions persistence, and global state management. The interplay between three audio-related libraries and Astro's transition system carries high integration risk requiring full review.
**Score:** 7/8 — Blast radius: 2, Pattern novelty: 2, Security: 1, Reversibility: 2

## Mission

Build a persistent sticky-bottom audio player bar that continues playing across Astro page navigations using View Transitions. The player uses howler.js as the cross-browser audio engine (with MP3/OGG format fallback) and wavesurfer.js v7 for waveform visualization. Preact provides the reactive UI layer as an Astro island. The player is the centrepiece interactive feature of the site — it must feel seamless during navigation and handle real audio playback robustly.

## Dependencies

- **Task:** KB-002 (Project Scaffolding) — must be complete. This task assumes:
  - Astro 5 project exists in `~/dev/sam` with `package.json`, `astro.config.mjs`, `tsconfig.json`
  - Tailwind CSS v4 configured via `@tailwindcss/vite` (CSS-first, `@theme` block in `src/styles/global.css`)
  - `src/layouts/BaseLayout.astro` exists and is the shared page layout
  - `src/components/` directory exists
  - `.env.example` exists with `R2_PUBLIC_URL=http://localhost:8788/r2`
  - Dark theme colors defined: `--color-bg: #0a0a0a`, `--color-text: #f5f5f5`, `--color-accent: #8b5cf6`
  - Content collection `releases` schema exists in `src/content/config.ts`

## Context to Read First

- `docs/initial-research.md` — Sections 2 (audio player features), 5 (wavesurfer.js, howler.js recommendations)
- `docs/implementation-plan.md` — Tech stack table, dependency graph
- `astro.config.mjs` — current Vite/plugin configuration (need to add Preact integration)
- `src/layouts/BaseLayout.astro` — where the player gets mounted and ViewTransitions gets added
- `src/styles/global.css` — existing Tailwind v4 theme variables to reuse
- `src/content/config.ts` — releases collection schema (track structure for playlist data)
- `.env.example` — existing `R2_PUBLIC_URL` entry

## File Scope

### New Files

- `src/components/AudioPlayer/types.ts`
- `src/components/AudioPlayer/playlistStore.ts`
- `src/components/AudioPlayer/audioEngine.ts`
- `src/components/AudioPlayer/waveformRenderer.ts`
- `src/components/AudioPlayer/Player.tsx`
- `src/components/AudioPlayer/Player.css`
- `src/components/AudioPlayer/index.ts`
- `src/scripts/audio-player-events.ts` — custom event types for page→player communication
- `tests/audio-player/playlistStore.test.ts`
- `tests/audio-player/audioEngine.test.ts`
- `tests/audio-player/Player.test.tsx`
- `vitest.config.ts`

### Modified Files

- `package.json` — add dependencies and test scripts
- `astro.config.mjs` — add Preact integration
- `src/layouts/BaseLayout.astro` — add `<ViewTransitions />`, mount player bar
- `.env.example` — ensure `R2_PUBLIC_URL` documentation is complete

## Steps

### Step 0: Preflight

- [ ] `~/dev/sam` is a git repository with KB-002 completed (Astro project builds successfully)
- [ ] `src/layouts/BaseLayout.astro` exists
- [ ] `src/components/` directory exists
- [ ] `.env.example` contains `R2_PUBLIC_URL`
- [ ] Node.js ≥ 18 is available

### Step 1: Install Dependencies and Configure Integrations

- [ ] Install runtime dependencies: `preact`, `@astrojs/preact`, `wavesurfer.js` (v7), `howler`
- [ ] Install type definitions: `@types/howler` (if available; howler ships its own types in v2)
- [ ] Install dev/test dependencies: `vitest`, `@testing-library/preact`, `jsdom`
- [ ] Add Preact integration to `astro.config.mjs`: import `preact` from `@astrojs/preact` and add to the `integrations` array (before any other integrations that might process JSX/TSX)
- [ ] Create `vitest.config.ts` with `test.environment: 'jsdom'`, `test.globals: true`, `test.setupFiles` if needed, and resolve Preact aliases (`react` → `preact/compat` if using compat, or just alias JSX to Preact)
- [ ] Add `"test": "vitest run"` and `"test:watch": "vitest"` scripts to `package.json`
- [ ] Verify `npm run build` still passes after integration changes

**Artifacts:**
- `package.json` (modified)
- `astro.config.mjs` (modified)
- `vitest.config.ts` (new)

### Step 2: Core Types and Playlist Store

- [ ] Create `src/components/AudioPlayer/types.ts` defining:
  - `Track` interface: `{ id: string; title: string; artist: string; audioUrl: string; duration?: number; artworkUrl?: string; }`
  - `PlaybackState` type: `'idle' | 'loading' | 'playing' | 'paused' | 'error'`
  - `PlaylistState` interface describing the full store shape
- [ ] Create `src/components/AudioPlayer/playlistStore.ts` using Preact signals (`@preact/signals` — included with `preact`):
  - Signals: `tracks` (Track[]), `currentIndex` (number, -1 = none), `isPlaying` (boolean), `volume` (number 0–1, default 0.8), `currentTime` (seconds), `duration` (seconds), `playbackState` (PlaybackState)
  - Computed: `currentTrack` (Track | null derived from tracks + currentIndex)
  - Actions: `setPlaylist(tracks, startIndex)`, `playTrack(index)`, `nextTrack()`, `prevTrack()`, `clearPlaylist()`
  - The store is a **module-level singleton** — signals persist as long as the JS module stays loaded, which is guaranteed across View Transitions since the persisted DOM retains the Preact component and its imports
- [ ] Write `tests/audio-player/playlistStore.test.ts`: test `setPlaylist` sets tracks and currentIndex, `nextTrack`/`prevTrack` cycle correctly (wrap at boundaries), `currentTrack` computed returns correct track or null, initial state is idle with empty tracks
- [ ] Run `npx vitest run tests/audio-player/playlistStore.test.ts` — all tests pass

**Artifacts:**
- `src/components/AudioPlayer/types.ts` (new)
- `src/components/AudioPlayer/playlistStore.ts` (new)
- `tests/audio-player/playlistStore.test.ts` (new)

### Step 3: Audio Engine (howler.js Wrapper)

- [ ] Create `src/components/AudioPlayer/audioEngine.ts` as a class or module encapsulating howler.js:
  - `load(track: Track)` — destroys previous Howl instance, creates new `Howl` with `src: [oggUrl, mp3Url]` (format fallback: construct OGG URL by replacing `.mp3` with `.ogg`, provide MP3 as fallback), `html5: true` (for streaming large files), `volume` from store, `preload: true`
  - `play()`, `pause()`, `togglePlay()` — delegate to Howl, update `isPlaying` signal
  - `seek(fraction: number)` — seek to fraction (0–1) of duration, update `currentTime` signal
  - `setVolume(level: number)` — update Howl volume and `volume` signal
  - `destroy()` — unload Howl, reset state signals
  - Time tracking: start a `requestAnimationFrame` loop when playing that reads `howl.seek()` and updates `currentTime` signal; stop the loop on pause/end/destroy
  - Event handlers: `on('end')` triggers `nextTrack()` from playlistStore; `on('loaderror')` sets `playbackState` to `'error'`; `on('load')` sets duration signal and `playbackState` to `'paused'`
  - Subscribe to playlist store: when `currentIndex` signal changes (via `effect()` from `@preact/signals`), call `load(currentTrack)` and auto-play
- [ ] Write `tests/audio-player/audioEngine.test.ts`: mock `howler.js` (Howl constructor and methods), test that `load` creates Howl with correct src array (OGG first, MP3 fallback), test `play`/`pause` toggle, test seek updates store signals, test `on('end')` triggers next track, test `destroy` unloads Howl and resets state
- [ ] Run `npx vitest run tests/audio-player/audioEngine.test.ts` — all tests pass

**Artifacts:**
- `src/components/AudioPlayer/audioEngine.ts` (new)
- `tests/audio-player/audioEngine.test.ts` (new)

### Step 4: Waveform Renderer (wavesurfer.js Wrapper)

- [ ] Create `src/components/AudioPlayer/waveformRenderer.ts` as a module encapsulating wavesurfer.js v7:
  - `init(container: HTMLElement, options?: Partial<WaveSurferOptions>)` — create WaveSurfer instance with config: `container`, `height: 48`, `waveColor: '#6b7280'` (gray-500), `progressColor: 'var(--color-accent)'` (#8b5cf6), `cursorColor: '#f5f5f5'`, `barWidth: 2`, `barGap: 1`, `barRadius: 2`, `responsive: true`, `interact: true`
  - `loadAudio(url: string)` — load audio into wavesurfer for waveform decoding and rendering; **mute wavesurfer's audio output** via `ws.setVolume(0)` so howler.js is the sole audio source (avoids double-playback)
  - `setProgress(fraction: number)` — update visual progress bar without triggering audio playback in wavesurfer (use `ws.seekTo(fraction)` — since volume is 0, this only updates the visual)
  - `onSeek(callback: (fraction: number) => void)` — register callback when user clicks/drags on waveform, returns unsubscribe function; the callback should call `audioEngine.seek(fraction)` to seek howler.js
  - `destroy()` — clean up wavesurfer instance
- [ ] The sync loop lives in the Player component (Step 5): a `requestAnimationFrame` loop reads `currentTime` / `duration` from the store and calls `waveformRenderer.setProgress(currentTime / duration)`
- [ ] Write tests for waveformRenderer: mock WaveSurfer (test that `init` creates instance with correct options, `loadAudio` calls `ws.load` and `ws.setVolume(0)`, `setProgress` calls `ws.seekTo`, `destroy` calls `ws.destroy`)
- [ ] Run waveform renderer tests — all pass

**Artifacts:**
- `src/components/AudioPlayer/waveformRenderer.ts` (new)

### Step 5: Player UI Component (Preact)

- [ ] Create `src/components/AudioPlayer/Player.tsx` as the main Preact component:
  - **Imports:** signals from `playlistStore`, hooks to `audioEngine` and `waveformRenderer`
  - **Refs:** `waveformContainerRef` for the wavesurfer DOM element
  - **Layout (top to bottom of the bar):**
    1. **Waveform area:** `<div ref={waveformContainerRef}>` — wavesurfer.js renders here; full width of the bar, 48px tall
    2. **Controls row (flex, centered):**
       - Track info (left): artwork thumbnail (32×32 rounded), track title, artist name — truncated with ellipsis if too long
       - Transport controls (center): `|◀` prev, `▶ / ❚❚` play/pause, `▶|` next — buttons with `aria-label` for accessibility
       - Volume (right): volume icon (🔊/🔈 based on level) + range input slider
    3. **Progress bar fallback:** a thin `<progress>` element below the waveform as a fallback/secondary indicator showing `currentTime / duration`
  - **Effects (useEffect):**
    - On mount: initialize `audioEngine` and `waveformRenderer`
    - On `currentTrack` change: call `waveformRenderer.loadAudio(track.audioUrl)`, `audioEngine.load(track)` (which auto-plays)
    - Sync loop: `requestAnimationFrame` that updates waveform progress from store's `currentTime`/`duration`
    - Listen for custom events on `document`: `'audio-player:play'` (detail: `{ tracks: Track[], startIndex: number }`) → calls `setPlaylist(tracks, startIndex)` — this is how other pages trigger playback
    - On unmount: clean up audioEngine and waveformRenderer, cancel animation frame
  - **Conditional rendering:** when `playbackState` is `'idle'` and no currentTrack, show a minimal collapsed bar (thin strip, ~8px) or hide entirely; when a track is loaded, expand to full height (~80px total)
- [ ] Create `src/components/AudioPlayer/Player.css` with styles for the sticky bottom bar:
  - `.audio-player-bar`: `position: fixed; bottom: 0; left: 0; right: 0; z-index: 50; background: rgba(10, 10, 10, 0.95); backdrop-filter: blur(12px); border-top: 1px solid rgba(255, 255, 255, 0.1); padding: 0 1rem; transition: height 0.3s ease;`
  - `.audio-player-controls`: `display: flex; align-items: center; justify-content: space-between; height: 56px; gap: 1rem;`
  - `.audio-player-track-info`: `display: flex; align-items: center; gap: 0.75rem; min-width: 0; flex: 1;` (text truncation via `overflow: hidden; text-overflow: ellipsis; white-space: nowrap`)
  - `.audio-player-transport`: `display: flex; align-items: center; gap: 0.5rem;`
  - `.audio-player-volume`: `display: flex; align-items: center; gap: 0.5rem; min-width: 120px; justify-content: flex-end;`
  - Style transport buttons: `background: none; border: none; color: inherit; cursor: pointer; padding: 0.5rem; border-radius: 50;` — hover: `color: var(--color-accent)`
  - Style play button larger than skip buttons (40×40 vs 32×32)
  - Volume slider: custom styled range input (thin track, accent-colored thumb)
  - Waveform container: full width, 48px height
  - Responsive: on mobile (`< 640px`), hide artwork thumbnail, reduce volume to icon-only tap toggle (0 → 0.8 → 0 cycle), keep transport centered
  - Add `padding-bottom` to the `<body>` via a global style or the component's effect to prevent content from being hidden behind the fixed bar (e.g., `body { padding-bottom: 80px; }` when player is expanded)
- [ ] Create `src/components/AudioPlayer/index.ts` barrel: re-export `Player` component as default, export `types` and custom event names
- [ ] Write `tests/audio-player/Player.test.tsx`: render Player with testing-library, verify it renders transport buttons, verify clicking play button toggles `isPlaying` signal, verify track info displays current track title/artist
- [ ] Run `npx vitest run tests/audio-player/Player.test.tsx` — all tests pass

**Artifacts:**
- `src/components/AudioPlayer/Player.tsx` (new)
- `src/components/AudioPlayer/Player.css` (new)
- `src/components/AudioPlayer/index.ts` (new)
- `tests/audio-player/Player.test.tsx` (new)

### Step 6: Custom Event System for Page→Player Communication

- [ ] Create `src/scripts/audio-player-events.ts` defining:
  - Event type constants: `AUDIO_PLAYER_PLAY = 'audio-player:play'`, `AUDIO_PLAYER_PAUSE = 'audio-player:pause'`, `AUDIO_PLAYER_ADD = 'audio-player:add'`
  - Helper functions that pages can import:
    - `playTracks(tracks: Track[], startIndex?: number)` — dispatches `AUDIO_PLAYER_PLAY` custom event on `document`
    - `pausePlayer()` — dispatches `AUDIO_PLAYER_PAUSE`
    - `addToQueue(track: Track)` — dispatches `AUDIO_PLAYER_ADD`
  - TypeScript interfaces for event details
- [ ] This module has zero framework dependencies — it only uses native `CustomEvent` and `document.dispatchEvent`. Any page (Astro `.astro` file, future Preact component in KB-004) can import and call these helpers to control the player without coupling to the player's internal state

**Artifacts:**
- `src/scripts/audio-player-events.ts` (new)

### Step 7: Astro Integration — ViewTransitions and Layout Mount

- [ ] Modify `src/layouts/BaseLayout.astro`:
  - Add `<ViewTransitions />` component to `<head>` (import from `astro:transitions`)
  - Import the Player component: `import Player from '../components/AudioPlayer/Player'`
  - Import `Player.css`: `import '../components/AudioPlayer/Player.css'`
  - Add the player bar at the bottom of `<body>`, after the `<slot />`:
    ```astro
    <div transition:persist="audio-player">
      <Player client:load />
    </div>
    ```
    The `client:load` directive hydrates immediately (essential for audio persistence). The `transition:persist` directive tells Astro's View Transitions to keep this DOM element alive across page navigations — the Preact component is NOT destroyed/recreated, so playback continues seamlessly.
- [ ] Modify `astro.config.mjs` if needed: ensure Preact integration is listed before any other integrations that might process JSX/TSX
- [ ] Update `.env.example`: ensure `R2_PUBLIC_URL` has a comment explaining audio file URL construction:
  ```
  # Cloudflare R2 public URL for audio files
  # Audio URLs are constructed as: ${R2_PUBLIC_URL}/${track-relative-path}
  # Local dev with Wrangler: http://localhost:8788/r2
  # Production: your R2 public bucket URL
  R2_PUBLIC_URL=http://localhost:8788/r2
  ```
- [ ] Verify `npm run build` succeeds with all changes

**Artifacts:**
- `src/layouts/BaseLayout.astro` (modified)
- `.env.example` (modified)

### Step 8: Testing & Verification

> ZERO test failures allowed. Full test suite as quality gate.

- [ ] Run `npx vitest run` — all audio player tests pass
- [ ] Run `npm run build` — Astro build succeeds with zero errors
- [ ] Run `npm run dev` and manually verify in browser (quick smoke test):
  - Player bar appears at bottom of page
  - Player is present and persists when navigating between pages (clicking links)
  - No console errors related to wavesurfer, howler, or View Transitions
- [ ] Fix any test failures or build errors

### Step 9: Documentation & Delivery

- [ ] Update `README.md`: add section about the audio player component, its architecture (Preact + howler.js + wavesurfer.js), how to trigger playback from pages (custom events API), and the `R2_PUBLIC_URL` env variable
- [ ] Add JSDoc comments to all public functions in `audioEngine.ts`, `waveformRenderer.ts`, and `playlistStore.ts`
- [ ] Verify all files in File Scope exist and contain expected content
- [ ] Out-of-scope findings created as new tasks via `task_create` tool (if any)

## Documentation Requirements

**Must Update:**
- `README.md` — add Audio Player section: architecture, custom events API, env variable `R2_PUBLIC_URL`
- `src/components/AudioPlayer/` files — JSDoc on all exported functions and types

**Check If Affected:**
- `src/content/config.ts` — read-only; player's `Track` type should align with the tracks structure in the releases schema but does not need to modify it
- `src/styles/global.css` — player uses its own CSS file but reuses theme variables (`--color-accent`, `--color-bg`, `--color-text`)

## Completion Criteria

- [ ] `npm install` succeeds with new dependencies (preact, wavesurfer.js, howler, vitest)
- [ ] `npm run build` succeeds with zero errors
- [ ] `npx vitest run` — all tests pass (playlistStore, audioEngine, Player component)
- [ ] `astro.config.mjs` includes Preact integration
- [ ] `src/layouts/BaseLayout.astro` includes `<ViewTransitions />` in `<head>` and player bar with `transition:persist` in `<body>`
- [ ] Player bar is sticky at bottom, renders transport controls (prev/play-pause/next), volume slider, track info, and waveform area
- [ ] `transition:persist` is correctly applied so player DOM survives Astro page navigations
- [ ] howler.js handles audio playback with format fallback (OGG → MP3)
- [ ] wavesurfer.js v7 renders waveform visualization, synced to howler's playback position
- [ ] Custom event API (`playTracks`, `pausePlayer`, `addToQueue`) works for page→player communication
- [ ] Player is responsive: works on mobile (collapsed controls, touch-friendly)
- [ ] `.env.example` documents `R2_PUBLIC_URL` with usage notes
- [ ] All exported functions have JSDoc comments
- [ ] README.md documents the audio player architecture and events API

## Git Commit Convention

Commits at step boundaries. All commits include the task ID:

- **Step completion:** `feat(KB-003): complete Step N — description`
- **Bug fixes:** `fix(KB-003): description`
- **Tests:** `test(KB-003): description`

## Do NOT

- Implement release listing pages, track grids, or album art layouts (KB-004)
- Create actual audio content or upload files to R2 (KB-008 covers deployment)
- Implement SEO meta tags or structured data (KB-006)
- Build the design system or dark mode toggle (KB-007)
- Use `@astrojs/tailwind` — project uses Tailwind v4 via `@tailwindcss/vite`
- Add a `tailwind.config.ts` — Tailwind v4 uses CSS `@theme` block
- Implement analytics tracking (KB-009)
- Use React instead of Preact (Preact is lighter and Astro's Preact integration is the recommended lightweight option)
- Store waveform peaks in content collection frontmatter (can be a future optimization; for now, wavesurfer decodes the audio client-side)
- Modify `docs/initial-research.md` or `docs/implementation-plan.md`
- Load audio files from the local filesystem — audio URLs must use the `R2_PUBLIC_URL` environment variable
