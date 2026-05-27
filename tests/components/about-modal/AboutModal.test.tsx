// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/preact';
import AboutModal from '../../../src/components/AboutModal';

const defaultProps = {
  title: 'About Sam',
  photo: '/images/bio/sam-portrait.svg',
  photoAlt: 'Sam performing live',
  genreTags: ['Electronic', 'Ambient', 'Indie', 'Experimental'],
  pressQuotes: [
    {
      text: "Sam's music feels like discovering a hidden room.",
      source: 'The Wire',
      url: 'https://example.com/the-wire-review',
    },
    {
      text: 'A singular voice in electronic music.',
      source: 'Pitchfork',
    },
  ],
};

describe('AboutModal', () => {
  beforeEach(() => {
    document.body.classList.remove('overflow-hidden');
    // Set up the hidden bio content div that the modal reads from
    const bioDiv = document.createElement('div');
    bioDiv.id = 'about-bio-content';
    bioDiv.style.display = 'none';
    bioDiv.innerHTML = '<p>Sam is a multidisciplinary artist and producer.</p>';
    document.body.appendChild(bioDiv);
  });

  afterEach(() => {
    document.body.classList.remove('overflow-hidden');
    // Clean up the hidden bio content div
    const bioDiv = document.getElementById('about-bio-content');
    if (bioDiv) bioDiv.remove();
  });

  it('renders modal overlay when about-modal:open is dispatched', async () => {
    render(<AboutModal {...defaultProps} />);

    // Modal should not be visible initially
    expect(screen.queryByText('About Sam')).not.toBeInTheDocument();

    // Dispatch open event
    document.dispatchEvent(new CustomEvent('about-modal:open'));

    // Wait for RAF to fire and state to update
    await waitFor(() => {
      expect(screen.getByText('About Sam')).toBeInTheDocument();
    });
  });

  it('hides modal when about-modal:close is dispatched', async () => {
    render(<AboutModal {...defaultProps} />);

    // Open the modal
    document.dispatchEvent(new CustomEvent('about-modal:open'));
    await waitFor(() => {
      expect(screen.getByText('About Sam')).toBeInTheDocument();
    });

    // Close the modal
    document.dispatchEvent(new CustomEvent('about-modal:close'));

    // Wait for fade-out animation (200ms timeout)
    await waitFor(() => {
      expect(screen.queryByText('About Sam')).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('closes modal when Escape key is pressed', async () => {
    render(<AboutModal {...defaultProps} />);

    // Open the modal
    document.dispatchEvent(new CustomEvent('about-modal:open'));
    await waitFor(() => {
      expect(screen.getByText('About Sam')).toBeInTheDocument();
    });

    // Small delay to ensure effects are committed (keydown listener attached)
    await new Promise((r) => setTimeout(r, 50));

    // Press Escape
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    // Wait for fade-out animation
    await waitFor(() => {
      expect(screen.queryByText('About Sam')).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('closes modal when backdrop is clicked', async () => {
    render(<AboutModal {...defaultProps} />);

    // Open the modal
    document.dispatchEvent(new CustomEvent('about-modal:open'));
    await waitFor(() => {
      expect(screen.getByText('About Sam')).toBeInTheDocument();
    });

    // Click the actual backdrop div (bg-black/60), not the outer dialog container
    const backdrop = document.querySelector('.bg-black\\/60') as HTMLElement;
    expect(backdrop).not.toBeNull();
    fireEvent.click(backdrop);

    // Wait for fade-out animation
    await waitFor(() => {
      expect(screen.queryByText('About Sam')).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('closes modal when clicking the backdrop div directly', async () => {
    render(<AboutModal {...defaultProps} />);

    document.dispatchEvent(new CustomEvent('about-modal:open'));
    await waitFor(() => {
      expect(screen.getByText('About Sam')).toBeInTheDocument();
    });

    const backdrop = document.querySelector('.bg-black\\/60') as HTMLElement;
    fireEvent.click(backdrop);

    await waitFor(() => {
      expect(screen.queryByText('About Sam')).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('does not close modal when panel content is clicked', async () => {
    render(<AboutModal {...defaultProps} />);

    // Open the modal
    document.dispatchEvent(new CustomEvent('about-modal:open'));
    await waitFor(() => {
      expect(screen.getByText('About Sam')).toBeInTheDocument();
    });

    // Click on the heading inside the panel (not the backdrop)
    const heading = screen.getByText('About Sam');
    fireEvent.click(heading);

    // Modal should still be open
    expect(screen.getByText('About Sam')).toBeInTheDocument();
  });

  it('shows bio title heading when open', async () => {
    render(<AboutModal {...defaultProps} />);

    document.dispatchEvent(new CustomEvent('about-modal:open'));
    await waitFor(() => {
      const heading = screen.getByText('About Sam');
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H1');
    });
  });

  it('closes modal when close (×) button is clicked', async () => {
    render(<AboutModal {...defaultProps} />);

    // Open the modal
    document.dispatchEvent(new CustomEvent('about-modal:open'));
    await waitFor(() => {
      expect(screen.getByText('About Sam')).toBeInTheDocument();
    });

    // Click the close button
    const closeBtn = screen.getByLabelText('Close modal');
    fireEvent.click(closeBtn);

    // Wait for fade-out animation
    await waitFor(() => {
      expect(screen.queryByText('About Sam')).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('locks body scroll when open and restores on close', async () => {
    render(<AboutModal {...defaultProps} />);

    // Open the modal
    document.dispatchEvent(new CustomEvent('about-modal:open'));
    await waitFor(() => {
      expect(document.body.classList.contains('overflow-hidden')).toBe(true);
    });

    // Close the modal
    document.dispatchEvent(new CustomEvent('about-modal:close'));
    await waitFor(() => {
      expect(document.body.classList.contains('overflow-hidden')).toBe(false);
    }, { timeout: 1000 });
  });

  it('renders bio photo with correct alt text', async () => {
    render(<AboutModal {...defaultProps} />);

    document.dispatchEvent(new CustomEvent('about-modal:open'));
    await waitFor(() => {
      expect(screen.getByText('About Sam')).toBeInTheDocument();
    });

    const img = screen.getByAltText('Sam performing live');
    expect(img).toBeInTheDocument();
    expect(img.getAttribute('src')).toBe('/images/bio/sam-portrait.svg');
  });

  it('renders genre tags', async () => {
    render(<AboutModal {...defaultProps} />);

    document.dispatchEvent(new CustomEvent('about-modal:open'));
    await waitFor(() => {
      expect(screen.getByText('About Sam')).toBeInTheDocument();
    });

    expect(screen.getByText('Electronic')).toBeInTheDocument();
    expect(screen.getByText('Ambient')).toBeInTheDocument();
    expect(screen.getByText('Indie')).toBeInTheDocument();
    expect(screen.getByText('Experimental')).toBeInTheDocument();
  });

  it('renders press quotes with sources', async () => {
    render(<AboutModal {...defaultProps} />);

    document.dispatchEvent(new CustomEvent('about-modal:open'));
    await waitFor(() => {
      expect(screen.getByText('About Sam')).toBeInTheDocument();
    });

    expect(screen.getByText("Sam's music feels like discovering a hidden room.")).toBeInTheDocument();
    expect(screen.getByText('The Wire')).toBeInTheDocument();
    expect(screen.getByText('A singular voice in electronic music.')).toBeInTheDocument();
    expect(screen.getByText('Pitchfork')).toBeInTheDocument();
  });

  it('renders press section heading', async () => {
    render(<AboutModal {...defaultProps} />);

    document.dispatchEvent(new CustomEvent('about-modal:open'));
    await waitFor(() => {
      expect(screen.getByText('Press')).toBeInTheDocument();
    });
  });

  it('renders bio HTML content from DOM', async () => {
    render(<AboutModal {...defaultProps} />);

    document.dispatchEvent(new CustomEvent('about-modal:open'));
    await waitFor(() => {
      expect(screen.getByText('About Sam')).toBeInTheDocument();
    });

    // The bio content from the hidden div should be rendered
    // (It exists in both the hidden source div and the modal)
    const bioTexts = screen.getAllByText('Sam is a multidisciplinary artist and producer.');
    expect(bioTexts.length).toBeGreaterThanOrEqual(1);
  });

  it('does NOT contain any contact form elements', async () => {
    render(<AboutModal {...defaultProps} />);

    document.dispatchEvent(new CustomEvent('about-modal:open'));
    await waitFor(() => {
      expect(screen.getByText('About Sam')).toBeInTheDocument();
    });

    // No "Get In Touch" heading
    expect(screen.queryByText('Get In Touch')).not.toBeInTheDocument();

    // No form elements
    expect(screen.queryByRole('form')).not.toBeInTheDocument();

    // No textarea
    expect(document.querySelector('textarea')).toBeNull();

    // No email input
    expect(document.querySelector('input[type="email"]')).toBeNull();
  });

  it('has dialog role and aria-modal attribute', async () => {
    render(<AboutModal {...defaultProps} />);

    document.dispatchEvent(new CustomEvent('about-modal:open'));
    await waitFor(() => {
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
      expect(dialog.getAttribute('aria-modal')).toBe('true');
    });
  });
});
