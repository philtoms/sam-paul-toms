// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/preact';
import ProjectModal from '../../../src/components/ProjectModal';

const sampleProjectData = {
  title: 'Heimat',
  summary: 'Original soundtrack for the documentary film Heimat.',
  image: '/images/heimat.jpeg',
  video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  publishDate: '2024-06-01T00:00:00.000Z',
};

const sampleProjectDataNoVideo = {
  title: 'Solace',
  summary: 'A contemplative collection of ambient works.',
  image: '/images/solace.jpeg',
  publishDate: '2023-11-20T00:00:00.000Z',
};

describe('ProjectModal', () => {
  beforeEach(() => {
    document.body.classList.remove('overflow-hidden');
  });

  afterEach(() => {
    document.body.classList.remove('overflow-hidden');
  });

  it('is not visible initially', () => {
    render(<ProjectModal />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens on project-modal:open event with project data', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectData }),
    );

    await waitFor(() => {
      expect(screen.getByText('Heimat')).toBeInTheDocument();
    });
  });

  it('closes on project-modal:close event', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectData }),
    );
    await waitFor(() => {
      expect(screen.getByText('Heimat')).toBeInTheDocument();
    });

    document.dispatchEvent(new CustomEvent('project-modal:close'));

    await waitFor(() => {
      expect(screen.queryByText('Heimat')).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('closes on Escape key', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectData }),
    );
    await waitFor(() => {
      expect(screen.getByText('Heimat')).toBeInTheDocument();
    });

    await new Promise((r) => setTimeout(r, 50));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    await waitFor(() => {
      expect(screen.queryByText('Heimat')).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('closes on backdrop click', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectData }),
    );
    await waitFor(() => {
      expect(screen.getByText('Heimat')).toBeInTheDocument();
    });

    const backdrop = document.querySelector('.bg-black\\/60') as HTMLElement;
    expect(backdrop).not.toBeNull();
    fireEvent.click(backdrop);

    await waitFor(() => {
      expect(screen.queryByText('Heimat')).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('closes on × button click', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectData }),
    );
    await waitFor(() => {
      expect(screen.getByText('Heimat')).toBeInTheDocument();
    });

    const closeBtn = screen.getByLabelText('Close modal');
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByText('Heimat')).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('does not close when panel content is clicked', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectData }),
    );
    await waitFor(() => {
      expect(screen.getByText('Heimat')).toBeInTheDocument();
    });

    const heading = screen.getByText('Heimat');
    fireEvent.click(heading);

    // Modal should still be open
    expect(screen.getByText('Heimat')).toBeInTheDocument();
  });

  it('renders project title when open', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectData }),
    );
    await waitFor(() => {
      const heading = screen.getByText('Heimat');
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H2');
    });
  });

  it('renders project summary when open', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectData }),
    );
    await waitFor(() => {
      expect(screen.getByText('Original soundtrack for the documentary film Heimat.')).toBeInTheDocument();
    });
  });

  it('does NOT render image when video is present', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectData }),
    );
    await waitFor(() => {
      expect(screen.getByText('Heimat')).toBeInTheDocument();
    });

    // Image should not appear when a video URL is provided
    const img = screen.queryByAltText('Heimat');
    expect(img).not.toBeInTheDocument();
  });

  it('renders project image when no video is available', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectDataNoVideo }),
    );
    await waitFor(() => {
      expect(screen.getByText('Solace')).toBeInTheDocument();
    });

    const img = screen.getByAltText('Solace');
    expect(img).toBeInTheDocument();
    expect(img.getAttribute('src')).toBe('/images/solace.jpeg');
  });

  it('renders YouTube iframe when video URL is provided', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectData }),
    );
    await waitFor(() => {
      expect(screen.getByText('Heimat')).toBeInTheDocument();
    });

    const iframe = document.querySelector('iframe');
    expect(iframe).not.toBeNull();
    expect(iframe!.getAttribute('src')).toContain('youtube.com/embed/dQw4w9WgXcQ');
  });

  it('does NOT render iframe when video is omitted', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectDataNoVideo }),
    );
    await waitFor(() => {
      expect(screen.getByText('Solace')).toBeInTheDocument();
    });

    const iframe = document.querySelector('iframe');
    expect(iframe).toBeNull();
  });

  it('does NOT render formatted publish date', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectData }),
    );
    await waitFor(() => {
      expect(screen.getByText('Heimat')).toBeInTheDocument();
    });

    // The publishDate is 2024-06-01 — verify neither "1 June 2024" nor "June 1, 2024" appears
    expect(screen.queryByText('1 June 2024')).not.toBeInTheDocument();
    expect(screen.queryByText('June 1, 2024')).not.toBeInTheDocument();
  });

  it('has role="dialog" and aria-modal="true"', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectData }),
    );
    await waitFor(() => {
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
      expect(dialog.getAttribute('aria-modal')).toBe('true');
    });
  });

  it('has aria-label with project title', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectData }),
    );
    await waitFor(() => {
      const dialog = screen.getByRole('dialog');
      expect(dialog.getAttribute('aria-label')).toBe('Heimat');
    });
  });
});
