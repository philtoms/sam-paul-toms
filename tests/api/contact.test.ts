import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock Resend before importing the route
const mockSend = vi.fn();
vi.mock('resend', () => {
  return {
    Resend: class {
      emails = { send: mockSend };
    },
  };
});

// Dynamic import so mocks are in place
const { POST } = await import('../../src/pages/api/contact');

function makeRequest(body: unknown): Request {
  return new Request('http://localhost:4321/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function makeMalformedRequest(): Request {
  return new Request('http://localhost:4321/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: 'not valid json{{{',
  });
}

type PostContext = Parameters<typeof POST>[0];
const mockContext = (request: Request): PostContext =>
  ({ request, site: new URL('http://localhost:4321') }) as unknown as PostContext;

describe('POST /api/contact', () => {
  beforeEach(() => {
    mockSend.mockReset();
    // Default: Resend send succeeds
    mockSend.mockResolvedValue({ id: 'email-id-123' });
    // Stub env vars used by the API route
    vi.stubEnv('CONTACT_FROM_EMAIL', 'onboarding@resend.dev');
    vi.stubEnv('CONTACT_RECIPIENT_EMAIL', 'hello@sampaultoms.uk');
  });

  it('returns { ok: true } with status 200 for a valid submission', async () => {
    const response = await POST(
      mockContext(
        makeRequest({
          name: 'Sam',
          email: 'sam@example.com',
          message: 'Hello, this is a test.',
        }),
      ),
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.ok).toBe(true);
    expect(mockSend).toHaveBeenCalledTimes(2);
  });

  it('sends email with correct fields via Resend', async () => {
    await POST(
      mockContext(
        makeRequest({
          name: 'Alice',
          email: 'alice@test.com',
          message: 'Test message.',
        }),
      ),
    );

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'onboarding@resend.dev',
        subject: 'Contact form: Alice',
        text: expect.stringContaining('Alice'),
        replyTo: 'alice@test.com',
      }),
    );
  });

  it('returns 400 when required fields are missing', async () => {
    const response = await POST(
      mockContext(
        makeRequest({
          name: '',
          email: '',
          message: '',
        }),
      ),
    );

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.ok).toBe(false);
    expect(data.error).toBeDefined();
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('returns 400 for invalid email format', async () => {
    const response = await POST(
      mockContext(
        makeRequest({
          name: 'Sam',
          email: 'not-an-email',
          message: 'Hello!',
        }),
      ),
    );

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.ok).toBe(false);
    expect(data.error).toMatch(/valid email/i);
  });

  it('returns 400 when message exceeds max length', async () => {
    const response = await POST(
      mockContext(
        makeRequest({
          name: 'Sam',
          email: 'sam@example.com',
          message: 'x'.repeat(5001),
        }),
      ),
    );

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.ok).toBe(false);
    expect(data.error).toMatch(/5,000/i);
  });

  it('returns { ok: true } with 200 when honeypot field is filled (silent rejection)', async () => {
    const response = await POST(
      mockContext(
        makeRequest({
          name: 'Bot',
          email: 'bot@spam.com',
          message: 'Spam content',
          fax: 'http://spam-site.com',
        }),
      ),
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.ok).toBe(true);
    // Crucially: no email sent
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('returns 500 with error message when Resend API fails', async () => {
    mockSend.mockRejectedValue(new Error('Resend API error'));

    const response = await POST(
      mockContext(
        makeRequest({
          name: 'Sam',
          email: 'sam@example.com',
          message: 'Hello!',
        }),
      ),
    );

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.ok).toBe(false);
    expect(data.error).toBe('Failed to send message. Please try again later.');
  });

  it('returns 400 for malformed JSON body', async () => {
    const response = await POST(mockContext(makeMalformedRequest()));

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.ok).toBe(false);
    expect(data.error).toBeDefined();
  });

  it('returns 400 when name exceeds max length', async () => {
    const response = await POST(
      mockContext(
        makeRequest({
          name: 'x'.repeat(201),
          email: 'sam@example.com',
          message: 'Hello!',
        }),
      ),
    );

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.ok).toBe(false);
    expect(data.error).toMatch(/200/i);
  });

  it('returns 400 when email exceeds max length', async () => {
    const response = await POST(
      mockContext(
        makeRequest({
          name: 'Sam',
          email: `${'x'.repeat(190)}@example.com`,
          message: 'Hello!',
        }),
      ),
    );

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.ok).toBe(false);
  });

  // === Auto-Reply Tests ===

  it('sends auto-reply to submitter on valid submission', async () => {
    await POST(
      mockContext(
        makeRequest({
          name: 'Bob',
          email: 'bob@example.com',
          message: 'Love your music!',
        }),
      ),
    );

    // Two send calls: notification to Sam + auto-reply to submitter
    expect(mockSend).toHaveBeenCalledTimes(2);

    // Second call is the auto-reply
    const autoReplyCall = mockSend.mock.calls[1][0];
    expect(autoReplyCall).toEqual(
      expect.objectContaining({
        from: 'onboarding@resend.dev',
        to: 'bob@example.com',
        subject: 'Thank you for your message',
        text: expect.stringContaining('Bob'),
        replyTo: 'hello@sampaultoms.uk',
      }),
    );
  });

  it('does not send auto-reply when honeypot field is filled', async () => {
    await POST(
      mockContext(
        makeRequest({
          name: 'Bot',
          email: 'bot@spam.com',
          message: 'Spam content',
          fax: 'http://spam-site.com',
        }),
      ),
    );

    // Zero send calls: no notification, no auto-reply
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('returns { ok: true } when auto-reply fails but notification succeeds', async () => {
    // First call (notification) succeeds, second call (auto-reply) fails
    mockSend
      .mockResolvedValueOnce({ id: 'notification-id' })
      .mockRejectedValueOnce(new Error('Auto-reply failed'));

    const response = await POST(
      mockContext(
        makeRequest({
          name: 'Carol',
          email: 'carol@example.com',
          message: 'Test message.',
        }),
      ),
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.ok).toBe(true);
    // Both calls were attempted
    expect(mockSend).toHaveBeenCalledTimes(2);
  });

  it('sets auto-reply replyTo to CONTACT_RECIPIENT_EMAIL', async () => {
    await POST(
      mockContext(
        makeRequest({
          name: 'Dave',
          email: 'dave@example.com',
          message: 'Great work!',
        }),
      ),
    );

    // Verify the auto-reply (second call) has replyTo set to Sam's email
    const autoReplyCall = mockSend.mock.calls[1][0];
    expect(autoReplyCall.replyTo).toBe('hello@sampaultoms.uk');
  });

  it('uses PUBLIC_ARTIST_NAME in auto-reply sign-off', async () => {
    vi.stubEnv('PUBLIC_ARTIST_NAME', 'Alex');

    await POST(
      mockContext(
        makeRequest({
          name: 'Eve',
          email: 'eve@example.com',
          message: 'Hello!',
        }),
      ),
    );

    const autoReplyCall = mockSend.mock.calls[1][0];
    expect(autoReplyCall.text).toContain('Best,\nAlex');
    expect(autoReplyCall.text).not.toContain('Best,\nSam');
  });

  it('derives site hostname from SITE_URL in auto-reply', async () => {
    vi.stubEnv('SITE_URL', 'https://customdomain.com');

    await POST(
      mockContext(
        makeRequest({
          name: 'Frank',
          email: 'frank@example.com',
          message: 'Hello!',
        }),
      ),
    );

    const autoReplyCall = mockSend.mock.calls[1][0];
    expect(autoReplyCall.text).toContain('customdomain.com');
    expect(autoReplyCall.text).not.toContain('sampaultoms.com');
  });

  it('falls back to Sam and sampaultoms.com when env vars are not set', async () => {
    // Reset any env vars from previous tests
    vi.stubEnv('PUBLIC_ARTIST_NAME', '');
    vi.stubEnv('SITE_URL', '');

    await POST(
      mockContext(
        makeRequest({
          name: 'Grace',
          email: 'grace@example.com',
          message: 'Hello!',
        }),
      ),
    );

    const autoReplyCall = mockSend.mock.calls[1][0];
    expect(autoReplyCall.text).toContain('Best,\nSam');
    expect(autoReplyCall.text).toContain('sampaultoms.com');
  });
});

describe('POST /api/contact — Turnstile verification', () => {
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    mockSend.mockReset();
    mockSend.mockResolvedValue({ id: 'email-id-123' });
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.unstubAllEnvs();
  });

  it('succeeds when Turnstile verification passes', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'test-secret-key');

    // Mock global fetch for the Turnstile siteverify call
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    const response = await POST(
      mockContext(
        makeRequest({
          name: 'Sam',
          email: 'sam@example.com',
          message: 'Hello!',
          turnstileToken: 'valid-turnstile-token',
        }),
      ),
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.ok).toBe(true);

    // Turnstile siteverify was called
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ secret: 'test-secret-key', response: 'valid-turnstile-token' }),
      }),
    );

    // Email was sent
    expect(mockSend).toHaveBeenCalledTimes(2);
  });

  it('returns 400 when Turnstile verification fails', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'test-secret-key');

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: false }),
    });

    const response = await POST(
      mockContext(
        makeRequest({
          name: 'Sam',
          email: 'sam@example.com',
          message: 'Hello!',
          turnstileToken: 'invalid-turnstile-token',
        }),
      ),
    );

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.ok).toBe(false);
    expect(data.error).toBe('Bot verification failed. Please try again.');

    // No email sent
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('skips Turnstile verification when secret key is not set', async () => {
    // No TURNSTILE_SECRET_KEY stubbed — it's empty/undefined

    const response = await POST(
      mockContext(
        makeRequest({
          name: 'Sam',
          email: 'sam@example.com',
          message: 'Hello!',
          turnstileToken: 'some-token',
        }),
      ),
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.ok).toBe(true);

    // Email was sent (no Turnstile check)
    expect(mockSend).toHaveBeenCalledTimes(2);
  });

  it('proceeds normally when token sent but secret key is missing', async () => {
    // No TURNSTILE_SECRET_KEY stubbed

    const response = await POST(
      mockContext(
        makeRequest({
          name: 'Sam',
          email: 'sam@example.com',
          message: 'Hello!',
          turnstileToken: 'orphaned-token',
        }),
      ),
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.ok).toBe(true);
    expect(mockSend).toHaveBeenCalledTimes(2);
  });

  it('proceeds normally when secret key is set but no token sent', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'test-secret-key');

    // No Turnstile token in the request body — widget may have failed to load

    const response = await POST(
      mockContext(
        makeRequest({
          name: 'Sam',
          email: 'sam@example.com',
          message: 'Hello!',
        }),
      ),
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.ok).toBe(true);

    // Email was sent (graceful skip — no token to verify)
    expect(mockSend).toHaveBeenCalledTimes(2);
  });

  it('returns 400 when Turnstile verification fetch throws a network error', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'test-secret-key');

    // Simulate network error during Turnstile verification
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const response = await POST(
      mockContext(
        makeRequest({
          name: 'Sam',
          email: 'sam@example.com',
          message: 'Hello!',
          turnstileToken: 'some-token',
        }),
      ),
    );

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.ok).toBe(false);
    expect(data.error).toBe('Bot verification failed. Please try again.');
    expect(mockSend).not.toHaveBeenCalled();
  });
});
