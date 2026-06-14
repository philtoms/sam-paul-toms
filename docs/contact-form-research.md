# Contact Form Backend Research

**Task:** KB-100
**Date:** 2026-06-11
**Status:** Recommendation ready for owner review

---

## 1. Current State

### Forms

Two form variants exist, both with identical fields and client-side validation but no backend:

| Aspect            | `ContactModal.tsx`                                                            | `ContactForm.astro`                               |
| ----------------- | ----------------------------------------------------------------------------- | ------------------------------------------------- |
| **Type**          | Preact component (interactive)                                                | Static Astro component                            |
| **Fields**        | `name`, `email`, `message`                                                    | `name`, `email`, `message`                        |
| **Validation**    | Preact state + `isValidEmail()` regex                                         | Inline `<script>` with same regex                 |
| **Submission**    | `handleSubmit` prevents default, validates, resets form, shows success for 3s | Same behaviour — validates, resets, shows success |
| **Network calls** | None — simulated only                                                         | None — simulated only                             |

### Server infrastructure

- **Astro config:** `output: 'server'` with `@astrojs/cloudflare` adapter
- **API routes:** Fully supported — `src/pages/api/` directory can serve serverless functions on Cloudflare Pages Functions (Workers runtime)
- **Current API directory:** Does not exist yet — needs to be created
- **Env var pattern:** `PUBLIC_*` prefix for client-side, unprefixed for server-only (see `.env.example`)
- **Deployment:** Cloudflare Pages with R2, free tier, cost-sensitive

### What `handleSubmit` needs to become

Both forms need their submission logic changed to:

1. POST form data (`{ name, email, message }`) to an API endpoint (e.g. `/api/contact`)
2. Handle success: show confirmation message
3. Handle error: show error message, allow retry
4. Preserve existing client-side validation (don't remove it)

---

## 2. Options Evaluated

### Comparison Matrix

| Option                       | Free Tier                     | Setup Effort | Cloudflare Workers Compatible | New npm Deps                    | New Env Vars                                                     | Spam Protection                | Data Privacy                   | Best For                   |
| ---------------------------- | ----------------------------- | ------------ | ----------------------------- | ------------------------------- | ---------------------------------------------------------------- | ------------------------------ | ------------------------------ | -------------------------- |
| **Resend**                   | 100 emails/day (3,000/mo)     | Low          | Yes (fetch-based)             | `resend` (lightweight)          | `RESEND_API_KEY`                                                 | Via your API route             | Excellent (you control flow)   | Solo dev email delivery    |
| **SendGrid**                 | 100 emails/day                | Low–Medium   | Partial (Node.js deps)        | `@sendgrid/mail` (heavier tree) | `SENDGRID_API_KEY`                                               | Via your API route             | Excellent                      | Larger-scale email ops     |
| **Mailgun**                  | No true free tier (~$0.80/1k) | Medium       | Partial (depends on `axios`)  | `mailgun.js`                    | `MAILGUN_API_KEY`, `MAILGUN_DOMAIN`                              | Via your API route             | Excellent                      | Domain-level email infra   |
| **Cloudflare Email Workers** | Free (receive only)           | High         | Native                        | None                            | Email Routing config                                             | Built-in                       | Excellent                      | Inbound email processing   |
| **WhatsApp (Twilio API)**    | ~$0.005/msg (no free tier)    | High         | Partial                       | `twilio` (heavy)                | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` | Via your API route             | Moderate (phone exposure risk) | Real-time notification     |
| **WhatsApp (wa.me link)**    | Free                          | Trivial      | N/A (no backend)              | None                            | None                                                             | None                           | Poor (phone in URL)            | Quick chat fallback        |
| **Formspree**                | 50 submissions/mo             | Trivial      | N/A (external POST)           | None                            | `FORMSPREE_FORM_ID`                                              | Built-in (spam filtering)      | Moderate (3rd-party stored)    | Zero-backend forms         |
| **Getform**                  | 50 submissions/mo             | Trivial      | N/A (external POST)           | None                            | `GETFORM_API_KEY`                                                | Built-in                       | Moderate                       | Zero-backend forms         |
| **Basin**                    | 100 submissions/mo            | Trivial      | N/A (external POST)           | None                            | `BASIN_FORM_ID`                                                  | Built-in                       | Moderate                       | Zero-backend forms         |
| **Astro API route + Resend** | 100 emails/day (3,000/mo)     | Low          | Yes                           | `resend`                        | `RESEND_API_KEY`                                                 | Honeypot + rate limit (custom) | Excellent                      | Full control, minimal deps |

### Detailed Notes per Option

#### Resend

- Modern email API designed for developers. Clean REST API; SDK is thin and fetch-based.
- **Free tier:** 100 emails/day, 3,000/month — generous for a portfolio site.
- **Edge compatible:** The `resend` npm package (v6.x) uses the standard `fetch` API internally and works in Cloudflare Workers without polyfills.
- **Dependencies:** `postal-mime` + `standardwebhooks` — lightweight, no Node.js-specific modules.
- **Setup:** Create account → verify sending domain → add `RESEND_API_KEY` env var → done.
- **Verdict:** Best-in-class for this use case. Simple, modern, edge-native, generous free tier.

#### SendGrid

- Mature email service with a large feature set (templates, analytics, suppression lists).
- **Free tier:** 100 emails/day — same as Resend.
- **Edge compatibility concern:** The `@sendgrid/mail` package depends on `@sendgrid/client`, which historically uses Node.js `http`/`https` modules. While SendGrid has improved edge support, it's not as cleanly fetch-based as Resend and may require workarounds in the Cloudflare Workers runtime.
- **Verdict:** Capable but heavier than needed. Better suited for projects already in the Twilio/SendGrid ecosystem.

#### Mailgun

- Email service focused on transactional and bulk email. Powerful but overkill for a contact form.
- **No true free tier:** The Flex plan is pay-as-you-go (~$0.80 per 1,000 emails). No free allocation.
- **Edge compatibility concern:** Depends on `axios`, which adds bundle weight and has had edge runtime issues.
- **Verdict:** Rejected — no free tier, heavier dependency, more complexity than warranted.

#### Cloudflare Email Workers

- Cloudflare's Email Routing lets you receive emails at your domain and process them with a Worker.
- **Not applicable for outbound email:** Email Workers are for receiving and processing inbound email. To _send_ email from a contact form, you still need an outbound email API (Resend, SendGrid, etc.).
- **Setup complexity:** Requires domain MX records on Cloudflare, Email Routing configuration, and a dedicated Worker.
- **Verdict:** Rejected for this use case — it solves inbound routing, not outbound sending. Could be useful _in addition_ to an email API for features like auto-reply, but that's out of scope.

#### WhatsApp — Twilio API

- Send WhatsApp messages programmatically via Twilio's Business API.
- **Cost:** ~$0.005 per message. No free tier beyond Twilio trial credits.
- **Setup complexity:** Requires Twilio account, WhatsApp Business profile approval (can take days), and a Twilio phone number.
- **Privacy concern:** Either Sam's personal number or a Twilio number is involved. Messages contain sender name/email/message — PII handled by Twilio.
- **npm dependency:** `twilio` package is heavy with Node.js-specific dependencies — may have edge runtime issues.
- **Verdict:** Rejected as primary — too much setup, cost, and complexity for a low-traffic portfolio. Could be a future enhancement for instant notification alongside email.

#### WhatsApp — wa.me / Click-to-Chat

- A simple `https://wa.me/<phone>` link that opens WhatsApp with a pre-filled message.
- **No backend needed:** Just add a link to the site.
- **Limitations:** Bypasses the form entirely — no structured data, no spam filtering, no validation, phone number visible in page source.
- **Verdict:** Rejected as primary form replacement, but could coexist as a supplementary "or message me on WhatsApp" link on the contact section. No form backend needed — just a link.

#### Formspree / Getform / Basin

- Third-party form endpoints: set `action` to their URL, they handle storage and forwarding.
- **Ease of setup:** Trivial — no backend code, no API route, just point the form's action URL.
- **Free tiers:** Formspree (50/mo), Getform (50/mo), Basin (100/mo) — adequate for low traffic but spam bots can exhaust them quickly.
- **Data privacy concern:** Form submissions (including name, email, message) are stored on third-party servers. For a portfolio where messages may contain personal details, this is a consideration.
- **External dependency:** If the service goes down or changes pricing, the form breaks.
- **Verdict:** Basin is the strongest of the three (100/mo free, simplest UI), but all three introduce a third-party dependency and data privacy trade-off. Less control than an in-house API route.

#### Astro API Route + Resend (Recommended Approach)

- Combine Astro's built-in server-side API routes with Resend's email API.
- **How it works:** Create `src/pages/api/contact.ts` → validate input server-side → send email via Resend → return JSON response.
- **Why this is best:** Keeps everything within the existing Cloudflare Pages deployment (no external service dependency for the form itself), uses the same env var pattern, and gives full control over spam protection and response formatting.
- **See Recommendation section below for full details.**

---

## 3. Spam Protection Assessment

Regardless of the delivery option, the API endpoint needs spam protection:

| Technique                  | Effort | Effectiveness | Notes                                                                                                                                                         |
| -------------------------- | ------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Honeypot field**         | Low    | Medium        | Add a hidden `fax` or `website` field; if filled, silently reject. Trivial to add to both form variants.                                                      |
| **Rate limiting**          | Medium | High          | Cloudflare provides rate limiting at the edge. Could also implement simple IP-based throttling in the API route using Cloudflare KV or in-memory.             |
| **Cloudflare Turnstile**   | Medium | High          | Cloudflare's privacy-preserving CAPTCHA alternative. Free, invisible to most users. Requires adding a Turnstile widget to the form and verifying server-side. |
| **Server-side validation** | Low    | Medium        | Validate email format, message length limits, reject suspicious patterns on the server, not just client-side.                                                 |

**Recommendation:** Start with **honeypot field + server-side validation** for the MVP. Add **Cloudflare Turnstile** in a follow-up if spam becomes a problem. Rate limiting can be handled by Cloudflare's built-in features at the account level.

---

## 4. Recommendation

### Primary: Astro API Route + Resend

**Why:**

1. **Stays in-house** — No third-party form service. The API route runs on the same Cloudflare Pages deployment already set up. Messages go directly from the form to Sam's email via Resend.
2. **Minimal dependencies** — Single lightweight npm package (`resend`, fetch-based, edge-compatible).
3. **Generous free tier** — 3,000 emails/month. A portfolio contact form will use a tiny fraction of this.
4. **Consistent with existing architecture** — Uses Astro API routes (`src/pages/api/`), the Cloudflare adapter already in place, and the established env var pattern.
5. **Full control** — Customise spam protection, response format, error handling, and email template exactly as needed.
6. **Low maintenance** — No external service to monitor beyond Resend's uptime (which is high).

### Alternative: Basin (third-party form endpoint)

If the project owner prefers zero backend code and doesn't mind messages being stored on a third-party server, **Basin** is the best form-spider option:

- 100 submissions/month free
- Simplest setup of all third-party options
- Built-in spam filtering
- No npm dependencies or API route needed

The trade-off is data privacy (messages stored on Basin's servers) and an external dependency.

---

## 5. Implementation Outline (Primary Recommendation)

### Files to create

| File                       | Purpose                                                                             |
| -------------------------- | ----------------------------------------------------------------------------------- |
| `src/pages/api/contact.ts` | Astro API endpoint — receives POST, validates, sends email via Resend, returns JSON |
| `.env.local` (development) | Add `RESEND_API_KEY=re_xxx`                                                         |
| `.env.example`             | Document `RESEND_API_KEY` and `CONTACT_RECIPIENT_EMAIL`                             |

### Files to modify

| File                               | Change                                                                                                  |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `src/components/ContactModal.tsx`  | Replace simulated `handleSubmit` with `fetch('/api/contact', ...)` call, handle success/error responses |
| `src/components/ContactForm.astro` | Replace simulated submission in `<script>` with same `fetch` call                                       |
| `package.json`                     | Add `resend` dependency                                                                                 |
| `.env.example`                     | Add `RESEND_API_KEY` and `CONTACT_RECIPIENT_EMAIL` entries                                              |

### API route shape (`src/pages/api/contact.ts`)

```
POST /api/contact
Content-Type: application/json

Request body: { name: string, email: string, message: string, fax?: string }
Response 200: { ok: true }
Response 400: { ok: false, error: "Validation message" }
Response 500: { ok: false, error: "Failed to send message" }
```

Logic:

1. Parse JSON body from request
2. Validate: name required, email required + valid format, message required + max length
3. Check honeypot field (`fax`) — if filled, return 200 silently (don't alert bots)
4. Send email via Resend: from a verified domain address, to `CONTACT_RECIPIENT_EMAIL`, with name/email/message in body
5. Return JSON response

### Frontend `handleSubmit` change

Replace the current simulation with:

```typescript
const response = await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, message }),
});
const data = await response.json();
if (data.ok) {
  // show success
} else {
  // show error from data.error
}
```

### Environment variables to add

| Variable                  | Where                             | Purpose                                      |
| ------------------------- | --------------------------------- | -------------------------------------------- |
| `RESEND_API_KEY`          | Server only (no `PUBLIC_` prefix) | Resend API authentication                    |
| `CONTACT_RECIPIENT_EMAIL` | Server only                       | Email address to deliver contact messages to |

Both set via Cloudflare Pages dashboard → Settings → Environment variables.

### Resend account setup

1. Sign up at resend.com (free)
2. Add and verify the sending domain (e.g., `sampaultoms.com`)
3. Create an API key with "Send" permission
4. Add `RESEND_API_KEY` to Cloudflare Pages env vars

### Auto-Reply (KB-106)

On valid submissions, the API route sends a second "Thank you for your message" auto-reply to the submitter's email address. Key details:

- **From:** `CONTACT_FROM_EMAIL` (same verified sender as the notification email)
- **To:** the submitter's email
- **Reply-To:** `CONTACT_RECIPIENT_EMAIL` (so the submitter can reply directly to Sam)
- **Best-effort:** If the auto-reply fails, the API still returns `{ ok: true }` — the primary goal is Sam receiving the message
- **No auto-reply for spam:** Honeypot-triggered submissions send zero emails (no notification, no auto-reply)
- **Plain text only:** No HTML template — keeps it simple and lightweight
- **Environment variable:** `CONTACT_FROM_EMAIL` controls the sender address for both emails. In development, use `onboarding@resend.dev`

---

## 6. Open Questions for Owner

1. **Destination email address** — What email should contact form messages be delivered to? (e.g., `hello@sampaultoms.com`, `sam@personal.com`). This will be the `CONTACT_RECIPIENT_EMAIL` env var.
2. **Sending domain** — Do you want to verify `sampaultoms.com` as a sending domain in Resend? This ensures emails come from `noreply@sampaultoms.com` (professional). Alternative: use Resend's default `onboarding@resend.dev` for testing.
3. **WhatsApp link** — Would you like a supplementary "Message on WhatsApp" link alongside the form? This is a simple `wa.me` link with no backend — it can be added to the contact section as an alternative contact method. This would be a separate task. **Update (KB-107):** Implemented. The WhatsApp link is now rendered inside the ContactModal, conditionally shown when `PUBLIC_WHATSAPP_PHONE` env var is set.
4. **Spam protection level** — Start with honeypot + server-side validation (recommended), or go straight to Cloudflare Turnstile CAPTCHA? Honeypot catches most bots; Turnstile can be added later if needed.
5. **Auto-reply** — ~~Should the form send an automatic "thanks for your message" reply to the sender?~~ **Implemented in KB-106.** The API route sends a plain-text auto-reply to the submitter after the notification email to Sam succeeds.
6. **Notification beyond email** — Any interest in push notifications (e.g., to a phone) for new messages? This would require a separate service (Pushover, Telegram bot, etc.) and is out of scope for the initial implementation.

---

## 7. Cost Summary (Primary Recommendation)

| Item                       | Cost                                                      |
| -------------------------- | --------------------------------------------------------- |
| Resend free tier           | $0/month (up to 3,000 emails)                             |
| Cloudflare Pages Functions | $0/month (included in Pages free tier, 100k requests/day) |
| **Total**                  | **$0/month**                                              |

This is consistent with the project's existing $0/month hosting cost documented in `docs/deployment.md`.

---

→ See [`docs/agentic-inbox-integration-research.md`](./agentic-inbox-integration-research.md) for the agentic-inbox integration investigation (KB-125), which evaluates routing contact submissions into a self-hosted Cloudflare inbox.
