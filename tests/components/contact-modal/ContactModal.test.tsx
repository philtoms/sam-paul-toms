// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/preact';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import ContactModal from '../../../src/components/ContactModal';

describe('ContactModal', () => {
  beforeEach(() => {
    document.body.classList.remove('overflow-hidden');
  });

  afterEach(() => {
    document.body.classList.remove('overflow-hidden');
    vi.restoreAllMocks();
  });

  it('renders modal overlay when contact-modal:open is dispatched', async () => {
    render(<ContactModal />);

    // Modal should not be visible initially
    expect(screen.queryByText('Get In Touch')).not.toBeInTheDocument();

    // Dispatch open event
    document.dispatchEvent(new CustomEvent('contact-modal:open'));

    // Wait for RAF to fire and state to update
    await waitFor(() => {
      expect(screen.getByText('Get In Touch')).toBeInTheDocument();
    });
  });

  it('hides modal when contact-modal:close is dispatched', async () => {
    render(<ContactModal />);

    // Open the modal
    document.dispatchEvent(new CustomEvent('contact-modal:open'));
    await waitFor(() => {
      expect(screen.getByText('Get In Touch')).toBeInTheDocument();
    });

    // Close the modal
    document.dispatchEvent(new CustomEvent('contact-modal:close'));

    // Wait for fade-out animation (200ms timeout)
    await waitFor(() => {
      expect(screen.queryByText('Get In Touch')).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('closes modal when Escape key is pressed', async () => {
    render(<ContactModal />);

    // Open the modal
    document.dispatchEvent(new CustomEvent('contact-modal:open'));
    await waitFor(() => {
      expect(screen.getByText('Get In Touch')).toBeInTheDocument();
    });

    // Small delay to ensure effects are committed (keydown listener attached)
    await new Promise((r) => setTimeout(r, 50));

    // Press Escape
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    // Wait for fade-out animation
    await waitFor(() => {
      expect(screen.queryByText('Get In Touch')).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('closes modal when backdrop is clicked', async () => {
    render(<ContactModal />);

    // Open the modal
    document.dispatchEvent(new CustomEvent('contact-modal:open'));
    await waitFor(() => {
      expect(screen.getByText('Get In Touch')).toBeInTheDocument();
    });

    // Click the actual backdrop div (bg-black/60), not the outer dialog container
    const backdrop = document.querySelector('.bg-black\\/60') as HTMLElement;
    expect(backdrop).not.toBeNull();
    fireEvent.click(backdrop);

    // Wait for fade-out animation
    await waitFor(() => {
      expect(screen.queryByText('Get In Touch')).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('closes modal when clicking the backdrop div directly', async () => {
    render(<ContactModal />);

    document.dispatchEvent(new CustomEvent('contact-modal:open'));
    await waitFor(() => {
      expect(screen.getByText('Get In Touch')).toBeInTheDocument();
    });

    const backdrop = document.querySelector('.bg-black\\/60') as HTMLElement;
    fireEvent.click(backdrop);

    await waitFor(() => {
      expect(screen.queryByText('Get In Touch')).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('does not close modal when panel content is clicked', async () => {
    render(<ContactModal />);

    // Open the modal
    document.dispatchEvent(new CustomEvent('contact-modal:open'));
    await waitFor(() => {
      expect(screen.getByText('Get In Touch')).toBeInTheDocument();
    });

    // Click on the heading inside the panel (not the backdrop)
    const heading = screen.getByText('Get In Touch');
    fireEvent.click(heading);

    // Modal should still be open
    expect(screen.getByText('Get In Touch')).toBeInTheDocument();
  });

  it('shows "Get In Touch" heading when open', async () => {
    render(<ContactModal />);

    document.dispatchEvent(new CustomEvent('contact-modal:open'));
    await waitFor(() => {
      const heading = screen.getByText('Get In Touch');
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H2');
    });
  });

  it('closes modal when close (×) button is clicked', async () => {
    render(<ContactModal />);

    // Open the modal
    document.dispatchEvent(new CustomEvent('contact-modal:open'));
    await waitFor(() => {
      expect(screen.getByText('Get In Touch')).toBeInTheDocument();
    });

    // Click the close button
    const closeBtn = screen.getByLabelText('Close modal');
    fireEvent.click(closeBtn);

    // Wait for fade-out animation
    await waitFor(() => {
      expect(screen.queryByText('Get In Touch')).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  // Body scroll lock via overflow-hidden is intentionally disabled
  // (commented out) in the component — the modal uses its own
  // overlay approach instead. Skipping this test until re-enabled.
  it.skip('locks body scroll when open and restores on close', async () => {
    render(<ContactModal />);

    // Open the modal
    document.dispatchEvent(new CustomEvent('contact-modal:open'));
    await waitFor(() => {
      expect(document.body.classList.contains('overflow-hidden')).toBe(true);
    });

    // Close the modal
    document.dispatchEvent(new CustomEvent('contact-modal:close'));
    await waitFor(() => {
      expect(document.body.classList.contains('overflow-hidden')).toBe(false);
    }, { timeout: 1000 });
  });

  it('global CSS reserves scrollbar gutter to prevent layout shift', () => {
    const cssPath = resolve(__dirname, '../../../src/styles/global.css');
    const css = readFileSync(cssPath, 'utf-8');

    // Extract the html { ... } block
    const htmlBlockMatch = css.match(/html\s*\{[^}]*\}/s);
    expect(htmlBlockMatch).not.toBeNull();

    const htmlBlock = htmlBlockMatch![0];
    expect(htmlBlock).toContain('scrollbar-gutter: stable');
  });
});

describe('ContactModal form submission', () => {
  beforeEach(() => {
    document.body.classList.remove('overflow-hidden');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls fetch with correct endpoint and body on valid submission', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ok: true }),
    });
    vi.stubGlobal('fetch', mockFetch);

    render(<ContactModal />);

    // Open the modal
    document.dispatchEvent(new CustomEvent('contact-modal:open'));
    await waitFor(() => {
      expect(screen.getByText('Get In Touch')).toBeInTheDocument();
    });

    // Fill in the form fields
    const nameInput = document.getElementById('modal-contact-name') as HTMLInputElement;
    const emailInput = document.getElementById('modal-contact-email') as HTMLInputElement;
    const messageInput = document.getElementById('modal-contact-message') as HTMLTextAreaElement;

    fireEvent.input(nameInput, { target: { value: 'Test User' } });
    fireEvent.input(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.input(messageInput, { target: { value: 'Hello from the test!' } });

    // Submit the form
    const submitBtn = screen.getByText('Send Message');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe('/api/contact');
    expect(options.method).toBe('POST');
    expect(options.headers).toEqual({ 'Content-Type': 'application/json' });

    const body = JSON.parse(options.body);
    expect(body.name).toBe('Test User');
    expect(body.email).toBe('test@example.com');
    expect(body.message).toBe('Hello from the test!');
    // Honeypot field should be included (empty)
    expect(body).toHaveProperty('fax');
    // When PUBLIC_TURNSTILE_SITE_KEY is not configured, no turnstileToken
    expect(body).not.toHaveProperty('turnstileToken');
  });

  it('includes turnstileToken in body when site key is configured and widget fires callback', async () => {
    // This test requires a dynamic re-import because TURNSTILE_SITE_KEY is
    // evaluated at module scope from import.meta.env.PUBLIC_TURNSTILE_SITE_KEY.
    // We must reset modules, stub the env var, and re-import the component.

    // Mock window.turnstile before importing so the component can render the widget
    (window as any).turnstile = {
      render: vi.fn().mockReturnValue('mock-widget-id'),
      reset: vi.fn(),
      remove: vi.fn(),
    };

    vi.stubEnv('PUBLIC_TURNSTILE_SITE_KEY', 'test-site-key-123');
    vi.resetModules();

    // Re-import the events module (also module-scoped)
    const eventsMod = await import('../../../src/scripts/contact-modal-events');
    const { CONTACT_MODAL_OPEN: OPEN, CONTACT_MODAL_CLOSE: CLOSE } = eventsMod;

    // Dynamic re-import picks up the stubbed env var
    const mod = await import('../../../src/components/ContactModal');
    const ContactModalWithTurnstile = mod.default;

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ok: true }),
    });
    vi.stubGlobal('fetch', mockFetch);

    render(<ContactModalWithTurnstile />);

    // Open the modal
    document.dispatchEvent(new CustomEvent(OPEN));
    await waitFor(() => {
      expect(screen.getByText('Get In Touch')).toBeInTheDocument();
    });

    // Wait for the Turnstile useEffect to run and call window.turnstile.render
    await waitFor(() => {
      expect((window as any).turnstile.render).toHaveBeenCalled();
    });

    // Simulate the Turnstile widget firing its callback with a token
    const renderCalls = (window as any).turnstile.render.mock.calls;
    const callback = renderCalls[0][1].callback;
    callback('mock-turnstile-token-xyz');

    // Wait for Preact to flush the state update
    await new Promise((r) => setTimeout(r, 0));

    // Fill in the form fields
    const nameInput = document.getElementById('modal-contact-name') as HTMLInputElement;
    const emailInput = document.getElementById('modal-contact-email') as HTMLInputElement;
    const messageInput = document.getElementById('modal-contact-message') as HTMLTextAreaElement;

    fireEvent.input(nameInput, { target: { value: 'Turnstile User' } });
    fireEvent.input(emailInput, { target: { value: 'turnstile@example.com' } });
    fireEvent.input(messageInput, { target: { value: 'Testing Turnstile token!' } });

    // Submit the form
    const submitBtn = screen.getByText('Send Message');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    const [url, options] = mockFetch.mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body.name).toBe('Turnstile User');
    expect(body.email).toBe('turnstile@example.com');
    expect(body.message).toBe('Testing Turnstile token!');
    expect(body).toHaveProperty('turnstileToken', 'mock-turnstile-token-xyz');

    // Cleanup
    delete (window as any).turnstile;
    vi.unstubAllEnvs();
  });

  it('shows success message after successful submission', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ok: true }),
    });
    vi.stubGlobal('fetch', mockFetch);

    render(<ContactModal />);

    document.dispatchEvent(new CustomEvent('contact-modal:open'));
    await waitFor(() => {
      expect(screen.getByText('Get In Touch')).toBeInTheDocument();
    });

    const nameInput = document.getElementById('modal-contact-name') as HTMLInputElement;
    const emailInput = document.getElementById('modal-contact-email') as HTMLInputElement;
    const messageInput = document.getElementById('modal-contact-message') as HTMLTextAreaElement;

    fireEvent.input(nameInput, { target: { value: 'Sam' } });
    fireEvent.input(emailInput, { target: { value: 'sam@example.com' } });
    fireEvent.input(messageInput, { target: { value: 'Hi there!' } });

    const submitBtn = screen.getByText('Send Message');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Message sent! We'll get back to you soon.")).toBeInTheDocument();
    });
  });

  it('shows error message after failed submission', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ ok: false, error: 'Failed to send message.' }),
    });
    vi.stubGlobal('fetch', mockFetch);

    render(<ContactModal />);

    document.dispatchEvent(new CustomEvent('contact-modal:open'));
    await waitFor(() => {
      expect(screen.getByText('Get In Touch')).toBeInTheDocument();
    });

    const nameInput = document.getElementById('modal-contact-name') as HTMLInputElement;
    const emailInput = document.getElementById('modal-contact-email') as HTMLInputElement;
    const messageInput = document.getElementById('modal-contact-message') as HTMLTextAreaElement;

    fireEvent.input(nameInput, { target: { value: 'Sam' } });
    fireEvent.input(emailInput, { target: { value: 'sam@example.com' } });
    fireEvent.input(messageInput, { target: { value: 'Hi!' } });

    const submitBtn = screen.getByText('Send Message');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Failed to send message.')).toBeInTheDocument();
    });
  });
});

describe('ContactModal WhatsApp link', () => {
  beforeEach(() => {
    document.body.classList.remove('overflow-hidden');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does not render WhatsApp link when PUBLIC_WHATSAPP_PHONE is not set', async () => {
    render(<ContactModal />);

    document.dispatchEvent(new CustomEvent('contact-modal:open'));
    await waitFor(() => {
      expect(screen.getByText('Get In Touch')).toBeInTheDocument();
    });

    expect(screen.queryByText('Message on WhatsApp')).not.toBeInTheDocument();
  });

  it('renders WhatsApp link when PUBLIC_WHATSAPP_PHONE is set', async () => {
    vi.stubEnv('PUBLIC_WHATSAPP_PHONE', '447123456789');

    // Re-import to pick up the stubbed env var
    const { default: ContactModalWithWA } = await import(
      '../../../src/components/ContactModal'
    );

    render(<ContactModalWithWA />);

    document.dispatchEvent(new CustomEvent('contact-modal:open'));
    await waitFor(() => {
      expect(screen.getByText('Get In Touch')).toBeInTheDocument();
    });

    const link = screen.getByText('Message on WhatsApp').closest('a')!;
    expect(link).not.toBeNull();
    expect(link.getAttribute('href')).toContain('wa.me/447123456789');
    // Default artist name fallback is "Sam"
    expect(link.getAttribute('href')).toContain(
      'text=Hi%20Sam%2C%20I%20reached%20out%20via%20your%20website.',
    );
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');

    vi.unstubAllEnvs();
  });

  it('uses PUBLIC_ARTIST_NAME in WhatsApp greeting', async () => {
    vi.stubEnv('PUBLIC_WHATSAPP_PHONE', '447123456789');
    vi.stubEnv('PUBLIC_ARTIST_NAME', 'Alex');
    vi.resetModules();

    const eventsMod = await import('../../../src/scripts/contact-modal-events');
    const { CONTACT_MODAL_OPEN: OPEN } = eventsMod;

    const mod = await import('../../../src/components/ContactModal');
    const ContactModalCustomArtist = mod.default;

    render(<ContactModalCustomArtist />);

    document.dispatchEvent(new CustomEvent(OPEN));
    await waitFor(() => {
      expect(screen.getByText('Get In Touch')).toBeInTheDocument();
    });

    const link = screen.getByText('Message on WhatsApp').closest('a')!;
    expect(link).not.toBeNull();
    expect(link.getAttribute('href')).toContain('wa.me/447123456789');
    expect(link.getAttribute('href')).toContain(
      'text=Hi%20Alex%2C%20I%20reached%20out%20via%20your%20website.',
    );
    expect(link.getAttribute('href')).not.toContain('Hi%20Sam');

    vi.unstubAllEnvs();
  });
});
