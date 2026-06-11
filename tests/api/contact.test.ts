import { describe, it, expect, vi, beforeEach } from 'vitest';

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

const mockContext = (request: Request) => ({ request, site: new URL('http://localhost:4321') });

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
      ) as any,
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
      ) as any,
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
      ) as any,
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
      ) as any,
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
      ) as any,
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
      ) as any,
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
      ) as any,
    );

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.ok).toBe(false);
    expect(data.error).toBe('Failed to send message. Please try again later.');
  });

  it('returns 400 for malformed JSON body', async () => {
    const response = await POST(mockContext(makeMalformedRequest()) as any);

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
      ) as any,
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
      ) as any,
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
      ) as any,
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
      ) as any,
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
      ) as any,
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
      ) as any,
    );

    // Verify the auto-reply (second call) has replyTo set to Sam's email
    const autoReplyCall = mockSend.mock.calls[1][0];
    expect(autoReplyCall.replyTo).toBe('hello@sampaultoms.uk');
  });
});
