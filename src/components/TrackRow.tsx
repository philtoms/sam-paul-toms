/**
 * TrackRow — A single track row in the playlist accordion.
 *
 * Displays a track with category icon, title/subtitle, live waveform
 * rendered via wavesurfer.js, and duration. Clicking the row triggers
 * playback via the parent accordion.
 *
 * MiniWaveform approach: Each track row creates its own WaveSurfer instance
 * (not the singleton from waveformRenderer.ts). Instances are muted
 * (setVolume(0)) and interactive (interact: true). Clicking/dragging on the
 * waveform dispatches audio-player:seek when the track is the currently
 * playing track, while the row-level onClick dispatches audio-player:play
 * via the parent accordion. Progress is synced reactively via effect()
 * from @preact/signals, reading currentTime/duration to update the visual
 * playhead position. Instances are created on mount and destroyed on unmount
 * via useEffect cleanup.
 */

import { useRef, useEffect } from 'preact/hooks';
import { effect } from '@preact/signals';
import WaveSurfer from 'wavesurfer.js';
import {
  currentTrack,
  currentTime,
  duration,
} from './AudioPlayer/playlistStore';
import { seekPlayer } from '../scripts/audio-player-events';

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
      class="w-4 h-4"
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
      class="w-4 h-4"
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
      class="w-4 h-4"
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
      class="w-4 h-4"
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
 * MiniWaveform — Renders a compact, interactive waveform for a track row.
 *
 * Creates a dedicated WaveSurfer instance per row (not the player singleton).
 * The instance is muted but interactive; clicking/dragging dispatches
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
  const wsRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (!containerRef.current || !audioUrl) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      height,
      waveColor: '#6b7280',
      progressColor: '#eab308',
      barWidth: 2,
      barGap: 1,
      barRadius: 1,
      fillParent: true,
      interact: true,
    });

    ws.setVolume(0);
    ws.load(audioUrl);
    wsRef.current = ws;

    // Register interaction handler: seek the player when the track is current
    if (trackId) {
      ws.on('interaction', (newTime: number) => {
        const wsDuration = ws.getDuration();
        if (wsDuration <= 0) return;
        const fraction = newTime / wsDuration;
        // Only dispatch seek if this track is the currently loaded track.
        // For non-current tracks, the button onClick fires audio-player:play
        // (KB-055 guards against double-play for the current track).
        const activeTrack = currentTrack.peek();
        if (activeTrack?.id === trackId) {
          seekPlayer(trackId, fraction);
        }
      });
    }

    // Reactive progress sync: update the visual playhead when this track is playing
    let disposeEffect: (() => void) | null = null;
    if (trackId) {
      disposeEffect = effect(() => {
        const activeTrack = currentTrack.value;
        if (activeTrack?.id !== trackId) return;
        const time = currentTime.value;
        const dur = duration.value;
        if (dur > 0 && wsRef.current) {
          wsRef.current.seekTo(Math.max(0, Math.min(1, time / dur)));
        }
      });
    }

    return () => {
      if (disposeEffect) {
        disposeEffect();
      }
      ws.destroy();
      wsRef.current = null;
    };
  }, [audioUrl, height]);

  return <div ref={containerRef} class="w-48 h-6 hidden sm:block" />;
}

export default function TrackRow({ track, audioUrl, trackId, onPlay }: TrackRowProps) {
  const icon = icons[track.icon] || icons.music;

  return (
    <button
      type="button"
      class="group flex w-full items-center gap-3 px-4 py-2 text-left transition-colors hover:bg-white/5"
      onClick={onPlay}
    >
      {/* Category icon */}
      <span class="shrink-0 text-text/40 transition-colors group-hover:text-accent">
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
