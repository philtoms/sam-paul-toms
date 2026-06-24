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

const sampleProjectDataWithDir = {
  ...sampleProjectData,
  dir: 'Christopher Nolan',
};

const sampleProjectDataEmptyDir = {
  ...sampleProjectData,
  dir: '',
};

const sampleProjectDataWithStartTime = {
  ...sampleProjectData,
  videoStartTime: 45,
};

const sampleProjectDataWithZeroStartTime = {
  ...sampleProjectData,
  videoStartTime: 0,
};

const sampleProjectDataWithPopupImage = {
  ...sampleProjectData,
  popupImage: '/images/projects/heimat-poster.jpeg',
};

const sampleProjectDataWithMarkdownSummary = {
  ...sampleProjectData,
  summaryHtml: '<p><strong>Bold</strong> summary with a <a href="https://example.com">link</a>.</p>',
};

const sampleProjectDataWithPlainTextHtml = {
  ...sampleProjectData,
  summaryHtml: '<p>just plain text</p>',
};

// Two-paragraph summary — the real-world shape produced by renderMarkdown()
// when a project's frontmatter `summary` uses a YAML `|` block scalar
// with a blank line between paragraphs (e.g. src/content/projects/the-solent.md).
const sampleProjectDataWithTwoParagraphs = {
  ...sampleProjectData,
  summaryHtml:
    '<p><strong>Original soundtrack</strong> for the dramatic film <em>Solace</em>.</p>\n<p>A tense, atmospheric score.</p>',
};

// Clickable thumbnail strip fixtures (KB-146). The main video (dQw4w9WgXcQ)
// stays active on open; clicking a thumbnail swaps the embed above it.
const sampleProjectDataWithThumbnails = {
  ...sampleProjectData,
  videoThumbnails: [
    { image: '/images/t1.jpeg', youtubeUrl: 'https://www.youtube.com/watch?v=AbCdEfGhIJK' },
    { image: '/images/t2.jpeg', youtubeUrl: 'https://www.youtube.com/watch?v=ZyXwVuTsR1Q' },
  ],
};

// Thumbnails combined with a start time — proves the start time applies to the
// main video but is suppressed for thumbnail videos.
const sampleProjectDataWithStartTimeAndThumbnails = {
  ...sampleProjectDataWithThumbnails,
  videoStartTime: 45,
};

// Thumbnails but no main video — the embed should seed from the first thumbnail.
const sampleProjectDataThumbnailsOnly = {
  ...sampleProjectDataNoVideo,
  videoThumbnails: [
    { image: '/images/t1.jpeg', youtubeUrl: 'https://www.youtube.com/watch?v=AbCdEfGhIJK' },
  ],
};

// Per-thumbnail start time (KB-151). The first thumbnail carries its own
// startTime (30), independent of the project-level videoStartTime; the second
// thumbnail omits it. Proves each thumbnail start time is independent.
const sampleProjectDataWithThumbnailStartTime = {
  ...sampleProjectDataWithThumbnails,
  videoThumbnails: [
    { image: '/images/t1.jpeg', youtubeUrl: 'https://www.youtube.com/watch?v=AbCdEfGhIJK', startTime: 30 },
    { image: '/images/t2.jpeg', youtubeUrl: 'https://www.youtube.com/watch?v=ZyXwVuTsR1Q' },
  ],
};

// Per-thumbnail startTime AND a project-level videoStartTime — proves the two
// are independent: the main video uses 45, the first thumbnail uses 30.
const sampleProjectDataWithThumbnailAndMainStart = {
  ...sampleProjectDataWithThumbnailStartTime,
  videoStartTime: 45,
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

  it('renders "Directed by …" under summary when dir is provided', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectDataWithDir }),
    );
    await waitFor(() => {
      expect(screen.getByText('Heimat')).toBeInTheDocument();
    });

    const dirLine = screen.getByText(/Directed by Christopher Nolan/);
    expect(dirLine).toBeInTheDocument();
    expect(dirLine.tagName).toBe('P');
  });

  it('does NOT render "Directed by" when dir is omitted', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectData }),
    );
    await waitFor(() => {
      expect(screen.getByText('Heimat')).toBeInTheDocument();
    });

    expect(screen.queryByText(/Directed by/, { exact: false })).toBeNull();
  });

  it('does NOT render "Directed by" when dir is an empty string', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectDataEmptyDir }),
    );
    await waitFor(() => {
      expect(screen.getByText('Heimat')).toBeInTheDocument();
    });

    expect(screen.queryByText(/Directed by/, { exact: false })).toBeNull();
  });

  it('renders summary HTML via dangerouslySetInnerHTML when summaryHtml is provided', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectDataWithMarkdownSummary }),
    );

    await waitFor(() => {
      const bold = screen.getByText('Bold');
      expect(bold).toBeInTheDocument();
      expect(bold.tagName).toBe('STRONG');
    });

    const link = screen.getByText('link');
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('https://example.com');
  });

  it('renders plain-text summaryHtml as a single paragraph in the div', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectDataWithPlainTextHtml }),
    );

    await waitFor(() => {
      expect(screen.getByText('just plain text')).toBeInTheDocument();
    });
  });

  it('renders multi-paragraph summaryHtml correctly (both <p> blocks present)', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectDataWithTwoParagraphs }),
    );

    await waitFor(() => {
      expect(screen.getByText('Heimat')).toBeInTheDocument();
    });

    // First paragraph: "Original soundtrack" wrapped in <strong>
    const bold = screen.getByText('Original soundtrack');
    expect(bold).toBeInTheDocument();
    expect(bold.tagName).toBe('STRONG');

    // Second paragraph: standalone plain text, proving the <div> wrapper
    // preserves both block-level <p> elements (not just the first).
    expect(screen.getByText('A tense, atmospheric score.')).toBeInTheDocument();
  });

  it('falls back to plain summary text in a <p> when summaryHtml is omitted', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectData }),
    );

    await waitFor(() => {
      const summary = screen.getByText(
        'Original soundtrack for the documentary film Heimat.',
      );
      expect(summary).toBeInTheDocument();
      expect(summary.tagName).toBe('P');
    });
  });

  it('renders image even when video is present', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectData }),
    );
    await waitFor(() => {
      expect(screen.getByText('Heimat')).toBeInTheDocument();
    });

    // The image now always renders beside the title/summary, even with a video
    const img = screen.getByAltText('Heimat');
    expect(img).toBeInTheDocument();
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

  it('renders popupImage in the modal when provided', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectDataWithPopupImage }),
    );
    await waitFor(() => {
      expect(screen.getByText('Heimat')).toBeInTheDocument();
    });

    const img = screen.getByAltText('Heimat');
    expect(img.getAttribute('src')).toBe('/images/projects/heimat-poster.jpeg');
  });

  it('falls back to image in the modal when popupImage is omitted', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectData }),
    );
    await waitFor(() => {
      expect(screen.getByText('Heimat')).toBeInTheDocument();
    });

    const img = screen.getByAltText('Heimat');
    expect(img.getAttribute('src')).toBe('/images/heimat.jpeg');
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

  it('renders both image and YouTube iframe when video is present', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectData }),
    );
    await waitFor(() => {
      expect(screen.getByText('Heimat')).toBeInTheDocument();
    });

    // The image is no longer dropped when a video is present
    expect(screen.getByAltText('Heimat')).toBeInTheDocument();

    const iframe = document.querySelector('iframe');
    expect(iframe).not.toBeNull();
    expect(iframe!.getAttribute('src')).toContain('youtube.com/embed/dQw4w9WgXcQ');
  });

  it('image is in a left column and title/summary in a right column (about-layout)', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectData }),
    );
    await waitFor(() => {
      expect(screen.getByText('Heimat')).toBeInTheDocument();
    });

    // The image and title/summary share a two-column <section> (AboutModal bio layout)
    const section = document.querySelector('section');
    expect(section).not.toBeNull();
    expect(section!.querySelector('img')).not.toBeNull();

    // Left column wraps the image
    const imageColumn = document.querySelector('img')!.closest('div');
    expect(imageColumn).not.toBeNull();
    expect(imageColumn!.className).toContain('md:w-2/5');

    // Right column wraps the title and summary (sibling of the image column)
    const textColumn = document.querySelector('h2')!.closest('div');
    expect(textColumn).not.toBeNull();
    expect(textColumn!.className).toContain('md:w-3/5');
    expect(textColumn!.querySelector('h2')).not.toBeNull();
    expect(textColumn!.querySelector('p')).not.toBeNull();
  });

  it('video iframe still renders full-width below the image/summary section', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectData }),
    );
    await waitFor(() => {
      expect(screen.getByText('Heimat')).toBeInTheDocument();
    });

    const section = document.querySelector('section');
    const iframe = document.querySelector('iframe');
    expect(section).not.toBeNull();
    expect(iframe).not.toBeNull();

    const iframeWrapper = iframe!.closest('div')!;

    // The section is not an ancestor of the iframe — they are siblings in the panel
    expect(section!.contains(iframe)).toBe(false);

    // The iframe's container comes after the section in document order
    const position = section!.compareDocumentPosition(iframeWrapper);
    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
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

  it('appends &start=45 to the iframe src when videoStartTime is provided', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectDataWithStartTime }),
    );
    await waitFor(() => {
      expect(screen.getByText('Heimat')).toBeInTheDocument();
    });

    const iframe = document.querySelector('iframe');
    expect(iframe).not.toBeNull();
    expect(iframe!.getAttribute('src')).toBe(
      'https://www.youtube.com/embed/dQw4w9WgXcQ?enablejsapi=1&start=45',
    );
  });

  it('does NOT append start when videoStartTime is omitted', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectData }),
    );
    await waitFor(() => {
      expect(screen.getByText('Heimat')).toBeInTheDocument();
    });

    const iframe = document.querySelector('iframe');
    expect(iframe).not.toBeNull();
    expect(iframe!.getAttribute('src')).not.toMatch(/start=/);
  });

  it('does NOT append start when videoStartTime is 0', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectDataWithZeroStartTime }),
    );
    await waitFor(() => {
      expect(screen.getByText('Heimat')).toBeInTheDocument();
    });

    const iframe = document.querySelector('iframe');
    expect(iframe).not.toBeNull();
    expect(iframe!.getAttribute('src')).not.toMatch(/start=/);
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

  // ---------- Thumbnail strip (KB-146) ----------

  it('renders thumbnail images when videoThumbnails is provided', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectDataWithThumbnails }),
    );
    await waitFor(() => {
      expect(screen.getByText('Heimat')).toBeInTheDocument();
    });

    const thumbButtons = screen.getAllByRole('button', { name: /Play video/ });
    expect(thumbButtons).toHaveLength(2);
    // The thumbnail <img> elements use alt="" (decorative); query by src.
    const imgs = thumbButtons.map((b) => b.querySelector('img'));
    expect(imgs[0]!.getAttribute('src')).toBe('/images/t1.jpeg');
    expect(imgs[1]!.getAttribute('src')).toBe('/images/t2.jpeg');
  });

  it('does NOT render a thumbnail strip when videoThumbnails is omitted', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectData }),
    );
    await waitFor(() => {
      expect(screen.getByText('Heimat')).toBeInTheDocument();
    });

    // No thumbnail buttons — the strip query is scoped to the thumbnail label,
    // so the close button ("Close modal") does not interfere.
    expect(screen.queryAllByRole('button', { name: /Play video/ })).toHaveLength(0);
    expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
  });

  it('clicking a thumbnail updates the main iframe src to that thumbnail video', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectDataWithThumbnails }),
    );
    await waitFor(() => {
      expect(screen.getByText('Heimat')).toBeInTheDocument();
    });

    // Main video (dQw4w9WgXcQ) is shown initially.
    const iframe = () => document.querySelector('iframe')!;
    expect(iframe().getAttribute('src')).toContain('youtube.com/embed/dQw4w9WgXcQ');

    const thumbButtons = screen.getAllByRole('button', { name: /Play video/ });
    fireEvent.click(thumbButtons[0]);

    // Embed swaps to the first thumbnail's video ID.
    expect(iframe().getAttribute('src')).toContain('youtube.com/embed/AbCdEfGhIJK');
  });

  it('does NOT apply videoStartTime to a thumbnail video', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectDataWithStartTimeAndThumbnails }),
    );
    await waitFor(() => {
      expect(screen.getByText('Heimat')).toBeInTheDocument();
    });

    const iframe = () => document.querySelector('iframe')!;
    // The main video carries start=45 on open — proving the fixture is meaningful
    // and the suppression below is a real behaviour, not a vacuous absence.
    expect(iframe().getAttribute('src')).toContain('start=45');

    const thumbButtons = screen.getAllByRole('button', { name: /Play video/ });
    fireEvent.click(thumbButtons[0]);

    // The thumbnail video omits start= entirely.
    expect(iframe().getAttribute('src')).toContain('youtube.com/embed/AbCdEfGhIJK');
    expect(iframe().getAttribute('src')).not.toMatch(/start=/);
  });

  it('marks the active thumbnail with aria-pressed=true and leaves others false', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectDataWithThumbnails }),
    );
    await waitFor(() => {
      expect(screen.getByText('Heimat')).toBeInTheDocument();
    });

    const thumbButtons = () => screen.getAllByRole('button', { name: /Play video/ });

    // On open the main video is active, so neither thumbnail is pressed.
    expect(thumbButtons()[0].getAttribute('aria-pressed')).toBe('false');
    expect(thumbButtons()[1].getAttribute('aria-pressed')).toBe('false');

    fireEvent.click(thumbButtons()[0]);

    // After clicking the first thumbnail, it is pressed and the other is not.
    expect(thumbButtons()[0].getAttribute('aria-pressed')).toBe('true');
    expect(thumbButtons()[1].getAttribute('aria-pressed')).toBe('false');
  });

  it('seeds the embed from the first thumbnail when there is no main video', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectDataThumbnailsOnly }),
    );
    await waitFor(() => {
      expect(screen.getByText('Solace')).toBeInTheDocument();
    });

    // No main video, so the embed initialises to the first thumbnail.
    const iframe = document.querySelector('iframe');
    expect(iframe).not.toBeNull();
    expect(iframe!.getAttribute('src')).toContain('youtube.com/embed/AbCdEfGhIJK');

    // The thumbnail strip still renders.
    expect(screen.getAllByRole('button', { name: /Play video/ })).toHaveLength(1);
  });

  // ---------- Per-thumbnail startTime (KB-151) ----------

  it('appends the thumbnail startTime to the iframe src when a thumbnail has startTime', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectDataWithThumbnailStartTime }),
    );
    await waitFor(() => {
      expect(screen.getByText('Heimat')).toBeInTheDocument();
    });

    const iframe = () => document.querySelector('iframe')!;
    // Main video has no videoStartTime, so no start on open.
    expect(iframe().getAttribute('src')).not.toMatch(/start=/);

    const thumbButtons = screen.getAllByRole('button', { name: /Play video/ });
    fireEvent.click(thumbButtons[0]);

    // The first thumbnail carries startTime: 30 → embed appends &start=30.
    expect(iframe().getAttribute('src')).toContain('youtube.com/embed/AbCdEfGhIJK');
    expect(iframe().getAttribute('src')).toContain('&start=30');
  });

  it('does NOT append start when clicking a thumbnail that has no startTime', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectDataWithThumbnailStartTime }),
    );
    await waitFor(() => {
      expect(screen.getByText('Heimat')).toBeInTheDocument();
    });

    const thumbButtons = screen.getAllByRole('button', { name: /Play video/ });
    // The second thumbnail omits startTime.
    fireEvent.click(thumbButtons[1]);

    const iframe = document.querySelector('iframe')!;
    expect(iframe.getAttribute('src')).toContain('youtube.com/embed/ZyXwVuTsR1Q');
    expect(iframe.getAttribute('src')).not.toMatch(/start=/);
  });

  it('main video uses the project videoStartTime, not a thumbnail startTime, on open', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectDataWithThumbnailAndMainStart }),
    );
    await waitFor(() => {
      expect(screen.getByText('Heimat')).toBeInTheDocument();
    });

    const iframe = document.querySelector('iframe')!;
    // The main video (dQw4w9WgXcQ) uses the project-level start (45), not the
    // first thumbnail's start (30).
    expect(iframe.getAttribute('src')).toContain('youtube.com/embed/dQw4w9WgXcQ');
    expect(iframe.getAttribute('src')).toContain('&start=45');
    expect(iframe.getAttribute('src')).not.toMatch(/start=30/);
  });

  it('restores the main video startTime after switching back from a thumbnail with its own startTime', async () => {
    render(<ProjectModal />);

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectDataWithThumbnailAndMainStart }),
    );
    await waitFor(() => {
      expect(screen.getByText('Heimat')).toBeInTheDocument();
    });

    const iframe = () => document.querySelector('iframe')!;
    // Main video uses the project-level start (45) on open.
    expect(iframe().getAttribute('src')).toContain('&start=45');

    const thumbButtons = screen.getAllByRole('button', { name: /Play video/ });
    fireEvent.click(thumbButtons[0]);

    // The thumbnail uses its own start (30).
    expect(iframe().getAttribute('src')).toContain('&start=30');

    // Re-open the modal — activeVideoUrl is re-seeded to the main video.
    document.dispatchEvent(new CustomEvent('project-modal:close'));
    await waitFor(() => {
      expect(screen.queryByText('Heimat')).not.toBeInTheDocument();
    }, { timeout: 1000 });

    document.dispatchEvent(
      new CustomEvent('project-modal:open', { detail: sampleProjectDataWithThumbnailAndMainStart }),
    );
    await waitFor(() => {
      expect(screen.getByText('Heimat')).toBeInTheDocument();
    });

    // The main video's start (45) is restored, not the thumbnail's (30).
    expect(iframe().getAttribute('src')).toContain('&start=45');
    expect(iframe().getAttribute('src')).not.toMatch(/start=30/);
  });
});
