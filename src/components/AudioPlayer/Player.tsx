import { useRef, useEffect, useCallback, useMemo } from 'preact/hooks';
import {
  playbackState,
  currentTrack,
  isPlaying,
  volume,
  currentTime,
  duration,
  tracks,
  setPlaylist,
  nextTrack,
  prevTrack,
} from './playlistStore';
import * as audioEngine from './audioEngine';
import * as waveformRenderer from './waveformRenderer';
import type { Track } from './types';
import './Player.css';

/** Icon lookup by category type */
const categoryIcons: Record<string, JSX.Element> = {
  music: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="audio-player-icon">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
  film: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="audio-player-icon">
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
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="audio-player-icon">
      <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
      <polyline points="17 2 12 7 7 2" />
    </svg>
  ),
  trailer: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="audio-player-icon">
      <path fill-rule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clip-rule="evenodd" />
    </svg>
  ),
};

function trackIcon(icon?: string): JSX.Element {
  return categoryIcons[icon ?? 'music'] ?? categoryIcons.music;
}

/**
 * Persistent audio player bar component.
 *
 * Renders as a sticky-bottom bar with waveform visualization, transport
 * controls, track info, and volume slider. Persists across Astro View
 * Transitions via `transition:persist` in the layout.
 *
 * Communication from pages happens via custom events dispatched on `document`.
 */
export default function Player() {
  const waveformContainerRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const bodyPaddingRef = useRef(false);

  /** Initialize audio engine and waveform renderer on mount */
  useEffect(() => {
    audioEngine.initReactiveSubscription();

    // Set up body padding to prevent content hidden behind fixed bar
    document.body.classList.add('audio-player-body-padding');
    bodyPaddingRef.current = true;

    return () => {
      // Clean up on unmount
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      audioEngine.destroy();
      waveformRenderer.destroy();
      if (bodyPaddingRef.current) {
        document.body.classList.remove('audio-player-body-padding');
      }
    };
  }, []);

  /** Initialize waveform renderer when container is available */
  useEffect(() => {
    if (waveformContainerRef.current && currentTrack.value) {
      waveformRenderer.init(waveformContainerRef.current);
      waveformRenderer.loadAudio(currentTrack.value.audioUrl);
    }
  }, [currentTrack.value?.id]);

  /** Sync waveform progress via RAF loop */
  useEffect(() => {
    if (!isPlaying.value) {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      return;
    }

    const tick = () => {
      const dur = duration.value;
      const time = currentTime.value;
      if (dur > 0) {
        waveformRenderer.setProgress(time / dur);
      }
      rafIdRef.current = requestAnimationFrame(tick);
    };
    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [isPlaying.value]);

  /** Listen for custom events from pages */
  useEffect(() => {
    const handlePlay = (e: Event) => {
      const detail = (e as CustomEvent).detail as {
        tracks: Track[];
        startIndex?: number;
      };
      if (detail?.tracks) {
        setPlaylist(detail.tracks, detail.startIndex ?? 0);
      }
    };

    const handlePause = () => {
      audioEngine.pause();
    };

    const handleAdd = (e: Event) => {
      const detail = (e as CustomEvent).detail as { track: Track };
      if (detail?.track) {
        // Append to existing playlist or start a new one
        const currentTracks = tracks.value;
        const newTracks = [...currentTracks, detail.track];
        if (currentTracks.length === 0) {
          setPlaylist(newTracks, 0);
        } else {
          // Just update tracks array without changing currentIndex
          tracks.value = newTracks;
        }
      }
    };

    const handleSeek = (e: Event) => {
      const detail = (e as CustomEvent).detail as { trackId: string; fraction: number };
      if (detail?.trackId && currentTrack.value?.id === detail.trackId) {
        audioEngine.seek(detail.fraction);
      }
    };

    document.addEventListener('audio-player:play', handlePlay);
    document.addEventListener('audio-player:pause', handlePause);
    document.addEventListener('audio-player:add', handleAdd);
    document.addEventListener('audio-player:seek', handleSeek);

    return () => {
      document.removeEventListener('audio-player:play', handlePlay);
      document.removeEventListener('audio-player:pause', handlePause);
      document.removeEventListener('audio-player:add', handleAdd);
      document.removeEventListener('audio-player:seek', handleSeek);
    };
  }, []);

  /** Handle seek from waveform interaction */
  useEffect(() => {
    const unsub = waveformRenderer.onSeek((fraction: number) => {
      audioEngine.seek(fraction);
    });
    return unsub;
  }, [currentTrack.value?.id]);

  /** Toggle play/pause */
  const handleTogglePlay = useCallback(() => {
    audioEngine.togglePlay();
  }, []);

  /** Previous track */
  const handlePrev = useCallback(() => {
    prevTrack();
  }, []);

  /** Next track */
  const handleNext = useCallback(() => {
    nextTrack();
  }, []);

  /** Volume change */
  const handleVolumeChange = useCallback((e: Event) => {
    const target = e.target as HTMLInputElement;
    audioEngine.setVolume(parseFloat(target.value));
  }, []);

  /** Volume icon click toggle (mobile: 0 → 0.8 → 0 cycle) */
  const handleVolumeIconClick = useCallback(() => {
    if (volume.value > 0) {
      audioEngine.setVolume(0);
    } else {
      audioEngine.setVolume(0.8);
    }
  }, []);

  /** Format seconds → m:ss */
  const fmt = useMemo(
    () => (secs: number) => {
      if (!isFinite(secs) || secs < 0) return '0:00';
      const m = Math.floor(secs / 60);
      const s = Math.floor(secs % 60);
      return `${m}:${s.toString().padStart(2, '0')}`;
    },
    [],
  );

  const track = currentTrack.value;
  const isIdle = playbackState.value === 'idle' && !track;

  if (isIdle) {
    return <div class="audio-player-bar audio-player-bar--collapsed" />;
  }

  return (
    <div class="audio-player-bar audio-player-bar--expanded">
      {/* Track info (left) */}
      <div class="audio-player-track-info">
        <span class="audio-player-track-info__icon">
          {trackIcon(track?.icon)}
        </span>
        <div class="audio-player-track-info__details">
          <span class="audio-player-track-info__title">
            {track?.title ?? '—'}
          </span>
          <span class="audio-player-track-info__artist">
            {track?.subtitle
              ? `${track.artist}: ${track.subtitle}`
              : (track?.artist ?? '')}
          </span>
        </div>
      </div>

      {/* Transport controls (center) */}
      <div class="audio-player-transport">
        <button
          class="audio-player-btn audio-player-btn--skip"
          onClick={handlePrev}
          aria-label="Previous track"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="audio-player-icon"
          >
            <polygon
              points="19 20 9 12 19 4 19 20"
              fill="currentColor"
              stroke="none"
            />
            <line x1="5" y1="4" x2="5" y2="20" />
          </svg>
        </button>
        <button
          class="audio-player-btn audio-player-btn--play"
          onClick={handleTogglePlay}
          aria-label={isPlaying.value ? 'Pause' : 'Play'}
        >
          {isPlaying.value ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="none"
              class="audio-player-icon"
            >
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="none"
              class="audio-player-icon"
            >
              <polygon points="7 3 21 12 7 21 7 3" />
            </svg>
          )}
        </button>
        <button
          class="audio-player-btn audio-player-btn--skip"
          onClick={handleNext}
          aria-label="Next track"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="audio-player-icon"
          >
            <polygon
              points="5 4 15 12 5 20 5 4"
              fill="currentColor"
              stroke="none"
            />
            <line x1="19" y1="4" x2="19" y2="20" />
          </svg>
        </button>
      </div>

      {/* Current time */}
      <span class="audio-player-time">{fmt(currentTime.value)}</span>

      {/* Waveform area (flexible center) */}
      <div ref={waveformContainerRef} class="audio-player-waveform" />

      {/* Total time */}
      <span class="audio-player-time">{fmt(duration.value)}</span>

      {/* Volume (right) */}
      <div class="audio-player-volume">
        <input
          type="range"
          class="audio-player-volume__slider"
          min="0"
          max="1"
          step="0.01"
          value={volume.value}
          onInput={handleVolumeChange}
          aria-label="Volume"
        />
        <span
          class="audio-player-volume__icon"
          onClick={handleVolumeIconClick}
          role="button"
          tabindex={0}
          aria-label={volume.value > 0 ? 'Mute' : 'Unmute'}
        >
          {volume.value > 0 ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="audio-player-icon"
            >
              <polygon
                points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
                fill="currentColor"
                stroke="none"
              />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="audio-player-icon"
            >
              <polygon
                points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
                fill="currentColor"
                stroke="none"
              />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
        </span>
      </div>
    </div>
  );
}
