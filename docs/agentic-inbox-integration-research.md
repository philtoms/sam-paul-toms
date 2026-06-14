# Agentic Inbox Integration Research

**Task:** KB-125
**Date:** 2026-06-14
**Status:** Recommendation ready for owner review

---

## 1. What is Agentic Inbox

[Agentic Inbox](https://github.com/cloudflare/agentic-inbox) is a self-hosted email client with a built-in AI agent, running entirely on Cloudflare's edge. Incoming mail arrives via [Cloudflare Email Routing](https://developers.cloudflare.com/email-routing/) and is parsed by a Worker; each mailbox is isolated in its own [Durable Object](https://developers.cloudflare.com/durable-objects/) backed by SQLite, with attachments stored in [R2](https://developers.cloudflare.com/r2/). An AI-powered **Email Agent** (built on the Cloudflare Agents SDK + Workers AI) can read the inbox, search conversations, and auto-draft replies — always requiring explicit confirmation before anything is sent. The whole thing is one Worker you deploy to your own Cloudflare account, gated behind [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/policies/access/) so only you (or your team) can open the inbox UI. Licensed Apache-2.0.

### Architecture

*(Reproduced from the cloudflare/agentic-inbox README, Apache-2.0.)*

```
┌──────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Browser    │────>│  Hono Worker     │────>│  MailboxDO      │
│  React SPA   │     │  (API + SSR)     │     │  (SQLite + R2)  │
│  Agent Panel │     │                  │     └─────────────────┘
└──────┬───────┘     │  /agents/* ──────┼────>┌─────────────────┐
       │             │                  │     │  EmailAgent DO  │
       │ WebSocket   │                  │     │  (AIChatAgent)  │
       └─────────────┤                  │     │  9 email tools  │
                     │                  │────>│  Workers AI     │
                     └──────────────────┘     └─────────────────┘
```

---

## 2. Current State

The portfolio already has a working contact form backed by Resend. This section summarises the live pipeline that any agentic-inbox integration must slot into. (Full background is in the [KB-100 contact-form research doc](./contact-form-research.md).)

| Aspect | Detail | Source |
| --- | --- | --- |
| **Form UI** | Preact component; `name`, `email`, `message` + hidden honeypot `fax` + optional Turnstile widget | `src/components/ContactModal.tsx` |
| **Submission** | `handleSubmit` POSTs JSON to `/api/contact` and handles `{ ok, error }` responses | `src/components/ContactModal.tsx` |
| **API endpoint** | Astro server route (`output: 'server'`) running on Cloudflare Pages Functions (Workers runtime) | `src/pages/api/contact.ts`, `astro.config.mjs` |
| **Validation** | Zod schema: name/email/message required + length caps | `src/pages/api/contact.ts` (`contactSchema`) |
| **Spam protection** | Honeypot (`fax`) always on; optional Cloudflare Turnstile verified server-side | `src/pages/api/contact.ts` |
| **Delivery** | `resend.emails.send(...)` → notification to `CONTACT_RECIPIENT_EMAIL` | `src/pages/api/contact.ts` |
| **Auto-reply** | Best-effort second email to the submitter ("Thank you for your message"); failure does not change the response | `src/pages/api/contact.ts` |
| **Deployment** | Cloudflare Pages project `sam-music`, `@astrojs/cloudflare` adapter, `resend` externalised from the bundle | `wrangler.toml`, `astro.config.mjs` |
| **Env vars** | `RESEND_API_KEY`, `CONTACT_RECIPIENT_EMAIL`, `CONTACT_FROM_EMAIL`, `PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` (+ `SITE_URL`, `PUBLIC_ARTIST_NAME` for the auto-reply) | `.env.example` |
| **Cost today** | $0/month (Resend free tier + Cloudflare Pages free tier) | `docs/deployment.md` |

The key observation for integration: **the contact form already produces a normal outbound email**. Agentic Inbox is, first and foremost, an *inbound* email consumer. The cleanest integration therefore treats the existing Resend notification as the bridge rather than rewiring the form.

---

## 3. Options Evaluated

### Comparison Matrix

| Option | Code Changes | Infra Prerequisites | Security | Effort | Keeps Resend | AI Auto-Draft | Best For |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **A — Email Routing passthrough** *(recommended)* | **None** | Deploy agentic-inbox; Email Routing catch-all → Worker; create mailbox | Form security unchanged; inbox gated by Access | Low | ✅ Yes | ✅ Yes (free) | Least disruption, uses inbox as designed |
| **B — Direct REST API POST** | `/api/contact` adds a fetch to inbox API | Inbox reachable, mailbox created | Blocked by Access JWT; CORS blocks cross-origin | — | ❌ (replaces) | ❌ (sent path, no trigger) | *(Blocked — see notes)* |
| **C — Replace Resend with `send_email` binding** | Rewrite both `resend.emails.send` calls; drop `resend` dep; add binding to Pages config | `send_email` binding on Pages project; verified sending domain | Similar to today | Medium | ❌ (replaces) | ✅ (mail still arrives by email) | Dropping the Resend dependency |
| **D — Fork agentic-inbox, add public inbound endpoint** | New fork + new route on the inbox Worker; portfolio POSTs to it | Fork maintenance; expose/secure a public route | Weakens the Access trust boundary | High | ✅ (notification) or ❌ | ✅ | Structured non-email ingestion |

### Detailed Notes per Option

#### Option A — Email Routing passthrough (Recommended)

Keep `/api/contact` and Resend **exactly as they are**. Repoint `CONTACT_RECIPIENT_EMAIL` at a mailbox address hosted by agentic-inbox (e.g. `contact@sampaultoms.com`). Resend delivers the submission there; a Cloudflare Email Routing catch-all rule forwards the message into the agentic-inbox Worker's `email()` handler, which runs the standard inbound pipeline.

- **Why it works:** Agentic Inbox is designed to receive mail via Email Routing. Its `email()` handler (`workers/app.ts`) calls `receiveEmail()` (`workers/index.ts`), which parses the raw MIME with `PostalMime`, resolves the recipient to a mailbox, and stores the message in `Folders.INBOX` inside the `MailboxDO` Durable Object (SQLite) with attachments in R2. A contact-form notification is indistinguishable from any other inbound email — no special-casing needed.
- **Code changes required:** **Zero.** `CONTACT_RECIPIENT_EMAIL` is already a configurable env var; repointing it is an environment change, not a code change. The form, validation, honeypot, Turnstile, and auto-reply in `src/pages/api/contact.ts` are untouched.
- **Infrastructure prerequisites:**
  1. Deploy agentic-inbox to a Worker on the same Cloudflare account (or a subdomain).
  2. Configure Email Routing on `sampaultoms.com`: catch-all (or a specific address) → agentic-inbox Worker.
  3. Create the mailbox (e.g. `contact@sampaultoms.com`) from the inbox UI so R2 has `mailboxes/contact@sampaultoms.com.json`.
  4. Set `DOMAINS` and `EMAIL_ADDRESSES` so the Worker accepts mail for that address (see `receiveEmail()` — it ignores mail to addresses not in `EMAIL_ADDRESSES` when that list is non-empty).
  5. Enable Cloudflare Access + set `POLICY_AUD`/`TEAM_DOMAIN` (the Worker fails closed in production otherwise).
- **Env-var changes:** `CONTACT_RECIPIENT_EMAIL=contact@sampaultoms.com` (was the owner's personal inbox). Nothing else.
- **Security implications:** **No change** to form security. Honeypot, Turnstile, and Zod validation all run in `/api/contact` *before* any email is sent — the inbox never sees bot input because no email is produced for honeypot hits. The inbox itself stays fully gated behind Cloudflare Access; the public only ever talks to Resend, never to agentic-inbox.
- **Interaction with honeypot + Turnstile + auto-reply:** All preserved.
  - Honeypot (`fax` filled) → silently returns `{ ok: true }`, no email sent → inbox receives nothing. ✅
  - Turnstile → verified server-side before sending. ✅
  - Auto-reply → still sent to the submitter via Resend (good — the submitter gets a normal confirmation, *not* an AI-drafted reply). ✅
  - AI auto-draft → `receiveEmail()` fires `ctx.waitUntil(agentStub.fetch("/onNewEmail"))`, so the agent reads the inbound notification and drafts a suggested reply to the *submitter* for the owner to review. ✅
- **Pros:** Zero code changes; uses agentic-inbox exactly as designed (inbound email); AI auto-draft works for free; Resend auto-reply preserved; full form security intact; no new public API surface exposed.
- **Cons:** The message arrives formatted as the Resend notification text (`Name: …\nEmail: …\n\nMessage:\n…`), so the agent and inbox see that layout rather than structured JSON fields. Requires a second Worker deployment (agentic-inbox) to maintain. Requires the domain's MX records on Cloudflare for Email Routing — already the case here (the site is on Cloudflare), but Email Routing itself must be enabled.

#### Option B — Direct REST API POST (Blocked — impractical)

Have `/api/contact` additionally `fetch("POST /api/v1/mailboxes/:mailboxId/emails", …)` against the agentic-inbox API to store the submission.

This option is blocked on **three** independent axes, all grounded in the repo source:

1. **Cloudflare Access JWT required in production (hard blocker).** The Worker's global middleware (`workers/app.ts`) runs on every route via `app.use("*", …)`. Outside development it **fails closed**: if `POLICY_AUD`/`TEAM_DOMAIN` are unset it returns `500`; otherwise it reads the `cf-access-jwt-assertion` header and verifies it with `jose`'s `jwtVerify` against the Access JWKS. A Pages Function cannot mint an Access JWT — it has no service token, and routing Access credentials into the portfolio would both expose them and defeat the single-trust-boundary design. Disabling Access to make this work would leave the entire inbox UI exposed to the internet.
2. **CORS blocks cross-origin callers (hard blocker for browser-side; informational for server-side).** The API's CORS policy (`workers/index.ts`, on `/api/*`) returns `undefined` — i.e. omits `Access-Control-Allow-Origin` — for any origin that isn't same-origin or `localhost`. `/api/contact` is server-side (a Worker), so CORS doesn't technically apply, but this signal reinforces that the API is not intended for external callers.
3. **Wrong semantics — creates a *sent* email, not an inbox item (semantic blocker).** `POST /api/v1/mailboxes/:mailboxId/emails` calls `stub.createEmail(Folders.SENT, …)` and dispatches the message via the `send_email` binding (`sendEmail()` in `workers/email-sender.ts`, → `env.EMAIL.send()`). It would store the contact submission in the mailbox's **Sent** folder as if the mailbox mailed it to itself, and it would actually try to *send* an outbound email. Crucially, the AI auto-draft **never triggers**, because `/onNewEmail` is only fired from `receiveEmail()` — the Email Routing inbound path. The agent's `handleNewEmail()` (`workers/agent/index.ts`) is unreachable via the REST send endpoint.

**Verdict:** Impractical. Would require disabling Access (insecure) and still produces semantically wrong, agent-less results.

#### Option C — Replace Resend with Cloudflare Email Service binding

Drop the `resend` npm dependency from the portfolio and add a `send_email` binding (`[[send_email]]` … ) to the `sam-music` Pages config. Rewrite the two `resend.emails.send()` calls in `src/pages/api/contact.ts` to use `env.EMAIL.send(...)`, addressing the agentic-inbox mailbox.

- **What it gains:** Removes the `resend` dependency and `RESEND_API_KEY`. The message still arrives at agentic-inbox **by email** (the mailbox address), so Email Routing still routes it to the Worker — the same inbound path as Option A, and the AI auto-draft still fires.
- **What it costs:**
  - Add a `send_email` binding to the Pages project config (currently `wrangler.toml` has only R2/vars).
  - Remove `resend` from `package.json` and the `rollupOptions.external` entry in `astro.config.mjs`.
  - Rewrite both email sends (notification + auto-reply) to the binding API, including the verified sending domain on the *Cloudflare Email Service* side (separate from Resend's verified domain).
- **Net:** A code rewrite that lands the message in the *same place* as Option A. The only tangible benefit is dropping one dependency, but Resend is already integrated, fetch-based, edge-compatible, and on a free tier that the portfolio will never exceed. Swapping it for a `send_email` binding adds a new infra dependency (Email Service config on Pages) for essentially no functional gain.
- **Effort:** Medium (code changes + infra).
- **Verdict:** Not recommended — high effort, low marginal gain over Option A.

#### Option D — Fork agentic-inbox to add a public inbound endpoint

Fork the repo and add an unauthenticated `POST` route (e.g. `POST /api/v1/inbound`) that parses `{ name, email, message }`, calls `stub.createEmail(Folders.INBOX, …)` directly, and triggers `agentStub.fetch("/onNewEmail")`.

- **What it gains:** Bypasses email entirely — direct structured POST → inbox item. Could preserve structured fields; removes the Email Routing dependency for the contact path; most flexible for future structured ingestion.
- **What it costs:**
  - **Maintaining a fork** — divergence from upstream; every agentic-inbox update requires rebasing and re-validating the custom route.
  - **Weakens the Access trust boundary.** The README states plainly: *"the Cloudflare Access policy is the single trust boundary."* Adding a public, unauthenticated route (or one shared-secret route) punches a hole in that model. The inbox's own security assumes inbound mail arrives via Email Routing, where spam/abuse is bounded by email-domain controls; a raw POST endpoint would need its own rate-limiting, auth, and abuse handling.
  - Need to re-implement or re-trust spam protection at the new endpoint (the portfolio's honeypot/Turnstile would be the only gate).
  - Large effort for low gain over Option A, which already delivers the message + AI auto-draft with zero code.
- **Verdict:** Not recommended — large effort, trust-model trade-offs, ongoing maintenance. Only worth pursuing if a future requirement demands structured, non-email ingestion into the inbox.

---

## 4. Recommendation

### Primary: Option A — Email Routing passthrough

**Why:**

1. **Zero portfolio code changes.** `CONTACT_RECIPIENT_EMAIL` is already an env var; repointing it to a mailbox address is a config change in the Cloudflare dashboard, not an edit to `src/pages/api/contact.ts`, `ContactModal.tsx`, or `package.json`. The KB-100 pipeline (Resend + Zod + honeypot + Turnstile + auto-reply) keeps working unchanged.
2. **Uses agentic-inbox exactly as designed.** Its entire inbound path — `email()` handler (`workers/app.ts`) → `receiveEmail()` (`workers/index.ts`) → `MailboxDO` INBOX + R2 + agent `/onNewEmail` trigger — exists to consume inbound email. A forwarded Resend notification is a first-class input. No forking, no custom routes, no fighting the design.
3. **AI auto-draft works for free.** Because the message arrives via Email Routing, `receiveEmail()` automatically fires the agent's `handleNewEmail()`, which reads the message, runs prompt-injection detection (`workers/lib/ai.ts`), and drafts a suggested reply to the submitter in the Drafts folder — pending the owner's confirmation. None of this requires any integration code.
4. **Security posture is preserved or improved.** The public form still only talks to Resend; agentic-inbox stays fully behind Cloudflare Access (the Worker fails closed in production without `POLICY_AUD`/`TEAM_DOMAIN`). Honeypot/Turnstile run before any email exists, so the inbox never receives spam.
5. **The auto-reply stays correct.** The submitter receives Resend's normal "Thank you for your message" confirmation — not a raw AI draft. The AI draft is a private suggestion for the *owner*, exactly as agentic-inbox intends.
6. **Reversible and incremental.** If the inbox experiment doesn't work out, repointing `CONTACT_RECIPIENT_EMAIL` back to a personal address instantly reverts the integration with no code rollback.

### Alternative: Option C (if dropping the Resend dependency becomes a goal)

If the owner later wants to remove the `resend` npm dependency entirely (e.g. to consolidate on Cloudflare-native services), Option C achieves the same end-to-end result as A but with a `send_email` binding instead of Resend. The trade-off is a one-time code rewrite and new Email Service config for marginal functional benefit. Defer unless dependency reduction is explicitly prioritised.

### Explicitly rejected

- **Option B** — blocked by Access JWT, CORS, and sent-vs-inbox semantics (three independent blockers).
- **Option D** — large effort, forks the upstream, and weakens the Access trust boundary the inbox is built around.

---

## 5. Recommended Architecture / Flow

Under Option A the end-to-end flow is:

```
┌───────────────┐  POST /api/contact   ┌─────────────────┐  resend.emails.send()  ┌──────────┐
│ ContactModal  │ ───────────────────> │  /api/contact   │ ─────────────────────> │  Resend  │
│  (Preact)     │  {name,email,msg,    │  (Pages Fn)     │   to: contact@…        │          │
│ +honeypot/    │   fax?,turnstile}    │  Zod + Turnstile│   from: CONTACT_FROM   └────┬─────┘
│  Turnstile    │ <──── { ok:true } ── │  + honeypot     │                              │
└───────────────┘                      └─────────────────┘                              │ delivers email
       ▲                                                                                  │
       │                                          ┌──────────────────────────┐          ▼
       │  auto-reply (best-effort)                │  Cloudflare Email Routing │   ┌───────────────┐
       └──────────────────────────────────────────│  catch-all → Worker       │<──│ contact@…     │
                  via Resend                       └────────────┬─────────────┘   │ (mailbox addr)│
                                                  email() handler│                 └───────────────┘
                                                  (workers/app.ts)│
                                                                  ▼
                                                  ┌──────────────────────────────┐
                                                  │  agentic-inbox Worker        │
                                                  │  receiveEmail() (index.ts)   │
                                                  │  → MailboxDO INBOX (SQLite)  │
                                                  │  → R2 (attachments)          │
                                                  │  → EmailAgent /onNewEmail    │
                                                  │     → auto-draft (Drafts)    │
                                                  │  [gated by Cloudflare Access]│
                                                  └──────────────────────────────┘
                                                                  │
                                                                  ▼  owner reviews in inbox UI
                                                          ✅ suggested reply (confirm to send)
```

**Note:** The Resend auto-reply (left side) is a separate side-channel — it confirms receipt to the submitter immediately. The AI auto-draft (right side) is a private suggestion for the owner, never auto-sent.

---

## 6. Implementation Outline (follow-up task)

Under Option A there are **no portfolio code changes**. The work is entirely in deploying agentic-inbox and repointing one env var. A follow-up implementation task (linked under "Out-of-scope findings / follow-ups" below) would perform:

### Portfolio side (one config change)

1. In the Cloudflare Pages dashboard (`sam-music` → Settings → Environment variables), repoint:
   - `CONTACT_RECIPIENT_EMAIL` → `contact@sampaultoms.com` (or the chosen mailbox address).
   - No other contact-form env var changes.

### Agentic Inbox side (new deployment)

2. **Deploy agentic-inbox** to the Cloudflare account (Deploy-to-Cloudflare button or `npm run deploy` from a clone). This provisions:
   - R2 bucket `agentic-inbox` (`BUCKET` binding).
   - Three Durable Object classes with SQLite migrations: `MailboxDO` (v1), `EmailAgent` (v2), `EmailMCP` (v3) — see `wrangler.jsonc` `migrations`.
   - Workers AI binding (`AI`).
   - `send_email` binding (`EMAIL`, `remote: true`).
3. **Configure `DOMAINS` and `EMAIL_ADDRESSES`** (vars in `wrangler.jsonc`):
   - `DOMAINS=sampaultoms.com`
   - `EMAIL_ADDRESSES=["contact@sampaultoms.com"]` — restricts which addresses receive mail (see `receiveEmail()`: it ignores mail to addresses not in this list).
4. **Enable Cloudflare Access** on the Worker (Settings → Domains & Routes → one-click Access), then set the secrets `POLICY_AUD` and `TEAM_DOMAIN` from the Access modal values. Without these the Worker returns 500 (fails closed).
5. **Set up Email Routing** (Cloudflare dashboard → `sampaultoms.com` → Email Routing): add a catch-all rule (or a specific `contact@` rule) that forwards to the agentic-inbox Worker.
6. **Enable Email Service** (`send_email`) on the account so the `EMAIL` binding can send outbound mail (used by the agent for confirmed replies and by the REST send endpoint).
7. **Create the mailbox** — visit the deployed inbox UI (behind Access) and create `contact@sampaultoms.com`. This writes `mailboxes/contact@sampaultoms.com.json` to R2; `receiveEmail()` ignores mail for mailboxes that don't exist.

### Verification

8. Submit the portfolio contact form; confirm the message appears in the `contact@sampaultoms.com` inbox (INBOX folder) and that the agent produces a draft reply within a minute or two.
9. Confirm the Resend auto-reply still reaches the submitter.

> **No files under `src/` are touched by this work.** If the owner wants structured field display (rather than the plain-text `Name: …\nEmail: …\nMessage: …` notification layout), the only place to refine that is the email body constructed in `src/pages/api/contact.ts` — a cosmetic tweak, tracked separately.

**Linked follow-up task:** **KB-127** — "Implement Option A: deploy agentic-inbox + repoint `CONTACT_RECIPIENT_EMAIL`". This task executes the steps above (infra-only on the Cloudflare account + one env-var repoint; no portfolio code). It is blocked on the owner decisions in [§9 Open Questions](#9-open-questions-for-owner) (mailbox address, inbox-UI subdomain, AI auto-draft on/off).

---

## 7. Prerequisites & Setup for Agentic Inbox

Owner-facing checklist for deploying agentic-inbox alongside the existing portfolio (drawn from the repo README "How to setup" + `wrangler.jsonc` bindings):

- [ ] **Cloudflare account with `sampaultoms.com`** — already in place (the portfolio is on Cloudflare Pages).
- [ ] **Email Routing enabled** for `sampaultoms.com` (required to receive mail into the Worker). Currently not configured for the contact flow.
- [ ] **Email Service enabled** (the `send_email` binding, `remote: true`) so the agent can send confirmed replies.
- [ ] **Workers AI enabled** (the `AI` binding) — powers the agent and prompt-injection detection.
- [ ] **Cloudflare Access configured** — one-click Access on the Worker; set `POLICY_AUD` + `TEAM_DOMAIN` secrets. Required in production (fails closed otherwise).
- [ ] **R2 bucket `agentic-inbox`** created (stores mailbox configs + attachments).
- [ ] **Durable Object migrations applied** — `MailboxDO`, `EmailAgent`, `EmailMCP` (SQLite-backed; provisioned on first deploy).
- [ ] **Vars set:** `DOMAINS=sampaultoms.com`, `EMAIL_ADDRESSES=["contact@sampaultoms.com"]`.
- [ ] **Mailbox created** via the inbox UI (`contact@sampaultoms.com`).
- [ ] **Decision: subdomain for the inbox UI.** agentic-inbox is a Worker; route it on e.g. `inbox.sampaultoms.com` (or a `*.workers.dev` subdomain) so it's separate from the portfolio. The inbox UI and the portfolio never need to share an origin.

---

## 8. Cost Summary

All services here have free tiers consistent with the $0/month model documented in `docs/deployment.md`. agentic-inbox adds a few more Cloudflare services, all free-tier-friendly for a single-mailbox personal inbox:

| Service | Free Tier | Notes for this use case |
| --- | --- | --- |
| **Cloudflare Workers** (agentic-inbox) | 100k requests/day | One inbox + low contact volume; negligible |
| **Durable Objects** (MailboxDO / EmailAgent / EmailMCP) | Free tier included; billed on duration/requests above limits | SQLite-backed; a single low-traffic mailbox stays well within free usage |
| **R2** (`agentic-inbox` bucket) | 10 GB storage + 1M/10M Class A/B ops | Stores mailbox JSON + attachments; far below limits |
| **Cloudflare Email Routing** (inbound) | Free | Catch-all forwarding to the Worker |
| **Cloudflare Email Service** (`send_email`) | Free | Agent-confirmed replies (infrequent) |
| **Workers AI** | Free tier (daily limits per model) | Powers the agent + prompt-injection scan; low volume |
| **Cloudflare Access** | Free up to 50 users | Single owner well within free tier |
| **Resend** (unchanged) | 100 emails/day, 3,000/month | Contact form + auto-reply, unchanged from today |
| **Cloudflare Pages** (portfolio, unchanged) | Unlimited requests, 500 builds/month | Unchanged |

**Estimated total: $0/month** at current traffic, consistent with `docs/deployment.md`. Costs would only arise if Workers AI / Durable Object usage exceeded free-tier daily allowances — unlikely for a personal portfolio mailbox.

---

## 9. Open Questions for Owner

1. **Mailbox address** — Use `contact@sampaultoms.com` (proposed above), `hello@sampaultoms.com`, or something else? This becomes `CONTACT_RECIPIENT_EMAIL` *and* the agentic-inbox mailbox id.
2. **Keep the Resend auto-reply?** Recommended yes — it gives the submitter immediate confirmation independently of the AI draft. Confirm or disable.
3. **Enable the AI auto-draft?** It runs automatically on inbound mail (with prompt-injection detection). Want it on for the contact mailbox, or prefer manual replies? (Disabling it would require a per-mailbox system-prompt tweak or not configuring Workers AI.)
4. **Subdomain for the inbox UI** — `inbox.sampaultoms.com`, a `*.workers.dev` URL, or a separate domain entirely? (Doesn't affect Option A functionally; only routing.)
5. **Restrict to a single address or accept a catch-all?** Setting `EMAIL_ADDRESSES=["contact@sampaultoms.com"]` means only that address gets a mailbox; a catch-all lets any `*@sampaultoms.com` address receive mail (more flexibility, more surface). Recommendation: start with the single address.
6. **Display format** — The inbox receives the Resend notification text (`Name: …\nEmail: …\n\nMessage: …`). Acceptable, or should a follow-up task reformat the email body (purely cosmetic, in `src/pages/api/contact.ts`)?
7. **Should a follow-up task formally implement this?** If yes, see the follow-up implementation task(s) linked below.

---

*This document is research only. No production code or infrastructure was changed. agentic-inbox (`https://github.com/cloudflare/agentic-inbox`) is Apache-2.0 licensed and was studied read-only; it is not a dependency of this project.*
