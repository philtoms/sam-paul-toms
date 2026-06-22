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
});
