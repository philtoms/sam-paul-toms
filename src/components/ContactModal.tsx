import { useState, useEffect, useRef, useCallback } from 'preact/hooks';
import {
  CONTACT_MODAL_OPEN,
  CONTACT_MODAL_CLOSE,
} from '../scripts/contact-modal-events';

/**
 * ContactModal — globally mounted modal popup for the contact form.
 *
 * Listens for `contact-modal:open` and `contact-modal:close` custom events
 * dispatched on `document`. Follows the same custom-event + global-Preact
 * pattern established by the audio player.
 *
 * Features:
 * - Fade-in/fade-out animation (200ms opacity transition)
 * - Click-outside-to-close (backdrop click)
 * - Escape key to close
 * - Focus trap & restore on close
 * - Body scroll lock while open
 */
export default function ContactModal() {
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

    document.addEventListener(CONTACT_MODAL_OPEN, handleOpen);
    document.addEventListener(CONTACT_MODAL_CLOSE, handleClose);

    return () => {
      document.removeEventListener(CONTACT_MODAL_OPEN, handleOpen);
      document.removeEventListener(CONTACT_MODAL_CLOSE, handleClose);
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

  /** Form validation & submission */
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formState.name.trim()) {
      newErrors.name = 'Please enter your name.';
    }
    if (!formState.email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!isValidEmail(formState.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formState.message.trim()) {
      newErrors.message = 'Please enter a message.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Simulate successful submission (no backend yet)
      setFormState({ name: '', email: '', message: '' });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      class={`fixed inset-0 z-60 flex items-center justify-center p-4 transition-opacity duration-200 ${
        isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Contact form"
    >
      {/* Backdrop */}
      <div class="absolute inset-0 bg-black/60" />

      {/* Modal panel */}
      <div
        ref={modalPanelRef}
        tabindex={-1}
        class="relative bg-bg-elevated rounded-lg shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto outline-none"
      >
        {/* Header */}
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-white">Get In Touch</h2>
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

        {/* Contact form — identical markup to ContactForm.astro */}
        <form
          aria-label="Contact form"
          onSubmit={handleSubmit}
          class="space-y-6"
        >
          <div>
            <label
              for="modal-contact-name"
              class="block text-white/70 text-sm font-medium mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="modal-contact-name"
              name="name"
              required
              placeholder="Your name"
              value={formState.name}
              onInput={(e) =>
                setFormState({ ...formState, name: (e.target as HTMLInputElement).value })
              }
              class="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors duration-200"
            />
            {errors.name && (
              <p class="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              for="modal-contact-email"
              class="block text-white/70 text-sm font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="modal-contact-email"
              name="email"
              required
              placeholder="you@example.com"
              value={formState.email}
              onInput={(e) =>
                setFormState({ ...formState, email: (e.target as HTMLInputElement).value })
              }
              class="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors duration-200"
            />
            {errors.email && (
              <p class="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              for="modal-contact-message"
              class="block text-white/70 text-sm font-medium mb-2"
            >
              Message
            </label>
            <textarea
              id="modal-contact-message"
              name="message"
              rows={5}
              required
              placeholder="Your message..."
              value={formState.message}
              onInput={(e) =>
                setFormState({
                  ...formState,
                  message: (e.target as HTMLTextAreaElement).value,
                })
              }
              class="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors duration-200 resize-y"
            />
            {errors.message && (
              <p class="text-red-400 text-sm mt-1">{errors.message}</p>
            )}
          </div>

          <button
            type="submit"
            class="bg-accent text-white rounded-lg px-6 py-3 font-medium hover:brightness-110 transition-all duration-200 cursor-pointer"
          >
            Send Message
          </button>

          {showSuccess && (
            <p class="text-green-400 text-sm">
              Message sent! We'll get back to you soon.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
