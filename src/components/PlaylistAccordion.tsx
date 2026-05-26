/**
 * PlaylistAccordion — Interactive accordion for playlist sections.
 *
 * Renders collapsible sections (Documentary, Film, Library, Trailers/Themes/Idents).
 * Only one section open at a time. First section open by default.
 * Track clicks dispatch audio-player:play events via the custom event system.
 */

import { useState } from 'preact/hooks';
import TrackRow from './TrackRow';
import './PlaylistAccordion.css';

interface PlaylistSection {
  title: string;
  slug: string;
  description?: string;
  tracks: Array<{
    title: string;
    subtitle?: string;
    duration: string;
    icon: string;
  }>;
}

interface PlayableTrack {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  artworkUrl?: string;
}

interface PlaylistAccordionProps {
  sections: PlaylistSection[];
  /** Map from section slug to playable tracks for audio dispatch */
  playableTracksMap: Record<string, PlayableTrack[]>;
  /** Full track list across all sections for cross-section next/prev cycling */
  allTracks: PlayableTrack[];
}

export default function PlaylistAccordion({ sections, playableTracksMap, allTracks }: PlaylistAccordionProps) {
  // First section open by default
  const [openSlug, setOpenSlug] = useState<string>(sections[0]?.slug ?? '');

  const toggleSection = (slug: string) => {
    setOpenSlug(prev => prev === slug ? '' : slug);
  };

  const handleTrackPlay = (sectionSlug: string, trackIndex: number) => {
    if (allTracks.length === 0) return;

    // Compute global startIndex by summing track counts of all preceding sections
    let globalIndex = 0;
    for (const section of sections) {
      if (section.slug === sectionSlug) {
        globalIndex += trackIndex;
        break;
      }
      globalIndex += section.tracks.length;
    }

    document.dispatchEvent(
      new CustomEvent('audio-player:play', {
        detail: { tracks: allTracks, startIndex: globalIndex },
      }),
    );
  };

  return (
    <div class="playlist-accordion">
      {sections.map(section => {
        const isOpen = openSlug === section.slug;
        const trackCount = section.tracks.length;

        return (
          <div class="accordion-section" key={section.slug}>
            <button
              type="button"
              class="accordion-header"
              onClick={() => toggleSection(section.slug)}
              aria-expanded={isOpen}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class={`accordion-chevron w-5 h-5 text-text/40 ${isOpen ? 'rotate-90' : ''}`}
              >
                <path d="m9 5 7 7 -7 7" />
              </svg>
              <span class="flex items-center gap-3">
                <span class="text-lg font-semibold">{section.title}</span>
                <span class="text-xs text-text/40">{trackCount} {trackCount === 1 ? 'track' : 'tracks'}</span>
              </span>
            </button>

            <div class={`accordion-content ${isOpen ? 'accordion-content--open' : ''}`}>
              <div>
                {section.description && (
                  <p class="px-4 pt-2 pb-1 text-xs text-text/50">{section.description}</p>
                )}
                {section.tracks.map((track, i) => (
                  <TrackRow
                    key={`${section.slug}-${i}`}
                    track={track}
                    audioUrl={playableTracksMap[section.slug]?.[i]?.audioUrl}
                    onPlay={() => handleTrackPlay(section.slug, i)}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
