import { useState, useEffect, useRef, useCallback } from 'preact/hooks';
import {
  ABOUT_MODAL_OPEN,
  ABOUT_MODAL_CLOSE,
} from '../scripts/about-modal-events';

interface PressQuote {
  text: string;
  source: string;
  url?: string;
}

export interface AboutModalProps {
  title: string;
  photo: string;
  photoAlt: string;
  genreTags: string[];
  pressQuotes: PressQuote[];
  bioHtml: string;
}

/**
 * AboutModal — globally mounted modal popup for the about/bio content.
 *
 * Listens for `about-modal:open` and `about-modal:close` custom events
 * dispatched on `document`. Follows the same custom-event + global-Preact
 * pattern established by ContactModal.
 *
 * Features:
 * - Fade-in/fade-out animation (200ms opacity transition)
 * - Click-outside-to-close (backdrop click)
 * - Escape key to close
 * - Focus trap & restore on close
 * - Body scroll lock while open
 */
export default function AboutModal(props: AboutModalProps) {
  const { title, photo, photoAlt, genreTags, pressQuotes, bioHtml } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const previousFocusRef = useRef<Element | null>(null);
  const modalPanelRef = useRef<HTMLDivElement | null>(null);

  /** Open the modal with animation */
  const open = useCallback(() => {
    previousFocusRef.current = document.activeElement;
    setIsOpen(true);
    // Trigger fade-in on next frame
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
    // Lock body scroll
    document.body.classList.add('overflow-hidden');
  }, []);

  /** Close the modal with animation */
  const close = useCallback(() => {
    setIsVisible(false);
    // Wait for fade-out animation to complete before unmounting
    setTimeout(() => {
      setIsOpen(false);
      document.body.classList.remove('overflow-hidden');
      // Restore focus to the element that opened the modal
      if (previousFocusRef.current instanceof HTMLElement) {
        previousFocusRef.current.focus();
      }
      previousFocusRef.current = null;
    }, 200);
  }, []);

  /** Listen for custom events */
  useEffect(() => {
    const handleOpen = () => open();
    const handleClose = () => close();

    document.addEventListener(ABOUT_MODAL_OPEN, handleOpen);
    document.addEventListener(ABOUT_MODAL_CLOSE, handleClose);

    return () => {
      document.removeEventListener(ABOUT_MODAL_OPEN, handleOpen);
      document.removeEventListener(ABOUT_MODAL_CLOSE, handleClose);
    };
  }, [open, close]);

  /** Escape key handler */
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close]);

  /** Focus trap — focus the modal panel when opened */
  useEffect(() => {
    if (isOpen && isVisible && modalPanelRef.current) {
      modalPanelRef.current.focus();
    }
  }, [isOpen, isVisible]);

  /** Cleanup body scroll lock on unmount */
  useEffect(() => {
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  /** Handle backdrop click (close only if clicking the backdrop, not the panel) */
  const handleBackdropClick = useCallback(
    (e: Event) => {
      if (e.target === e.currentTarget) {
        close();
      }
    },
    [close],
  );

  if (!isOpen) return null;

  return (
    <div
      class={`fixed inset-0 z-60 flex items-center justify-center p-4 transition-opacity duration-200 ${
        isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="About"
    >
      {/* Backdrop */}
      <div class="absolute inset-0 bg-black/60" />

      {/* Modal panel */}
      <div
        ref={modalPanelRef}
        tabindex={-1}
        class="relative bg-bg-elevated rounded-lg shadow-xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto outline-none"
      >
        {/* Close button */}
        <div class="flex items-center justify-end mb-4">
          <button
            type="button"
            onClick={close}
            aria-label="Close modal"
            class="text-white/70 hover:text-white transition-colors p-1 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-6 h-6"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Bio section — mirrors BioSection.astro */}
        <section class="flex flex-col md:flex-row gap-8 md:gap-12">
          <div class="md:w-2/5 shrink-0">
            <img
              src={photo}
              alt={photoAlt}
              class="w-full rounded-lg object-cover max-h-[500px] shadow-2xl"
            />
          </div>
          <div class="md:w-3/5">
            <h1 class="text-4xl font-bold text-white mb-6">{title}</h1>
            <div
              class="text-white/80 leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: bioHtml }}
            />
          </div>
        </section>

        {/* Genre tags — mirrors GenreTags.astro */}
        {genreTags.length > 0 && (
          <div class="mt-8 flex flex-wrap gap-2">
            {genreTags.map((tag) => (
              <span class="inline-block rounded-full bg-white/10 px-3 py-1 text-sm border border-white/20 transition-colors duration-200 hover:bg-accent/20 hover:border-accent/40">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Press quotes — mirrors PressQuotes.astro */}
        {pressQuotes.length > 0 && (
          <section class="mt-16">
            <h2 class="text-2xl font-bold text-white mb-8">Press</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pressQuotes.map((quote) => (
                <figure class="bg-white/5 rounded-lg p-6 border border-white/10">
                  <span aria-hidden="true" class="block text-accent text-4xl opacity-60 leading-none select-none">
                    {'\u201C'}
                  </span>
                  <blockquote class="text-white/90 text-lg italic mt-2">
                    <p>{quote.text}</p>
                  </blockquote>
                  <figcaption class="mt-4 text-white/50 text-sm">
                    {'\u2014'}
                    {quote.url ? (
                      <cite>
                        <a
                          href={quote.url}
                          class="hover:text-accent transition-colors duration-200"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {quote.source}
                        </a>
                      </cite>
                    ) : (
                      <cite>{quote.source}</cite>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
