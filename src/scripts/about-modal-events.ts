/**
 * Custom event system for about modal communication.
 *
 * Follows the same pattern as contact-modal-events.ts.
 * Any component can dispatch these events on `document` to open/close
 * the about modal without coupling to its internal state.
 */

/** Event type constants */
export const ABOUT_MODAL_OPEN = 'about-modal:open';
export const ABOUT_MODAL_CLOSE = 'about-modal:close';

/**
 * Dispatch an event to open the about modal.
 */
export function openAboutModal(): void {
  document.dispatchEvent(new CustomEvent(ABOUT_MODAL_OPEN));
}

/**
 * Dispatch an event to close the about modal.
 */
export function closeAboutModal(): void {
  document.dispatchEvent(new CustomEvent(ABOUT_MODAL_CLOSE));
}
