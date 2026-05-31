/**
 * TrackRow — A single track row in the playlist accordion.
 *
 * Displays a track with category icon, title/subtitle, live waveform
 * rendered via SVG from pre-computed peak data, and duration.
 * Clicking the row triggers playback via the parent accordion.
 *
 * MiniWaveform approach: Each track row creates its own independent SVG
 * waveform instance via createSvgWaveform(). On mount, it fetches peak
 * data from the static JSON file at /waveforms/{path}.json. Clicking/dragging
 * on the waveform dispatches audio-player:seek when the track is the currently
 * playing track, while the row-level onClick dispatches audio-player:play
 * via the parent accordion. Progress is synced reactively via effect()
 * from @preact/signals, reading currentTime/duration to update the visual
 * playhead position. Instances are created on mount and destroyed on unmount
 * via useEffect cleanup.
 */

import { useRef, useEffect } from 'preact/hooks';
import { effect } from '@preact/signals';
import { createSvgWaveform, type SvgWaveformInstance } from './AudioPlayer/svgWaveform';
import {
  currentTrack,
  currentTime,
  duration,
} from './AudioPlayer/playlistStore';
import { seekPlayer } from '../scripts/audio-player-events';
import { getAccentHoverColor } from '../scripts/accent-color';
import { getWaveformPeaksUrl } from '../scripts/audio-helpers';

interface TrackRowProps {
  track: {
    title: string;
    subtitle?: string;
    duration: string;
    icon: string;
  };
  audioUrl?: string;
  trackId?: string;
  onPlay: () => void;
}

/** Check whether a string is an HTTP(S) URL (used for custom icon images) */
function isUrlIcon(value: string): boolean {
  return (
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('images')
  );
}

/** Generate placeholder peaks (uniform 50% height) for loading state. */
function getPlaceholderPeaks(count: number = 200): number[] {
  return Array(count).fill(0.5);
}

/** Icon lookup by category type */
const icons: Record<string, JSX.Element> = {
  music: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="w-5 h-5"
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
  film: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="w-5 h-5"
    >
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
      <line x1="7" y1="2" x2="7" y2="22" />
      <line x1="17" y1="2" x2="17" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="2" y1="7" x2="7" y2="7" />
      <line x1="2" y1="17" x2="7" y2="17" />
      <line x1="17" y1="7" x2="22" y2="7" />
      <line x1="17" y1="17" x2="22" y2="17" />
    </svg>
  ),
  tv: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="w-5 h-5"
    >
      <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
      <polyline points="17 2 12 7 7 2" />
    </svg>
  ),
  trailer: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="w-5 h-5"
    >
      <path
        fill-rule="evenodd"
        d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
        clip-rule="evenodd"
      />
    </svg>
  ),
};

/**
 * MiniWaveform — Renders a compact, interactive SVG waveform for a track row.
 *
 * Creates a dedicated SVG waveform instance per row (independent factory instance).
 * On mount, fetches peak data from the static JSON file. While loading,
 * renders placeholder bars at 50% height. Clicking/dragging dispatches
 * audio-player:seek for the current track. Progress is synced reactively
 * via effect() from @preact/signals, reading the global currentTime and
 * duration signals to update the visual playhead position.
 */
function MiniWaveform({
  audioUrl,
  trackId,
  height = 24,
}: {
  audioUrl: string;
  trackId?: string;
  height?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const waveformRef = useRef<SvgWaveformInstance | null>(null);

  useEffect(() => {
    if (!containerRef.current || !audioUrl) return;

    // Create an independent SVG waveform instance
    const waveform = createSvgWaveform(containerRef.current, {
      height,
      waveColor: '#6b7280',
      progressColor: getAccentHoverColor(),
      barWidth: 2,
      barGap: 1,
      barRadius: 1,
    });
    waveformRef.current = waveform;

    // Show placeholder bars while loading peaks
    waveform.loadPeaks(getPlaceholderPeaks());

    // Register interaction handler: seek the player when the track is current
    if (trackId) {
      waveform.onSeek((fraction: number) => {
        const activeTrack = currentTrack.peek();
        if (activeTrack?.id === trackId) {
          seekPlayer(trackId, fraction);
        }
      });
    }

    // Fetch peak data from static JSON
    const peaksUrl = getWaveformPeaksUrl(audioUrl);

    fetch(peaksUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch peaks: ${res.status}`);
        }
        return res.json();
      })
      .then((data: { peaks: number[] }) => {
        if (waveformRef.current) {
          waveformRef.current.loadPeaks(data.peaks);
        }
      })
      .catch((err) => {
        // Leave placeholder bars on error — non-critical, waveform is visual only
        console.warn(`Failed to load waveform peaks for ${audioUrl}:`, err.message);
      });

    // Reactive progress sync: update the visual playhead when this track is playing
    let disposeEffect: (() => void) | null = null;
    if (trackId) {
      disposeEffect = effect(() => {
        const activeTrack = currentTrack.value;
        if (activeTrack?.id !== trackId) {
          // Reset progress to zero when this track is no longer active
          if (waveformRef.current) {
            waveformRef.current.setProgress(0);
          }
          return;
        }
        const time = currentTime.value;
        const dur = duration.value;
        if (dur > 0 && waveformRef.current) {
          waveformRef.current.setProgress(Math.max(0, Math.min(1, time / dur)));
        }
      });
    }

    return () => {
      if (disposeEffect) {
        disposeEffect();
      }
      waveform.destroy();
      waveformRef.current = null;
    };
  }, [audioUrl, height]);

  return <div ref={containerRef} class="w-96 h-6 hidden sm:block" />;
}

export default function TrackRow({
  track,
  audioUrl,
  trackId,
  onPlay,
}: TrackRowProps) {
  const icon = isUrlIcon(track.icon) ? (
    <img src={track.icon} alt="" class="w-full h-full object-cover" />
  ) : (
    icons[track.icon] || icons.music
  );

  return (
    <button
      type="button"
      class="group flex w-full md:w-4/5 items-center gap-3 px-4 py-2 text-left transition-colors hover:bg-white/5"
      onClick={onPlay}
    >
      {/* Category icon */}
      <span class="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 text-text/40 transition-colors group-hover:text-accent overflow-hidden">
        {icon}
      </span>

      {/* Track info */}
      <span class="min-w-0 flex-1">
        <span class="block truncate text-sm font-medium">{track.title}</span>
        {track.subtitle && (
          <span class="block truncate text-xs text-text/50">
            {track.subtitle}
          </span>
        )}
      </span>

      {/* Live waveform (renders when audioUrl is available) */}
      {audioUrl ? <MiniWaveform audioUrl={audioUrl} trackId={trackId} /> : null}

      {/* Duration */}
      <span class="shrink-0 text-xs text-text/40 tabular-nums">
        {track.duration}
      </span>
    </button>
  );
}
