// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/preact';
import ContactModal from '../../../src/components/ContactModal';

describe('ContactModal', () => {
  beforeEach(() => {
    document.body.classList.remove('overflow-hidden');
  });

  afterEach(() => {
    document.body.classList.remove('overflow-hidden');
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

    // Click the backdrop (the dialog overlay, not the panel)
    const dialog = screen.getByRole('dialog');
    fireEvent.click(dialog);

    // Wait for fade-out animation
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

  it('locks body scroll when open and restores on close', async () => {
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
});
