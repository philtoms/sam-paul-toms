/**
 * MediaCarousel — Swipeable media carousel for the homepage.
 *
 * Displays gallery items (images, videos, Instagram posts) in a
 * centered carousel with peek-a-boo sides, edge fading, and
 * keyboard/touch/swipe navigation. Does NOT auto-advance.
 */

import { useState, useRef, useCallback, useEffect } from 'preact/hooks';
import './MediaCarousel.css';

interface GalleryItem {
  title: string;
  type: 'image' | 'video' | 'instagram';
  src: string;
  thumbnail?: string;
  alt?: string;
  order: number;
  instagramUrl?: string;
}

interface MediaCarouselProps {
  items: GalleryItem[];
}

/**
 * Extract YouTube video ID from various URL formats.
 * Reuses the pattern from YouTubeEmbed.astro.
 */
function extractYouTubeId(url: string): string {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return '';
}

export default function MediaCarousel({ items }: MediaCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const itemCount = items.length;

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, itemCount - 1));
      setActiveIndex(clamped);

      // Scroll the card into view
      const viewport = viewportRef.current;
      if (!viewport) return;
      const cards = viewport.querySelectorAll('.media-carousel__card');
      if (cards[clamped]) {
        cards[clamped].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    },
    [itemCount],
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
    };

    const carousel = viewportRef.current?.parentElement;
    if (!carousel) return;

    carousel.addEventListener('keydown', handleKeyDown);
    return () => carousel.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev]);

  // Track scroll position to update activeIndex
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleScroll = () => {
      const cards = viewport.querySelectorAll('.media-carousel__card');
      const viewportCenter = viewport.scrollLeft + viewport.clientWidth / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      cards.forEach((card, i) => {
        const cardCenter = (card as HTMLElement).offsetLeft + (card as HTMLElement).offsetWidth / 2;
        const distance = Math.abs(cardCenter - viewportCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });

      if (closestIndex !== activeIndex) {
        setActiveIndex(closestIndex);
      }
    };

    viewport.addEventListener('scroll', handleScroll, { passive: true });
    return () => viewport.removeEventListener('scroll', handleScroll);
  }, [activeIndex]);

  // Touch handlers for swipe detection
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const deltaX = touchEndX.current - touchStartX.current;
    const threshold = 50;

    if (Math.abs(deltaX) >= threshold) {
      if (deltaX < 0) {
        goNext();
      } else {
        goPrev();
      }
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  if (itemCount === 0) return null;

  return (
    <div class="media-carousel" role="region" aria-label="Media gallery" tabIndex={0}>
      {/* Previous button */}
      {activeIndex > 0 && (
        <button
          type="button"
          class="media-carousel__nav-btn media-carousel__nav-btn--prev"
          onClick={goPrev}
          aria-label="Previous item"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m15 18 -6 -6 6 -6" />
          </svg>
        </button>
      )}

      {/* Viewport */}
      <div
        ref={viewportRef}
        class="media-carousel__viewport"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {items.map((item, index) => (
          <div
            key={`${item.type}-${item.order}`}
            class={`media-carousel__card ${index === activeIndex ? 'media-carousel__card--active' : ''}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${itemCount}: ${item.title}`}
          >
            <div class="media-carousel__media">
              {item.type === 'image' && (
                <img
                  src={item.src}
                  alt={item.alt || item.title}
                  loading="lazy"
                />
              )}

              {item.type === 'video' && (() => {
                const videoId = extractYouTubeId(item.src);
                return videoId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={item.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                    loading="lazy"
                  />
                ) : (
                  <img
                    src={item.thumbnail || item.src}
                    alt={item.alt || item.title}
                    loading="lazy"
                  />
                );
              })()}

              {item.type === 'instagram' && (
                <>
                  <img
                    src={item.thumbnail || item.src}
                    alt={item.alt || item.title}
                    loading="lazy"
                  />
                  {item.instagramUrl && (
                    <a
                      href={item.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="media-carousel__instagram-overlay"
                      aria-label={`View ${item.title} on Instagram`}
                    >
                      <span class="media-carousel__instagram-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                      </span>
                    </a>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Next button */}
      {activeIndex < itemCount - 1 && (
        <button
          type="button"
          class="media-carousel__nav-btn media-carousel__nav-btn--next"
          onClick={goNext}
          aria-label="Next item"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m9 18 6 -6 -6 -6" />
          </svg>
        </button>
      )}

      {/* Dot indicators */}
      <div class="media-carousel__dots" role="tablist" aria-label="Carousel navigation">
        {items.map((item, index) => (
          <button
            key={`dot-${item.order}`}
            type="button"
            class={`media-carousel__dot ${index === activeIndex ? 'media-carousel__dot--active' : ''}`}
            onClick={() => goTo(index)}
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`Go to slide ${index + 1}: ${item.title}`}
          />
        ))}
      </div>
    </div>
  );
}
