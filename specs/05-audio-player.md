# 05 — Audio Player

**Last updated:** 2026-06-12

**Purpose:** Documents the four-module audio player architecture, event API, audio URL resolution, waveform generation, and the persistence mechanism.

---

## Architecture Overview

The audio player is a multi-module Preact island composed of four core modules plus a UI component:

```
src/components/AudioPlayer/
├── types.ts              # Track, PlaybackState, PlaylistState types
├── index.ts              # Barrel export: default Player + types + event constants
├── playlistStore.ts      # Preact signals singleton state store
├── audioEngine.ts        # howler.js wrapper (load, play, pause, seek, fade, destroy)
├── waveformRenderer.ts   # Thin wrapper around svgWaveform (init, loadPeaks, setProgress, onSeek)
├── svgWaveform.ts        # SVG <rect>-based waveform renderer (factory function pattern)
├── Player.tsx            # Preact UI component (transport bar)
└── Player.css            # Player bar styles
```

### Module Dependency Graph

```
Player.tsx
├── playlistStore.ts    (reads/writes signals)
├── audioEngine.ts      (calls load, play, pause, seek, setVolume, fadeAndPause)
│   ├── playlistStore.ts  (reads currentTrack via effect())
│   └── howler.js         (external: cross-browser audio)
├── waveformRenderer.ts (calls init, loadPeaks, setProgress, onSeek)
│   └── svgWaveform.ts    (creates SVG <rect> bars)
├── audio-helpers.ts    (getWaveformPeaksUrl)
└── youtube-audio-pause.ts (init/destroy YouTube watcher)
```

---

## Types (`types.ts`)

### `Track`

Represents a single audio track in the playlist.

```typescript
interface Track {
  id: string;           // Unique identifier (e.g., "documentary-0")
  title: string;        // Display title
  artist: string;       // Artist/performer name
  audioUrl: string;     // Full URL to MP3 (resolved via resolveAudioUrl)
  duration?: number;    // Duration in seconds (populated after loading)
  artworkUrl?: string;  // Album artwork thumbnail URL
  icon?: string;        // Category icon key or custom image URL
  subtitle?: string;    // Track subtitle (e.g., production credit)
  credit?: string;      // Free-text per-track credit, rendered below subtitle in now-playing
}
```

### `PlaybackState`

```typescript
type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';
```

### `PlaylistState`

```typescript
interface PlaylistState {
  tracks: Track[];
  currentIndex: number;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  playbackState: PlaybackState;
}
```

### Barrel Export (`index.ts`)

Re-exports the `Player` component as default, plus types and event constants:

```typescript
export { default } from './Player';
export type { Track, PlaybackState, PlaylistState } from './types';

export const AUDIO_PLAYER_EVENTS = {
  PLAY: 'audio-player:play',
  PAUSE: 'audio-player:pause',
  ADD: 'audio-player:add',
  SEEK: 'audio-player:seek',
  FADE_PAUSE: 'audio-player:fade-pause',
} as const;
```

---

## Playlist Store (`playlistStore.ts`)

A module-level singleton store using Preact signals. Signals persist as long as the JS module stays loaded, which is guaranteed even without View Transitions because the persisted DOM retains the Preact component and its imports.

### Signals

| Signal | Type | Default | Description |
|--------|------|---------|-------------|
| `tracks` | `Track[]` | `[]` | Ordered playlist |
| `currentIndex` | `number` | `-1` | Active track index (-1 = none) |
| `isPlaying` | `boolean` | `false` | Whether audio is playing |
| `volume` | `number` | `0.8` | Volume level 0–1 |
| `currentTime` | `number` | `0` | Current playback position (seconds) |
| `duration` | `number` | `0` | Current track duration (seconds) |
| `playbackState` | `PlaybackState` | `'idle'` | Current state |
| `currentTrack` | `Computed<Track \| null>` | — | Derived: `tracks[currentIndex]` |

### Functions

| Function | Description |
|----------|-------------|
| `setPlaylist(newTracks, startIndex?)` | Replace entire playlist and select track |
| `playTrack(index)` | Select and play a specific track |
| `nextTrack()` | Advance to next (wraps around) |
| `prevTrack()` | Go back to previous (wraps around) |
| `clearPlaylist()` | Reset all state to idle |
| `isTrackCurrentlyPlaying(trackId)` | Check if a track is the active, playing track |
| `getState()` | Get a snapshot of the full PlaylistState |

---

## Audio Engine (`audioEngine.ts`)

Wraps howler.js for cross-browser audio playback. Uses a single Howl instance per track.

### Howler Configuration

```typescript
new Howl({
  src: [track.audioUrl],
  html5: true,         // Required for streaming large MP3 files
  volume: volume.peek(),
  preload: true,
  format: ['mp3'],     // MP3 only — no OGG fallback
});
```

### Functions

| Function | Description |
|----------|-------------|
| `load(track)` | Destroy previous Howl, create new one with track URL. Sets `playbackState` to `'loading'`. |
| `play()` | Resume or start playback |
| `pause()` | Pause playback |
| `togglePlay()` | Toggle between play/pause |
| `seek(fraction)` | Seek to position (0–1 fraction of duration) |
| `setVolume(level)` | Set volume (0–1, clamped) |
| `fadeAndPause(fadeDuration?)` | Gradually reduce volume over N steps via `setInterval`, then pause and restore volume to stored preference |
| `initReactiveSubscription()` | Sets up Preact `effect()` to auto-load/play when `currentTrack` changes |
| `destroy()` | Full cleanup: cancel fade, stop time tracking, unload Howl, dispose effect |

### Time Tracking

Playback position is tracked via `requestAnimationFrame`:

1. `startTimeTracking()` — starts a RAF loop that reads `howl.seek()` and updates `currentTime` signal
2. `stopTimeTracking()` — cancels the RAF loop
3. Started on `onplay` callback, stopped on `onpause`/`onstop`/`onend`

### Reactive Subscription

`initReactiveSubscription()` uses Preact `effect()` to watch the `currentTrack` computed signal:

```typescript
trackEffectDispose = effect(() => {
  const track = currentTrack.value;
  if (track) {
    load(track);
    play();
  }
});
```

When the playlist advances (via `nextTrack()`, `prevTrack()`, `playTrack()`, or `setPlaylist()`), `currentTrack` changes, the effect fires, and the engine automatically loads and plays the new track.

### `fadeAndPause()` Method

Used by the YouTube audio-pause integration to avoid jarring audio cutoff:

1. Cancels any in-progress fade
2. Divides `fadeDuration` (default 500ms) into 20 steps via `setInterval`
3. Gradually reduces Howler volume from `startVolume` to 0 over the steps
4. On completion: pauses Howler, then restores volume to `volume.peek()` (stored preference)
5. **Does NOT modify the `volume` signal** — the user's slider position is preserved

---

## Waveform Renderer

### `waveformRenderer.ts`

Thin wrapper providing the API shape that `Player.tsx` expects:

| Function | Description |
|----------|-------------|
| `init(container, options?)` | Create SVG waveform instance in container |
| `loadPeaks(peaks)` | Load pre-computed peak data (200 values, 0–1) |
| `loadAudio(url)` | **Deprecated** — no-op, kept for API compatibility |
| `setProgress(fraction)` | Update visual playhead position (0–1) |
| `onSeek(callback)` | Register seek handler, returns unsubscribe function |
| `destroy()` | Clean up SVG and event listeners |

### `svgWaveform.ts`

Factory function `createSvgWaveform(container, options?)` that creates independent SVG waveform instances. Each instance manages its own SVG element, peak data, and event listeners.

**Configuration options:**

| Option | Default | Description |
|--------|---------|-------------|
| `height` | `40` | SVG height in pixels |
| `waveColor` | `'#6b7280'` | Unplayed bar color (gray-500) |
| `progressColor` | Resolved from accent color | Played bar color |
| `barWidth` | `2` | Bar width in pixels |
| `barGap` | `1` | Gap between bars |
| `barRadius` | `2` | Bar border radius |

**Rendering:** Creates SVG `<rect>` elements for each peak value. Progress is shown by changing the `fill` attribute on bars below the playhead position.

**Interaction:** Supports click and drag (via `mousedown` and `mousemove` with `buttons > 0` check) for seeking.

---

## Audio URL Resolution

Audio files are served from Cloudflare R2 (not from Astro's `public/` directory). The resolution flow:

### 1. Frontmatter → `audioFile` field

Content frontmatter stores relative paths:
```yaml
audioFile: releases/midnight-sessions/01-dusk.mp3
```

### 2. `resolveAudioUrl()` in `audio-helpers.ts`

Prepends the `R2_PUBLIC_URL` environment variable:

```typescript
function resolveAudioUrl(audioFile: string): string {
  if (audioFile.startsWith('http')) return audioFile;
  const base = getR2PublicUrl().replace(/\/$/, '');
  return `${base}/${audioFile}`;
}
```

### 3. `buildTrackFromContent()` in `audio-helpers.ts`

Combines frontmatter track data into a full `Track` object:

```typescript
function buildTrackFromContent(
  trackData, releaseSlug, trackIndex, artist, artworkUrl
): Track
```

- Generates `id` as `${releaseSlug}-${trackIndex}`
- Resolves `audioUrl` via `resolveAudioUrl()`
- Passes through `icon`, `subtitle`, and `credit`

### 4. Howler receives the URL

The resolved URL is passed directly to Howler with `format: ['mp3']` and `html5: true` for streaming. **There is no OGG fallback — MP3 only.**

---

## Waveform Generation

### Build Time: `npm run generate:waveforms`

The `scripts/generate-waveforms.cjs` script:

1. Reads all content collections (releases, works)
2. For each track with an `audioFile`, downloads the MP3 from `R2_PUBLIC_URL`
3. Decodes audio using ffmpeg to get raw PCM samples
4. Computes ~200 peak values (normalized 0–1)
5. Writes JSON to `public/waveforms/{relative-path}.json`

Example output: `public/waveforms/works/documentary/A Life on the Farm - A Worldwide Sensation.json`

```json
{ "peaks": [0.12, 0.45, 0.78, ...] }
```

### Runtime: `getWaveformPeaksUrl()` in `audio-helpers.ts`

Derives the waveform JSON path from the audio URL by finding the content directory segment:

```typescript
function getWaveformPeaksUrl(audioUrl: string): string {
  const contentDirs = ['works/', 'releases/'];
  // Finds "/works/" or "/releases/" in the URL pathname
  // Extracts everything after that segment
  // Replaces .mp3 extension with .json
  // Returns "/waveforms/{relative-path}.json"
}
```

This works across all environments:
- Production: `https://pub-xxx.r2.dev/works/documentary/01.mp3` → `/waveforms/works/documentary/01.json`
- Dev (wrangler): `http://localhost:4321/r2/works/documentary/01.mp3` → `/waveforms/works/documentary/01.json`
- Dev (local): `http://localhost:4321/audio-samples/works/documentary/01.mp3` → `/waveforms/works/documentary/01.json`

---

## `transition:persist` Pattern

The audio player is wrapped in a `transition:persist` directive in `BaseLayout.astro`:

```astro
<div transition:persist="audio-player" class="fixed bottom-0 z-50">
  <Player client:load />
</div>
```

**Current state:** `<ClientRouter />` is not configured, so all navigations are full page reloads and `transition:persist` has no effect. The player state persists because `playlistStore.ts` uses module-level Preact signals that survive as long as the JS module stays in memory. When `<ClientRouter />` is eventually added, the player DOM will persist across navigations without resetting.

---

## Player UI (`Player.tsx`)

The main player bar is a fixed-bottom Preact component with:

- **Track info** (left): Category icon, title, subtitle, and an optional muted credit line
- **Transport controls** (center): Previous, play/pause, next
- **Current time** display
- **Waveform** (flexible center): SVG waveform with seek-on-click
- **Total time** display
- **Volume** (right): Range slider + mute/unmute icon

### Event Listener Registration

`Player.tsx` registers listeners for all six audio player events in a `useEffect`:

```typescript
document.addEventListener('audio-player:play', handlePlay);
document.addEventListener('audio-player:pause', handlePause);
document.addEventListener('audio-player:add', handleAdd);
document.addEventListener('audio-player:seek', handleSeek);
document.addEventListener('audio-player:toggle', handleToggle);
document.addEventListener('audio-player:fade-pause', handleFadePause);
```

### Lifecycle

1. **Mount:** `initReactiveSubscription()` + `initYouTubeWatcher()` + body padding
2. **Track change:** Fetch waveform peaks JSON → `loadPeaks()` → start progress RAF
3. **Unmount:** `destroyYouTubeWatcher()` + `audioEngine.destroy()` + `waveformRenderer.destroy()` + remove body padding

---

## Custom Events API

Full API from `src/scripts/audio-player-events.ts`:

| Function | Event | Detail | Description |
|----------|-------|--------|-------------|
| `playTracks(tracks, startIndex?)` | `audio-player:play` | `{ tracks: Track[], startIndex?: number }` | Load playlist and play |
| `pausePlayer()` | `audio-player:pause` | — | Pause playback |
| `addToQueue(track)` | `audio-player:add` | `{ track: Track }` | Append to playlist |
| `seekPlayer(trackId, fraction)` | `audio-player:seek` | `{ trackId: string, fraction: number }` | Seek within track |
| `togglePlayer()` | `audio-player:toggle` | — | Toggle play/pause |
| `fadeAndPausePlayer()` | `audio-player:fade-pause` | — | Smooth fade-out then pause |

### YouTube Audio-Pause Integration

`src/scripts/youtube-audio-pause.ts`:

1. Lazy-loads YouTube IFrame API
2. Scans for YouTube embed iframes (existing + dynamically added via MutationObserver)
3. Attaches `YT.Player` to each iframe
4. On `YT.PlayerState.PLAYING` → calls `fadeAndPausePlayer()`
5. This smoothly fades the background music when a YouTube video starts playing
