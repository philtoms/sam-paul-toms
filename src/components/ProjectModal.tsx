import { useState, useEffect, useRef, useCallback } from 'preact/hooks';
import {
  PROJECT_MODAL_OPEN,
  PROJECT_MODAL_CLOSE,
  type ProjectModalData,
} from '../scripts/project-modal-events';
import { extractYouTubeId, buildYouTubeEmbedUrl } from '../scripts/youtube';

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
  // Append YouTube `start` param only for a positive start time so the
  // no-start-time case stays byte-identical to the original embed URL.
  const embedUrl = buildYouTubeEmbedUrl(videoId, projectData.videoStartTime);

  return (
    <div
      class={`fixed inset-0 z-60 flex items-center justify-center p-0 md:p-4 transition-opacity duration-200 ${
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
        class="relative bg-bg-elevated rounded-none md:rounded-lg shadow-xl max-w-3xl w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto outline-none"
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

        {/* Project image beside the title + summary (mirrors the AboutModal
            bio layout). The image renders unconditionally — even when a video
            is present — with the YouTube embed placed full-width below. */}
        <section class="flex flex-col md:flex-row gap-8 md:gap-12">
          <div class="md:w-2/5 shrink-0">
            <img
              src={projectData.popupImage ?? projectData.image}
              alt={projectData.title}
              class="w-full rounded-lg object-cover max-h-[500px] shadow-2xl"
            />
          </div>
          <div class="md:w-3/5">
            {/* Title */}
            <h2 class="text-xl md:text-3xl font-bold text-white mb-4">{projectData.title}</h2>

            {/* Summary — rendered from pre-rendered markdown HTML when
                `summaryHtml` is present (the production path via
                ProjectGrid.astro), falling back to the plain `summary`
                string in a <p>. A <div> is used for the HTML branch because
                markdown can produce block-level elements (multiple <p>s,
                lists) that are invalid inside a <p>. Links are styled with
                the accent colour, matching the AboutModal convention. */}
            {projectData.summaryHtml ? (
              <div
                class="text-sm md:text-base text-white/80 leading-relaxed space-y-4 [&_a]:text-accent [&_a]:underline [&_a:hover]:text-accent-hover"
                dangerouslySetInnerHTML={{ __html: projectData.summaryHtml }}
              />
            ) : (
              <p class="text-sm md:text-base text-white/80 leading-relaxed">{projectData.summary}</p>
            )}

            {/* Director credit — only shown when dir is a non-empty string */}
            {projectData.dir && (
              <p class="text-sm text-white/60 mt-2">Directed by {projectData.dir}</p>
            )}
          </div>
        </section>

        {/* YouTube video embed — only if video URL provided */}
        {videoId && (
          <div class="mt-6">
            <div
              class="relative w-full overflow-hidden rounded-lg shadow-xl"
              style="padding-bottom: 56.25%"
            >
              <iframe
                src={embedUrl}
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
