/**
 * MediaCarousel component tests.
 *
 * Tests rendering, navigation (click, keyboard), and media type rendering.
 */
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/preact';
import MediaCarousel from '../../../src/components/MediaCarousel';

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
    const cards = container.querySelectorAll('.media-carousel__card');
    expect(cards.length).toBe(4);
  });

  it('renders image items with correct src and alt', () => {
    const { container } = render(<MediaCarousel items={mockItems} />);
    const img = container.querySelector('.media-carousel__card img') as HTMLImageElement;
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
    const cards = container.querySelectorAll('.media-carousel__card');
    // The third card (index 2) is the Instagram item
    const instagramCard = cards[2];
    const img = instagramCard.querySelector('img') as HTMLImageElement;
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('/images/gallery/thumb.jpg');
  });

  it('renders dot indicators for each item', () => {
    const { container } = render(<MediaCarousel items={mockItems} />);
    const dots = container.querySelectorAll('.media-carousel__dot');
    expect(dots.length).toBe(4);
  });

  it('renders item titles in captions', () => {
    const { container } = render(<MediaCarousel items={mockItems} />);
    const captions = container.querySelectorAll('.media-carousel__caption-title');
    expect(captions.length).toBe(4);
    expect(captions[0].textContent).toBe('Test Image');
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

  it('does not show prev button at initial position (index 0)', () => {
    const { container } = render(<MediaCarousel items={mockItems} />);
    const prevBtn = container.querySelector('.media-carousel__nav-btn--prev');
    expect(prevBtn).toBeFalsy();
  });

  it('clicking next button advances the active index', () => {
    const { container } = render(<MediaCarousel items={mockItems} />);
    const nextBtn = container.querySelector('.media-carousel__nav-btn--next') as HTMLButtonElement;

    fireEvent.click(nextBtn);

    // After clicking next, the second card should be active
    const cards = container.querySelectorAll('.media-carousel__card');
    expect(cards[0].classList.contains('media-carousel__card--active')).toBe(false);
    expect(cards[1].classList.contains('media-carousel__card--active')).toBe(true);

    // The prev button should now appear
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

    const cards = container.querySelectorAll('.media-carousel__card');
    expect(cards[0].classList.contains('media-carousel__card--active')).toBe(true);
    expect(cards[1].classList.contains('media-carousel__card--active')).toBe(false);
  });

  it('does not advance past the last item', () => {
    // Use a 2-item list to test boundary
    const twoItems = mockItems.slice(0, 2);
    const { container } = render(<MediaCarousel items={twoItems} />);

    // Click next to go to last item
    const nextBtn = container.querySelector('.media-carousel__nav-btn--next') as HTMLButtonElement;
    fireEvent.click(nextBtn);

    // Next button should no longer be present
    const nextBtnAfter = container.querySelector('.media-carousel__nav-btn--next');
    expect(nextBtnAfter).toBeFalsy();
  });

  it('arrow key navigation works (right arrow advances)', () => {
    const { container } = render(<MediaCarousel items={mockItems} />);
    const carousel = container.querySelector('.media-carousel') as HTMLElement;

    fireEvent.keyDown(carousel, { key: 'ArrowRight' });

    const cards = container.querySelectorAll('.media-carousel__card');
    expect(cards[1].classList.contains('media-carousel__card--active')).toBe(true);
  });

  it('arrow key navigation works (left arrow goes back)', () => {
    const { container } = render(<MediaCarousel items={mockItems} />);
    const carousel = container.querySelector('.media-carousel') as HTMLElement;

    // Go to index 1 first
    fireEvent.keyDown(carousel, { key: 'ArrowRight' });

    // Go back to index 0
    fireEvent.keyDown(carousel, { key: 'ArrowLeft' });

    const cards = container.querySelectorAll('.media-carousel__card');
    expect(cards[0].classList.contains('media-carousel__card--active')).toBe(true);
  });

  it('left arrow does nothing at index 0', () => {
    const { container } = render(<MediaCarousel items={mockItems} />);
    const carousel = container.querySelector('.media-carousel') as HTMLElement;

    fireEvent.keyDown(carousel, { key: 'ArrowLeft' });

    const cards = container.querySelectorAll('.media-carousel__card');
    expect(cards[0].classList.contains('media-carousel__card--active')).toBe(true);
  });

  it('clicking a dot navigates to that item', () => {
    const { container } = render(<MediaCarousel items={mockItems} />);
    const dots = container.querySelectorAll('.media-carousel__dot');

    // Click the third dot (index 2)
    fireEvent.click(dots[2]);

    const cards = container.querySelectorAll('.media-carousel__card');
    expect(cards[2].classList.contains('media-carousel__card--active')).toBe(true);

    // Active dot should also update
    expect(dots[2].classList.contains('media-carousel__dot--active')).toBe(true);
  });
});
