import type { APIRoute } from 'astro';
import { z } from 'zod';
import { Resend } from 'resend';

/**
 * Verify a Cloudflare Turnstile token against the siteverify endpoint.
 * Returns true if verification succeeds, false otherwise.
 * Catches network errors and returns false so the form degrades gracefully.
 */
async function verifyTurnstile(
  token: string,
  secretKey: string,
): Promise<boolean> {
  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: secretKey, response: token }),
      },
    );
    const data = await response.json();
    return data.success === true;
  } catch {
    return false;
  }
}

const contactSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required.')
    .max(200, 'Name must be 200 characters or fewer.'),
  email: z
    .string()
    .min(1, 'Email is required.')
    .email('Please enter a valid email address.')
    .max(200, 'Email must be 200 characters or fewer.'),
  message: z
    .string()
    .min(1, 'Message is required.')
    .max(5000, 'Message must be 5,000 characters or fewer.'),
  fax: z.string().optional(),
  turnstileToken: z.string().optional(),
});

export const POST: APIRoute = async ({ request }) => {
  // Parse JSON body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: 'Invalid request body.' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  // Honeypot check — if the hidden "fax" field is filled, silently accept
  if (
    typeof body === 'object' &&
    body !== null &&
    'fax' in body &&
    typeof (body as Record<string, unknown>).fax === 'string' &&
    ((body as Record<string, unknown>).fax as string).trim() !== ''
  ) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Server-side validation
  const result = contactSchema.safeParse(body);
  if (!result.success) {
    const firstError = result.error.issues[0]?.message ?? 'Validation failed.';
    return new Response(JSON.stringify({ ok: false, error: firstError }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { name, email, message } = result.data;

  // Turnstile verification — only runs when secret key is configured AND a token is provided.
  // If either is missing, we skip verification and rely on honeypot-only protection.
  const turnstileSecretKey = import.meta.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecretKey && result.data.turnstileToken) {
    const isValid = await verifyTurnstile(
      result.data.turnstileToken,
      turnstileSecretKey,
    );
    if (!isValid) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'Bot verification failed. Please try again.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }
  }

  // Send email via Resend
  const resend = new Resend(import.meta.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: import.meta.env.CONTACT_FROM_EMAIL,
      to: import.meta.env.CONTACT_RECIPIENT_EMAIL,
      subject: `Contact form: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      replyTo: email,
    });
  } catch {
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'Failed to send message. Please try again later.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  // Send auto-reply to the submitter (best-effort — failure does not affect the response)
  try {
    await resend.emails.send({
      from: import.meta.env.CONTACT_FROM_EMAIL,
      to: email,
      subject: 'Thank you for your message',
      text: `Hi ${name},\n\nThank you for getting in touch via the contact form on sampaultoms.com. I've received your message and will get back to you as soon as possible.\n\nBest,\nSam`,
      replyTo: import.meta.env.CONTACT_RECIPIENT_EMAIL,
    });
  } catch {
    // Auto-reply failure is non-critical — log but don't change the response
    console.error('Failed to send auto-reply email:', { name, email });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
