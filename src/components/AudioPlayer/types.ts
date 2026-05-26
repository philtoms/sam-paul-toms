/**
 * Represents a single audio track in the playlist.
 */
export interface Track {
  /** Unique identifier for the track */
  id: string;
  /** Display title of the track */
  title: string;
  /** Artist or performer name */
  artist: string;
  /** URL to the audio file (MP3 format) */
  audioUrl: string;
  /** Track duration in seconds (populated after loading) */
  duration?: number;
  /** URL to the album artwork thumbnail */
  artworkUrl?: string;
  /** Category icon key (music, film, tv, trailer) */
  icon?: string;
  /** Track subtitle (e.g. production credit) */
  subtitle?: string;
}

/**
 * Current playback state of the audio player.
 */
export type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

/**
 * Shape of the full playlist store, used for debugging and serialization.
 */
export interface PlaylistState {
  tracks: Track[];
  currentIndex: number;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  playbackState: PlaybackState;
}
