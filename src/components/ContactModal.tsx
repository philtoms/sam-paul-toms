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
 *
 * Layout-shift note: `scrollbar-gutter: stable` on `<html>` (global.css)
 * reserves scrollbar space so that toggling `overflow-hidden` on `<body>`
 * does not cause a horizontal layout shift when the modal opens/closes.
 */
// Turnstile site key — resolved at build time by Astro.
// If empty/undefined, all Turnstile logic is skipped entirely.
const TURNSTILE_SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || '';

// Extend Window to include Turnstile API
declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: TurnstileRenderOptions) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

interface TurnstileRenderOptions {
  sitekey: string;
  callback: (token: string) => void;
  theme?: string;
}

export default function ContactModal() {
  const whatsappPhone = import.meta.env.PUBLIC_WHATSAPP_PHONE;
  const artistName = import.meta.env.PUBLIC_ARTIST_NAME || 'Sam';
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const previousFocusRef = useRef<Element | null>(null);
  const modalPanelRef = useRef<HTMLDivElement | null>(null);

  // Turnstile state
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);

  /** Open the modal with animation */
  const open = useCallback(() => {
    previousFocusRef.current = document.activeElement;
    setIsOpen(true);
    // Trigger fade-in on next frame
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
    // Lock body scroll
    // document.body.classList.add('overflow-hidden');
  }, []);

  /** Close the modal with animation */
  const close = useCallback(() => {
    setIsVisible(false);
    // Wait for fade-out animation to complete before unmounting
    setTimeout(() => {
      setIsOpen(false);
      // document.body.classList.remove('overflow-hidden');
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

  /** Turnstile widget — only rendered when PUBLIC_TURNSTILE_SITE_KEY is configured */
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !isOpen || !isVisible) return;

    let widgetId: string | null = null;

    const renderWidget = () => {
      if (!window.turnstile || !turnstileContainerRef.current) return;
      widgetId = window.turnstile.render(turnstileContainerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token: string) => setTurnstileToken(token),
        theme: 'dark',
      });
      turnstileWidgetIdRef.current = widgetId;
    };

    // If Turnstile script is already loaded, render immediately
    if (window.turnstile) {
      renderWidget();
    } else {
      // Check if the script tag is already in the document
      const existing = document.querySelector(
        'script[src*="challenges.cloudflare.com/turnstile"]',
      );
      if (existing) {
        // Script tag present but may not have loaded yet — wait for it
        existing.addEventListener('load', renderWidget);
      } else {
        // Inject the Turnstile script
        const script = document.createElement('script');
        script.src =
          'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback';
        script.async = true;
        script.defer = true;
        script.addEventListener('load', renderWidget);
        document.head.appendChild(script);
      }
    }

    return () => {
      // Remove the widget on close / unmount
      if (widgetId && window.turnstile) {
        try {
          window.turnstile.remove(widgetId);
        } catch {
          // Widget may already be gone
        }
        turnstileWidgetIdRef.current = null;
      }
    };
  }, [isOpen, isVisible]);

  /** Form validation & submission */
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
    fax: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setSubmitError('');
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
      setIsSubmitting(true);
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formState.name,
            email: formState.email,
            message: formState.message,
            fax: formState.fax,
            ...(turnstileToken ? { turnstileToken } : {}),
          }),
        });
        const data = await response.json();
        if (data.ok) {
          setFormState({ name: '', email: '', message: '', fax: '' });
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        } else {
          setSubmitError(data.error || 'Something went wrong.');
        }
      } catch {
        setSubmitError('Something went wrong. Please try again later.');
      } finally {
        setIsSubmitting(false);
        // Reset Turnstile widget so a fresh token is generated for the next attempt
        if (turnstileWidgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.reset(turnstileWidgetIdRef.current);
          } catch {
            // Widget may have been removed
          }
        }
        setTurnstileToken('');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      class={`fixed inset-0 z-60 flex items-center justify-center p-4 transition-opacity duration-200 ${
        isVisible
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Contact form"
    >
      {/* Backdrop */}
      <div class="absolute inset-0 bg-black/60" onClick={close} />

      {/* Modal panel */}
      <div
        ref={modalPanelRef}
        tabindex={-1}
        onClick={(e) => e.stopPropagation()}
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
          {/* Honeypot — visually hidden, traps bots. Do NOT use display:none. */}
          <div class="absolute -left-[9999px] opacity-0 h-0 overflow-hidden" aria-hidden="true">
            <label for="modal-contact-fax">Fax</label>
            <input
              type="text"
              id="modal-contact-fax"
              name="fax"
              tabindex={-1}
              autocomplete="off"
              value={formState.fax}
              onInput={(e) =>
                setFormState({
                  ...formState,
                  fax: (e.target as HTMLInputElement).value,
                })
              }
            />
          </div>

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
                setFormState({
                  ...formState,
                  name: (e.target as HTMLInputElement).value,
                })
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
                setFormState({
                  ...formState,
                  email: (e.target as HTMLInputElement).value,
                })
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

          {/* Turnstile widget — only rendered when site key is configured */}
          {TURNSTILE_SITE_KEY && (
            <div ref={turnstileContainerRef} />
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            class="bg-accent text-white rounded-lg px-6 py-3 font-medium hover:brightness-110 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>

          {submitError && (
            <p class="text-red-400 text-sm">{submitError}</p>
          )}

          {showSuccess && (
            <p class="text-green-400 text-sm">
              Message sent! We'll get back to you soon.
            </p>
          )}
        </form>

        {whatsappPhone && (
          <div class="mt-4">
            <div class="flex items-center gap-3 my-4">
              <hr class="flex-1 border-white/10" />
              <span class="text-white/30 text-xs">or</span>
              <hr class="flex-1 border-white/10" />
            </div>
            <a
              href={`https://wa.me/${whatsappPhone}?text=Hi%20${encodeURIComponent(artistName)}%2C%20I%20reached%20out%20via%20your%20website.`}
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center justify-center gap-2 border border-white/20 rounded-lg px-6 py-3 font-medium text-white/70 hover:text-white hover:border-white/40 transition-all duration-200 text-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="w-5 h-5 text-green-400"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Message on WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
