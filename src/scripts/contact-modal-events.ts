/**
 * Custom event system for contact modal communication.
 *
 * Follows the same pattern as audio-player-events.ts.
 * Any component can dispatch these events on `document` to open/close
 * the contact modal without coupling to its internal state.
 */

/** Event type constants */
export const CONTACT_MODAL_OPEN = 'contact-modal:open';
export const CONTACT_MODAL_CLOSE = 'contact-modal:close';

/**
 * Dispatch an event to open the contact modal.
 */
export function openContactModal(): void {
  document.dispatchEvent(new CustomEvent(CONTACT_MODAL_OPEN));
}

/**
 * Dispatch an event to close the contact modal.
 */
export function closeContactModal(): void {
  document.dispatchEvent(new CustomEvent(CONTACT_MODAL_CLOSE));
}
