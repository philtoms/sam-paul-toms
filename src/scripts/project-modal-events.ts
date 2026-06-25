/**
 * Custom event system for project modal communication.
 *
 * Follows the same pattern as about-modal-events.ts and
 * contact-modal-events.ts. Any component can dispatch these
 * events on `document` to open/close the project modal without
 * coupling to its internal state.
 */

/** Event type constants */
export const PROJECT_MODAL_OPEN = 'project-modal:open';
export const PROJECT_MODAL_CLOSE = 'project-modal:close';

/** Serializable project data passed via CustomEvent detail */
export interface ProjectModalData {
  title: string;
  summary: string;
  /** Pre-rendered HTML from the markdown `summary` field. When present, the modal renders this via `dangerouslySetInnerHTML`. */
  summaryHtml?: string;
  image: string;
  /** Optional image shown in the modal popup. Falls back to `image` when omitted. */
  popupImage?: string;
  video?: string;
  videoStartTime?: number;
  /** When true, the modal's YouTube embed loops the active video indefinitely (emits `loop=1&playlist=<videoId>`). Applies to whichever video is currently active — main or thumbnail-swapped. */
  loop?: boolean;
  /** When true, the embed autoplays on load (emits `autoplay=1&mute=1` — browsers block unmuted autoplay, so the video starts muted). Applies to whichever video is currently active. */
  autoplay?: boolean;
  /** Optional clickable thumbnail strip. Each entry pairs a poster image with a YouTube URL; clicking a thumbnail loads that video into the modal's main player. An optional `startTime` deep-links that video to a specific timestamp. */
  videoThumbnails?: Array<{ image: string; youtubeUrl: string; startTime?: number }>;
  dir?: string;
  publishDate: string;
}

/**
 * Dispatch an event to open the project modal with project data.
 */
export function openProjectModal(data: ProjectModalData): void {
  document.dispatchEvent(
    new CustomEvent<ProjectModalData>(PROJECT_MODAL_OPEN, { detail: data }),
  );
}

/**
 * Dispatch an event to close the project modal.
 */
export function closeProjectModal(): void {
  document.dispatchEvent(new CustomEvent(PROJECT_MODAL_CLOSE));
}
