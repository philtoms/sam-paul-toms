/**
 * MediaCarousel component tests.
 *
 * Tests rendering, navigation (click, keyboard), and media type rendering.
 *
 * Clone-based infinite-scroll structure: the component renders
 *   [spacer, clone-last, ...realItems, clone-first, spacer]
 * inside its viewport. The spacer divs do not carry the card class, so
 * querySelectorAll('.media-carousel__card') yields (itemCount + 2) elements:
 *   [clone-last, realItem0, ..., realItemN, clone-first]
 * Real items occupy indices 1..itemCount within that NodeList. The
 * `getRealCards(container)` helper returns the real items via slice(1, -1) so
 * tests never index into a clone by accident.
 *
 * Navigation wraps bidirectionally: goTo() always wraps via
 * ((realIndex % itemCount) + itemCount) % itemCount, so ArrowLeft at index 0
 * wraps to the last item and ArrowRight at the last item wraps to index 0.
 * Both nav buttons are always rendered (infinite scroll, no boundary hiding).
 */
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/preact';
import MediaCarousel from '../../../src/components/MediaCarousel';

/** Returns only real cards, excluding the clone-last and clone-first cards.
 *  The carousel renders [clone-last, ...realItems, clone-first] as .media-carousel__card elements. */
function getRealCards(container: HTMLElement): HTMLElement[] {
  const allCards = container.querySelectorAll('.media-carousel__card');
  return Array.from(allCards).slice(1, -1) as HTMLElement[];
}

const mockItems = [
  {
    title: 'Test Image',
    type: 'image' as const,
    src: '/images/test.jpg',
    alt: 'Test image alt',
    order: 1,
  },
  {
    title: 'Test Video',
    type: 'video' as const,
    src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    order: 2,
  },
  {
    title: 'Test Instagram',
    type: 'instagram' as const,
    src: '/images/gallery/placeholder.jpg',
    thumbnail: '/images/gallery/thumb.jpg',
    alt: 'Instagram post',
    order: 3,
    instagramUrl: 'https://www.instagram.com/p/test123/',
  },
  {
    title: 'Another Image',
    type: 'image' as const,
    src: '/images/test2.jpg',
    alt: 'Another image',
    order: 4,
  },
];

// Mock scrollIntoView for JSDOM
beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

describe('MediaCarousel — rendering', () => {
  it('renders all gallery items passed as props', () => {
    const { container } = render(<MediaCarousel items={mockItems} />);
    const cards = getRealCards(container);
    expect(cards.length).toBe(4);
  });

  it('renders image items with correct src and alt', () => {
    const { container } = render(<MediaCarousel items={mockItems} />);
    const img = getRealCards(container)[0].querySelector('.media-carousel__media img') as HTMLImageElement;
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('/images/test.jpg');
    expect(img.getAttribute('alt')).toBe('Test image alt');
  });

  it('renders video items with YouTube iframe', () => {
    const { container } = render(<MediaCarousel items={mockItems} />);
    const iframe = container.querySelector('.media-carousel__card iframe') as HTMLIFrameElement;
    expect(iframe).toBeTruthy();
    expect(iframe.getAttribute('src')).toContain('youtube.com/embed/dQw4w9WgXcQ');
  });

  it('renders instagram items with a link to the original post', () => {
    const { container } = render(<MediaCarousel items={mockItems} />);
    const link = container.querySelector('.media-carousel__instagram-overlay') as HTMLAnchorElement;
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('https://www.instagram.com/p/test123/');
    expect(link.getAttribute('target')).toBe('_blank');
  });

  it('renders instagram items with thumbnail image', () => {
    const { container } = render(<MediaCarousel items={mockItems} />);
    // Instagram card should use the thumbnail image
    // Real item 2 (index 2 in getRealCards) is the Instagram item
    const instagramCard = getRealCards(container)[2];
    const img = instagramCard.querySelector('.media-carousel__media img') as HTMLImageElement;
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('/images/gallery/thumb.jpg');
  });

  it('renders dot indicators for each item', () => {
    const { container } = render(<MediaCarousel items={mockItems} />);
    const dots = container.querySelectorAll('.media-carousel__dot');
    expect(dots.length).toBe(4);
  });

  it('cards have polaroid frame images instead of CSS borders', () => {
    const { container } = render(<MediaCarousel items={mockItems} />);
    const cards = getRealCards(container);
    expect(cards.length).toBe(4);
    // Each real card should contain a polaroid frame <img>
    cards.forEach((card) => {
      const frame = card.querySelector('.media-carousel__polaroid-frame');
      expect(frame).toBeTruthy();
      expect(frame!.tagName).toBe('IMG');
    });
    // No caption elements should be present
    const captions = container.querySelectorAll('.media-carousel__caption');
    expect(captions.length).toBe(0);
  });

  it('each card renders a polaroid frame image with a src from polaroid1-4', () => {
    const { container } = render(<MediaCarousel items={mockItems} />);
    // Query frames only within real cards — clones also render polaroid frames
    const realCards = getRealCards(container);
    const frames = realCards
      .map((card) => card.querySelector('.media-carousel__polaroid-frame'))
      .filter(Boolean) as HTMLImageElement[];
    expect(frames.length).toBe(4);
    frames.forEach((frame) => {
      const src = frame.getAttribute('src');
      expect(src).toMatch(/\/images\/carousel\/polaroid[1-4]\.png/);
    });
  });

  it('polaroid frame image has aria-hidden', () => {
    const { container } = render(<MediaCarousel items={mockItems} />);
    const frames = container.querySelectorAll('.media-carousel__polaroid-frame');
    frames.forEach((frame) => {
      expect(frame.getAttribute('aria-hidden')).toBe('true');
      expect(frame.getAttribute('alt')).toBe('');
    });
  });

  it('does not render caption titles', () => {
    const { container } = render(<MediaCarousel items={mockItems} />);
    const captionTitles = container.querySelectorAll('.media-carousel__caption-title');
    expect(captionTitles.length).toBe(0);
  });

  it('renders nothing when items array is empty', () => {
    const { container } = render(<MediaCarousel items={[]} />);
    expect(container.innerHTML).toBe('');
  });
});

describe('MediaCarousel — navigation', () => {
  it('shows next button when not at the last item', () => {
    const { container } = render(<MediaCarousel items={mockItems} />);
    const nextBtn = container.querySelector('.media-carousel__nav-btn--next');
    expect(nextBtn).toBeTruthy();
  });

  it('renders prev button at initial position (index 0)', () => {
    const { container } = render(<MediaCarousel items={mockItems} />);
    const prevBtn = container.querySelector('.media-carousel__nav-btn--prev');
    // Infinite scroll: both nav buttons are always rendered
    expect(prevBtn).toBeTruthy();
  });

  it('clicking next button advances the active index', () => {
    const { container } = render(<MediaCarousel items={mockItems} />);
    const nextBtn = container.querySelector('.media-carousel__nav-btn--next') as HTMLButtonElement;

    fireEvent.click(nextBtn);

    // After clicking next, the second real card should be active
    const realCards = getRealCards(container);
    expect(realCards[0].classList.contains('media-carousel__card--active')).toBe(false);
    expect(realCards[1].classList.contains('media-carousel__card--active')).toBe(true);

    // The prev button is always rendered (infinite scroll)
    const prevBtn = container.querySelector('.media-carousel__nav-btn--prev');
    expect(prevBtn).toBeTruthy();
  });

  it('clicking previous button moves back', () => {
    const { container } = render(<MediaCarousel items={mockItems} />);
    const nextBtn = container.querySelector('.media-carousel__nav-btn--next') as HTMLButtonElement;

    // Go to index 1
    fireEvent.click(nextBtn);

    // Now go back
    const prevBtn = container.querySelector('.media-carousel__nav-btn--prev') as HTMLButtonElement;
    fireEvent.click(prevBtn);

    const realCards = getRealCards(container);
    expect(realCards[0].classList.contains('media-carousel__card--active')).toBe(true);
    expect(realCards[1].classList.contains('media-carousel__card--active')).toBe(false);
  });

  it('wraps to first item when advancing past the last item', () => {
    // Use a 2-item list to test wrapping
    const twoItems = mockItems.slice(0, 2);
    const { container } = render(<MediaCarousel items={twoItems} />);

    // Click next to go to the last item (index 1)
    const nextBtn = container.querySelector('.media-carousel__nav-btn--next') as HTMLButtonElement;
    fireEvent.click(nextBtn);

    // Infinite scroll: the next button is always present
    const nextBtnAfter = container.querySelector('.media-carousel__nav-btn--next');
    expect(nextBtnAfter).toBeTruthy();

    // Click next again — wraps back to index 0
    fireEvent.click(nextBtnAfter as HTMLButtonElement);
    const realCards = getRealCards(container);
    expect(realCards[0].classList.contains('media-carousel__card--active')).toBe(true);
  });

  it('arrow key navigation works (right arrow advances)', () => {
    const { container } = render(<MediaCarousel items={mockItems} />);
    const carousel = container.querySelector('.media-carousel') as HTMLElement;

    fireEvent.keyDown(carousel, { key: 'ArrowRight' });

    const realCards = getRealCards(container);
    expect(realCards[1].classList.contains('media-carousel__card--active')).toBe(true);
  });

  it('arrow key navigation works (left arrow goes back)', () => {
    const { container } = render(<MediaCarousel items={mockItems} />);
    const carousel = container.querySelector('.media-carousel') as HTMLElement;

    // Go to index 1 first
    fireEvent.keyDown(carousel, { key: 'ArrowRight' });

    // Go back to index 0
    fireEvent.keyDown(carousel, { key: 'ArrowLeft' });

    const realCards = getRealCards(container);
    expect(realCards[0].classList.contains('media-carousel__card--active')).toBe(true);
  });

  it('left arrow wraps to last item at index 0', () => {
    const { container } = render(<MediaCarousel items={mockItems} />);
    const carousel = container.querySelector('.media-carousel') as HTMLElement;

    fireEvent.keyDown(carousel, { key: 'ArrowLeft' });

    const realCards = getRealCards(container);
    // ArrowLeft at index 0 wraps to the last item (index 3)
    expect(realCards[0].classList.contains('media-carousel__card--active')).toBe(false);
    expect(realCards[3].classList.contains('media-carousel__card--active')).toBe(true);
  });

  it('clicking a dot navigates to that item', () => {
    const { container } = render(<MediaCarousel items={mockItems} />);
    const dots = container.querySelectorAll('.media-carousel__dot');

    // Click the third dot (index 2)
    fireEvent.click(dots[2]);

    const realCards = getRealCards(container);
    expect(realCards[2].classList.contains('media-carousel__card--active')).toBe(true);

    // Active dot should also update
    expect(dots[2].classList.contains('media-carousel__dot--active')).toBe(true);
  });
});
