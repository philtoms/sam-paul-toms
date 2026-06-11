import { useState, useEffect, useRef, useCallback } from 'preact/hooks';
import {
  PROJECT_MODAL_OPEN,
  PROJECT_MODAL_CLOSE,
  type ProjectModalData,
} from '../scripts/project-modal-events';

/**
 * ProjectModal — globally mounted modal popup for project detail views.
 *
 * Listens for `project-modal:open` and `project-modal:close` custom events
 * dispatched on `document`. Follows the same custom-event + global-Preact
 * pattern established by AboutModal.
 *
 * Features:
 * - Fade-in/fade-out animation (200ms opacity transition)
 * - Click-outside-to-close (backdrop click)
 * - Escape key to close
 * - Focus trap & restore on close
 * - Body scroll lock while open
 * - Optional YouTube video embed
 */
export default function ProjectModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [projectData, setProjectData] = useState<ProjectModalData | null>(null);
  const previousFocusRef = useRef<Element | null>(null);
  const modalPanelRef = useRef<HTMLDivElement | null>(null);

  /** Extract YouTube video ID from various URL formats */
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

  /** Open the modal with animation */
  const open = useCallback((data: ProjectModalData) => {
    setProjectData(data);
    previousFocusRef.current = document.activeElement;
    setIsOpen(true);
    // Trigger fade-in on next frame
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  /** Close the modal with animation */
  const close = useCallback(() => {
    setIsVisible(false);
    // Wait for fade-out animation to complete before unmounting
    setTimeout(() => {
      setIsOpen(false);
      setProjectData(null);
      // Restore focus to the element that opened the modal
      if (previousFocusRef.current instanceof HTMLElement) {
        previousFocusRef.current.focus();
      }
      previousFocusRef.current = null;
    }, 200);
  }, []);

  /** Listen for custom events */
  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<ProjectModalData>;
      if (customEvent.detail) {
        open(customEvent.detail);
      }
    };
    const handleClose = () => close();

    document.addEventListener(PROJECT_MODAL_OPEN, handleOpen);
    document.addEventListener(PROJECT_MODAL_CLOSE, handleClose);

    return () => {
      document.removeEventListener(PROJECT_MODAL_OPEN, handleOpen);
      document.removeEventListener(PROJECT_MODAL_CLOSE, handleClose);
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

  if (!isOpen || !projectData) return null;

  const videoId = projectData.video ? extractYouTubeId(projectData.video) : '';

  return (
    <div
      class={`fixed inset-0 z-60 flex items-center justify-center p-4 transition-opacity duration-200 ${
        isVisible
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={projectData.title}
    >
      {/* Backdrop */}
      <div class="absolute inset-0 bg-black/60" onClick={close} />

      {/* Modal panel */}
      <div
        ref={modalPanelRef}
        tabindex={-1}
        onClick={(e) => e.stopPropagation()}
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

        {/* Project image — only shown when no video is available */}
        {!videoId && (
          <img
            src={projectData.image}
            alt={projectData.title}
            class="w-full rounded-lg object-cover max-h-[400px] shadow-2xl"
          />
        )}

        {/* Title */}
        <h2 class="text-3xl font-bold text-white mt-6">{projectData.title}</h2>

        {/* Summary */}
        <p class="text-white/80 leading-relaxed mt-4">{projectData.summary}</p>

        {/* YouTube video embed — only if video URL provided */}
        {videoId && (
          <div class="mt-6">
            <div
              class="relative w-full overflow-hidden rounded-lg shadow-xl"
              style="padding-bottom: 56.25%"
            >
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
                title={`${projectData.title} — video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen=""
                loading="lazy"
                class="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
