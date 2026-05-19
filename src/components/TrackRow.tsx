/**
 * TrackRow — A single track row in the playlist accordion.
 *
 * Displays a track with category icon, title/subtitle, waveform placeholder,
 * and duration. Clicking the row triggers playback via the parent accordion.
 */

interface TrackRowProps {
  track: {
    title: string;
    subtitle?: string;
    duration: string;
    icon: string;
  };
  onPlay: () => void;
}

/** Icon lookup by category type */
const icons: Record<string, JSX.Element> = {
  music: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
  film: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
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
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
      <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
      <polyline points="17 2 12 7 7 2" />
    </svg>
  ),
  trailer: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
      <path fill-rule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clip-rule="evenodd" />
    </svg>
  ),
};

/** Generate a static waveform SVG with pseudo-random bar heights */
function WaveformPlaceholder() {
  // Deterministic bar heights for visual consistency
  const bars = [8, 14, 6, 18, 10, 16, 4, 12, 20, 8, 15, 7, 17, 9, 13, 5];
  return (
    <svg viewBox="0 0 64 24" class="w-24 h-6 hidden sm:block" preserveAspectRatio="none">
      {bars.map((h, i) => (
        <rect
          key={i}
          x={i * 4}
          y={24 - h}
          width="2.5"
          height={h}
          fill={i < bars.length * 0.3 ? 'var(--color-accent)' : 'var(--color-text-tertiary)'}
          opacity={i < bars.length * 0.3 ? '0.6' : '0.3'}
        />
      ))}
    </svg>
  );
}

export default function TrackRow({ track, onPlay }: TrackRowProps) {
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
          <span class="block truncate text-xs text-text/50">{track.subtitle}</span>
        )}
      </span>

      {/* Waveform placeholder */}
      <WaveformPlaceholder />

      {/* Duration */}
      <span class="shrink-0 text-xs text-text/40 tabular-nums">{track.duration}</span>
    </button>
  );
}
