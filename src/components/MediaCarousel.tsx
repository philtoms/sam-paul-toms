/**
 * MediaCarousel — Infinite-swipeable media carousel for the homepage.
 *
 * Clone-based infinite scroll:
 *   [spacer, clone-last, ...realItems, clone-first, spacer]
 *
 * Spacers provide scroll room so edge clones can be fully centered,
 * enabling smooth animated wrapping via RAF on all devices.
 * Touch/drag scrolls freely — no snap, no auto-centering.
 */

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useLayoutEffect,
} from 'preact/hooks';
import './MediaCarousel.css';
import { extractYouTubeId } from '../scripts/youtube';

const POLAROID_FRAMES = [
  '/images/carousel/polaroid1.png',
  '/images/carousel/polaroid2.png',
  '/images/carousel/polaroid3.png',
  '/images/carousel/polaroid4.png',
];

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

/** RAF smooth scroll with ease-out cubic. */
function smoothScrollTo(
  element: HTMLElement,
  targetX: number,
  duration: number,
  frameRef: { current: number },
  onComplete?: () => void,
) {
  cancelAnimationFrame(frameRef.current);
  const startX = element.scrollLeft;
  const distance = targetX - startX;

  if (Math.abs(distance) < 1) {
    if (onComplete) onComplete();
    return;
  }

  const startTime = performance.now();

  function animate(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.scrollLeft = startX + distance * eased;

    if (progress < 1) {
      frameRef.current = requestAnimationFrame(animate);
    } else {
      element.scrollLeft = targetX;
      if (onComplete) onComplete();
    }
  }

  frameRef.current = requestAnimationFrame(animate);
}

function CarouselCard({
  item,
  itemCount,
  isActive,
  slideNumber,
}: {
  item: GalleryItem;
  itemCount: number;
  isActive: boolean;
  slideNumber: number;
}) {
  return (
    <div
      class={`media-carousel__card${isActive ? ' media-carousel__card--active' : ''}`}
      role="group"
      aria-roledescription="slide"
      aria-label={`${slideNumber} of ${itemCount}: ${item.title}`}
    >
      <div class="media-carousel__media">
        {item.type === 'image' && (
          <img src={item.src} alt={item.alt || item.title} loading="lazy" />
        )}
        {item.type === 'video' &&
          (() => {
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
      <img
        class="media-carousel__polaroid-frame"
        src={POLAROID_FRAMES[item.order % POLAROID_FRAMES.length]}
        aria-hidden="true"
        alt=""
      />
    </div>
  );
}

export default function MediaCarousel({ items }: MediaCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef(0);
  const isAnimating = useRef(false);

  const itemCount = items.length;

  // Layout: [spacer(0), clone-last(1), real0(2), ..., realN(N+1), clone-first(N+2), spacer(N+3)]
  // Real index i → rendered slot i + 2
  const totalSlots = itemCount + 4;
  const REAL_OFFSET = 2;

  /** ScrollLeft to center a rendered slot. Uses getBoundingClientRect for reliability. */
  const centerScrollX = useCallback((slot: number): number => {
    const viewport = viewportRef.current;
    if (!viewport) return 0;
    const child = viewport.children[slot] as HTMLElement | undefined;
    if (!child) return viewport.scrollLeft;
    const cRect = child.getBoundingClientRect();
    const vRect = viewport.getBoundingClientRect();
    return (
      viewport.scrollLeft +
      cRect.left -
      vRect.left -
      (vRect.width - cRect.width) / 2
    );
  }, []);

  /** Instantly jump to a rendered slot (no animation). */
  const jumpToSlot = useCallback(
    (slot: number, realIndex: number) => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      isAnimating.current = true;
      viewport.scrollLeft = centerScrollX(slot);
      setActiveIndex(realIndex);
      requestAnimationFrame(() => {
        isAnimating.current = false;
      });
    },
    [centerScrollX],
  );

  /** If on a clone slot, jump to the corresponding real slot. */
  const handleCloneCheck = useCallback(
    (slot: number) => {
      if (slot === 1) {
        // clone-last → real last
        jumpToSlot(REAL_OFFSET + itemCount - 1, itemCount - 1);
      } else if (slot === itemCount + 2) {
        // clone-first → real first
        jumpToSlot(REAL_OFFSET, 0);
      }
    },
    [itemCount, jumpToSlot],
  );

  /** Which rendered slot is closest to viewport center? */
  const getClosestSlot = useCallback((): number => {
    const viewport = viewportRef.current;
    if (!viewport) return REAL_OFFSET;
    const center = viewport.scrollLeft + viewport.clientWidth / 2;
    let best = REAL_OFFSET;
    let bestDist = Infinity;
    for (let i = 0; i < totalSlots; i++) {
      const child = viewport.children[i] as HTMLElement;
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const dist = Math.abs(childCenter - center);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    }
    return best;
  }, [totalSlots]);

  // ── Navigate (button / keyboard) ─────────────────────────────────
  const goTo = useCallback(
    (realIndex: number) => {
      const wrapped = ((realIndex % itemCount) + itemCount) % itemCount;
      const viewport = viewportRef.current;
      if (!viewport) return;
      cancelAnimationFrame(animFrameRef.current);

      // Choose rendered slot (use clones for wrapping)
      let slot: number;
      if (realIndex >= itemCount && activeIndex === itemCount - 1) {
        slot = itemCount + 2; // clone-first
      } else if (realIndex < 0 && activeIndex === 0) {
        slot = 1; // clone-last
      } else {
        slot = wrapped + REAL_OFFSET;
      }

      isAnimating.current = true;
      setActiveIndex(wrapped);

      smoothScrollTo(viewport, centerScrollX(slot), 350, animFrameRef, () => {
        isAnimating.current = false;
        handleCloneCheck(slot);
      });
    },
    [itemCount, activeIndex, centerScrollX, handleCloneCheck],
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  // ── Layout: initial scroll position ───────────────────────────
  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    // Size spacers to give scroll room for centering edge clones
    const card = viewport.children[REAL_OFFSET] as HTMLElement | undefined;
    if (card) {
      const spacerW = Math.max(
        0,
        (viewport.clientWidth - card.offsetWidth) / 2,
      );
      const spacerStart = viewport.children[0] as HTMLElement;
      const spacerEnd = viewport.children[totalSlots - 1] as HTMLElement;
      spacerStart.style.width = `${spacerW}px`;
      spacerEnd.style.width = `${spacerW}px`;
    }
    // Center the first real item
    viewport.scrollLeft = centerScrollX(REAL_OFFSET);
  }, [centerScrollX, totalSlots]);

  // ── Keep spacer sizes in sync on resize ─────────────────────────
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const ro = new ResizeObserver(() => {
      const card = viewport.children[REAL_OFFSET] as HTMLElement | undefined;
      if (!card) return;
      const spacerW = Math.max(
        0,
        (viewport.clientWidth - card.offsetWidth) / 2,
      );
      const spacerStart = viewport.children[0] as HTMLElement;
      const spacerEnd = viewport.children[totalSlots - 1] as HTMLElement;
      spacerStart.style.width = `${spacerW}px`;
      spacerEnd.style.width = `${spacerW}px`;
    });
    ro.observe(viewport);
    return () => ro.disconnect();
  }, [totalSlots]);

  // ── Keyboard ─────────────────────────────────────────────────────
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

  // ── Scroll observer (touch/drag tracking + clone/boundary wrap) ──
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    let rafId = 0;
    let settleTimer: number;
    let isTouching = false;
    let lastSlot = REAL_OFFSET;

    const onScroll = () => {
      if (isAnimating.current) return;

      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const slot = getClosestSlot();
        lastSlot = slot;

        // Update active index when on a real item
        if (slot >= REAL_OFFSET && slot < REAL_OFFSET + itemCount) {
          setActiveIndex(slot - REAL_OFFSET);
        }

        // Only check for wrapping after a touch/drag sequence ends
        // (not during active touch or button animations)
        if (isTouching) return;

        clearTimeout(settleTimer);
        settleTimer = window.setTimeout(() => {
          if (isAnimating.current) return;

          // Landed on a clone → jump to real
          if (lastSlot === 1 || lastSlot === itemCount + 2) {
            handleCloneCheck(lastSlot);
            return;
          }

          // Boundary detection: scroll hit the edge
          const sl = viewport.scrollLeft;
          const maxSl = viewport.scrollWidth - viewport.clientWidth;

          if (sl >= maxSl - 2 && lastSlot === REAL_OFFSET + itemCount - 1) {
            // Right edge + last real → instant wrap to first
            isAnimating.current = true;
            viewport.scrollLeft = centerScrollX(REAL_OFFSET);
            setActiveIndex(0);
            requestAnimationFrame(() => {
              isAnimating.current = false;
            });
          } else if (sl <= 2 && lastSlot === REAL_OFFSET) {
            // Left edge + first real → instant wrap to last
            isAnimating.current = true;
            viewport.scrollLeft = centerScrollX(
              REAL_OFFSET + itemCount - 1,
            );
            setActiveIndex(itemCount - 1);
            requestAnimationFrame(() => {
              isAnimating.current = false;
            });
          }
        }, 150);
      });
    };

    // Track when the user is actively touching/dragging
    const onTouchStart = () => {
      isTouching = true;
      clearTimeout(settleTimer);
    };
    const onTouchEnd = () => {
      isTouching = false;
      // Let momentum finish, then the settle timer will check boundaries
    };
    const onPointerDown = () => {
      isTouching = true;
      clearTimeout(settleTimer);
    };
    const onPointerUp = () => {
      isTouching = false;
    };

    viewport.addEventListener('scroll', onScroll, { passive: true });
    viewport.addEventListener('touchstart', onTouchStart, { passive: true });
    viewport.addEventListener('touchend', onTouchEnd, { passive: true });
    viewport.addEventListener('pointerdown', onPointerDown);
    viewport.addEventListener('pointerup', onPointerUp);

    return () => {
      viewport.removeEventListener('scroll', onScroll);
      viewport.removeEventListener('touchstart', onTouchStart);
      viewport.removeEventListener('touchend', onTouchEnd);
      viewport.removeEventListener('pointerdown', onPointerDown);
      viewport.removeEventListener('pointerup', onPointerUp);
      cancelAnimationFrame(rafId);
      clearTimeout(settleTimer);
    };
  }, [itemCount, getClosestSlot, centerScrollX, handleCloneCheck]);

  if (itemCount === 0) return null;

  // Build rendered list
  const renderedItems = [
    items[itemCount - 1], // slot 1: clone-last
    ...items, // slots 2..N+1: real items
    items[0], // slot N+2: clone-first
  ];

  return (
    <div
      class="media-carousel"
      role="region"
      aria-label="Media gallery"
      tabIndex={0}
    >
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

      <div ref={viewportRef} class="media-carousel__viewport">
        {/* Spacer-start (slot 0) — gives scroll room to center clone-last */}
        <div aria-hidden="true" style={{ flexShrink: 0 }} />

        {renderedItems.map((item, i) => {
          const slot = i + 1; // offset by 1 for spacer
          const isClone = slot === 1 || slot === itemCount + 2;
          const realIdx = isClone
            ? slot === 1
              ? itemCount - 1
              : 0
            : slot - REAL_OFFSET;

          return (
            <CarouselCard
              key={
                slot === 1
                  ? 'clone-last'
                  : slot === itemCount + 2
                    ? 'clone-first'
                    : `real-${item.order}`
              }
              item={item}
              itemCount={itemCount}
              isActive={slot === activeIndex + REAL_OFFSET}
              slideNumber={realIdx + 1}
            />
          );
        })}

        {/* Spacer-end (slot N+3) — gives scroll room to center clone-first */}
        <div aria-hidden="true" style={{ flexShrink: 0 }} />
      </div>

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

      <div
        class="media-carousel__dots"
        role="tablist"
        aria-label="Carousel navigation"
      >
        {items.map((item, index) => (
          <button
            key={`dot-${item.order}`}
            type="button"
            class={`media-carousel__dot${index === activeIndex ? ' media-carousel__dot--active' : ''}`}
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
