/**
 * TrackRow — A single track row in the playlist accordion.
 *
 * Displays a track with category icon, title/subtitle, live waveform
 * rendered via wavesurfer.js, and duration. Clicking the row triggers
 * playback via the parent accordion.
 *
 * MiniWaveform approach: Each track row creates its own WaveSurfer instance
 * (not the singleton from waveformRenderer.ts). Instances are muted
 * (setVolume(0)) and non-interactive (interact: false) since seeking is
 * handled by the row-level click → audio-player:play event. Instances are
 * created on mount and destroyed on unmount via useEffect cleanup.
 */

import { useRef, useEffect } from 'preact/hooks';
import WaveSurfer from 'wavesurfer.js';

interface TrackRowProps {
  track: {
    title: string;
    subtitle?: string;
    duration: string;
    icon: string;
  };
  audioUrl?: string;
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
 * MiniWaveform — Renders a compact, non-interactive waveform for a track row.
 *
 * Creates a dedicated WaveSurfer instance per row (not the player singleton).
 * The instance is muted and non-interactive; seeking is handled by the
 * row-level click handler that dispatches audio-player:play.
 */
function MiniWaveform({
  audioUrl,
  height = 24,
}: {
  audioUrl: string;
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
      barWidth: 2,
      barGap: 1,
      barRadius: 1,
      fillParent: true,
      interact: false,
    });

    ws.setVolume(0);
    ws.load(audioUrl);
    wsRef.current = ws;

    return () => {
      ws.destroy();
      wsRef.current = null;
    };
  }, [audioUrl, height]);

  return <div ref={containerRef} class="w-96 h-6 hidden sm:block" />;
}

export default function TrackRow({ track, audioUrl, onPlay }: TrackRowProps) {
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
      {audioUrl ? <MiniWaveform audioUrl={audioUrl} /> : null}

      {/* Duration */}
      <span class="shrink-0 text-xs text-text/40 tabular-nums">
        {track.duration}
      </span>
    </button>
  );
}
