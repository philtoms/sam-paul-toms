# Agentic Inbox Deployment Runbook

**Task:** KB-127
**Date:** 2026-06-14
**Option:** A — Email Routing passthrough
**Portfolio code changes:** **Zero.** No files under `src/` are modified by this runbook.

> **What this is:** An operational runbook the owner follows to deploy
> [cloudflare/agentic-inbox](https://github.com/cloudflare/agentic-inbox) on the
> existing Cloudflare account and route contact-form submissions into it via
> Cloudflare Email Routing. Each step is tagged with its execution method:
> **[CLI]**, **[Dashboard]**, **[Inbox UI]**, or **[Owner Action]**.
>
> **What this is not:** This is not a deploy action. The owner executes the
> steps below on production infrastructure. This document only describes the
> procedure.

---

## 1. Overview & Architecture

Under **Option A (Email Routing passthrough)**, the existing contact form keeps
working exactly as it does today — Resend sends a notification email, the
honeypot/Turnstile/Zod validation all run in `/api/contact` *before* any email
exists, and the submitter still receives the "Thank you for your message"
auto-reply. The only change is *where* the notification is delivered: instead of
a personal inbox, `CONTACT_RECIPIENT_EMAIL` is repointed at a mailbox address
(`contact@sampaultoms.com` by default) hosted by a self-deployed agentic-inbox
Worker. A Cloudflare Email Routing rule forwards that inbound mail into the
Worker's `email()` handler, which parses the MIME, stores the message in a
SQLite-backed `MailboxDO` Durable Object (with attachments in R2), and fires the
AI agent's auto-draft trigger. The whole inbox sits behind Cloudflare Access, so
the public never talks to agentic-inbox — only Resend does, by email. Full
rationale and the options comparison are in the
[research doc §4](./agentic-inbox-integration-research.md#4-recommendation).

### Architecture flow

*(Reproduced from [research doc §5](./agentic-inbox-integration-research.md#5-recommended-architecture--flow).)*

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

**Two side-channels, intentionally separate:** the Resend auto-reply (left side)
confirms receipt to the submitter immediately. The AI auto-draft (right side) is
a private suggestion for the owner, never auto-sent.

---

## 2. Prerequisites & Owner Decisions

Work through this checklist before starting deployment. Each item is marked
**[Owner Decision]** (the owner must choose) or **[Prerequisite]** (something
that must already be true). Where a default is proposed, accepting it lets the
owner follow the runbook as-is; any chosen value can be substituted throughout.

> **Default assumption used throughout this runbook:** mailbox address
> `contact@sampaultoms.com`, inbox UI at `inbox.sampaultoms.com`, AI auto-draft
> **enabled**, single-address Email Routing rule, Resend auto-reply **kept**. To
> use a different value, substitute it wherever the default appears.

### Prerequisites

- **[Prerequisite]** **Cloudflare account owns `sampaultoms.com` as an active
  zone.** Already true — the portfolio runs on Cloudflare Pages (`sam-music`).
  *(Research doc §2, §7.)*
- **[Prerequisite]** **`wrangler` CLI installed and the owner is able to run
  `wrangler login`** (interactive OAuth in a browser). The agentic-inbox deploy
  runs from a local clone, not from the portfolio repo.
- **[Prerequisite]** **Node.js ≥ 18** available locally for `npm install` inside
  the agentic-inbox clone.

### Owner decisions

These correspond to the open questions in
[research doc §9](./agentic-inbox-integration-research.md#9-open-questions-for-owner).
Defaults are proposed so the runbook is usable as-is; the owner should confirm or
substitute.

- **[Owner Decision]** **Mailbox address.** What address should receive contact
  submissions and become the agentic-inbox mailbox id? *Proposed default:
  `contact@sampaultoms.com`.* Alternatives: `hello@…`, or any other address on
  `sampaultoms.com`. This value is used as `CONTACT_RECIPIENT_EMAIL`, the
  agentic-inbox `EMAIL_ADDRESSES` entry, the mailbox created in the UI, and the
  Email Routing rule target. *(Research doc §9.1.)*
- **[Owner Decision]** **Inbox UI subdomain.** Where is the agentic-inbox web
  interface reachable (behind Cloudflare Access)? *Proposed default:
  `inbox.sampaultoms.com`.* Alternatives: a `*.workers.dev` subdomain, or a
  custom route. This does not affect Option A functionally — only routing.
  *(Research doc §9.4, §7 last bullet.)*
- **[Owner Decision]** **AI auto-draft.** Should the agent read each inbound
  submission and auto-draft a suggested reply (with prompt-injection detection),
  for the owner to review and confirm? *Proposed default: **enabled**.* To
  **disable**, do not configure the Workers AI binding or a per-mailbox system
  prompt. *(Research doc §9.3.)*
- **[Owner Decision]** **Email Routing mode.** A **single-address rule** for
  `contact@` only, or a **catch-all** for all `*@sampaultoms.com`? *Proposed
  default: single-address rule* (less surface area; recommended start).
  *(Research doc §9.5.)*
- **[Owner Decision]** **Keep the Resend auto-reply.** Should the submitter still
  receive the immediate "Thank you for your message" confirmation via Resend?
  *Proposed default: **keep** (recommended — it confirms receipt independently of
  the AI draft).* *(Research doc §9.2.)*

---

## 3. Step-by-Step Deployment

The nine steps below operationalize
[research doc §6 (Implementation Outline)](./agentic-inbox-integration-research.md#6-implementation-outline-follow-up-task).
Steps 1–3 and 5's secret commands are **[CLI]**; steps 4, 6, 7, 9 are
**[Dashboard]**; step 8 is **[Inbox UI]**; step 5 also needs an **[Owner
Action]** (the secret values are only known to the owner). The portfolio-side
change is step 9 only — a single env-var repoint, no code edit, no redeploy
triggered by code.

> **Important:** agentic-inbox is a **separate project from the portfolio
> repo.** Steps 1–3 clone it into a throwaway directory (`/tmp/agentic-inbox`)
> and deploy it as its own Worker. Do **not** add it to the portfolio, install
> it as a dependency, or commit anything from it into this repository.

### Step 1 — Clone agentic-inbox **[CLI]**

Clone the repo into a throwaway directory — separate from the portfolio:

```bash
git clone --depth 1 https://github.com/cloudflare/agentic-inbox /tmp/agentic-inbox
cd /tmp/agentic-inbox
```

This is the upstream [cloudflare/agentic-inbox](https://github.com/cloudflare/agentic-inbox)
repo (Apache-2.0). It is not added to the portfolio.

### Step 2 — Configure `wrangler.jsonc` vars **[CLI]**

Edit `/tmp/agentic-inbox/wrangler.jsonc` so the Worker accepts mail for the
portfolio domain and the chosen mailbox address. Set:

- `DOMAINS=["sampaultoms.com"]` — the zone the Worker is responsible for.
- `EMAIL_ADDRESSES=["contact@sampaultoms.com"]` — the addresses that may receive
  mail.

> **Why `EMAIL_ADDRESSES` matters:** `receiveEmail()` in `workers/index.ts`
> **ignores mail addressed to any address not in this list** (when the list is
> non-empty). If the mailbox address is omitted here, inbound messages are
> silently dropped before they ever reach a `MailboxDO`. *(Cited in research doc
> §3 Option A "Infrastructure prerequisites" item 4 and §6 step 3.)*
>
> *(Substitute `contact@sampaultoms.com` with the owner's chosen mailbox address
> from §2 if different.)*

### Step 3 — Deploy the Worker **[CLI]**

Authenticate first (interactive OAuth — opens a browser), then install and
deploy:

```bash
cd /tmp/agentic-inbox
wrangler login
npm install
npx wrangler deploy
```

This single deploy provisions, on the Cloudflare account:

- **R2 bucket `agentic-inbox`** (the `BUCKET` binding) — stores mailbox configs
  (`mailboxes/<address>.json`) and attachments.
- **Three Durable Object classes with SQLite migrations:** `MailboxDO` (v1),
  `EmailAgent` (v2), `EmailMCP` (v3) — see `wrangler.jsonc` `migrations`.
- **Workers AI binding** (`AI`) — powers the agent and prompt-injection
  detection.
- **`send_email` binding** (`EMAIL`, `remote: true`) — lets the agent send
  confirmed replies.

*(Research doc §6 step 2 enumerates these bindings.)*

### Step 4 — Enable Cloudflare Access on the Worker **[Dashboard]**

Gate the inbox UI behind Cloudflare Access so only the owner can open it. This
is the inbox's single trust boundary (research doc §4 point 4).

**Navigation path:**

> **Cloudflare Dashboard** → **Workers & Pages** → the deployed agentic-inbox
> Worker → **Settings** → **Domains & Routes** → enable **one-click Access**.

This creates the Access policy for the Worker. *(Owner verification: the exact
label may read "Cloudflare Access" or "Application" depending on dashboard
version — the goal is to attach an Access application to this Worker.)*

### Step 5 — Set `POLICY_AUD` and `TEAM_DOMAIN` secrets **[Owner Action + CLI]**

The Worker's global middleware (`workers/app.ts`) runs on **every** route. In
production it **fails closed**: if `POLICY_AUD` and `TEAM_DOMAIN` are unset, it
returns **HTTP 500 on every request** (research doc §3 Option B blocker 1,
§6 step 4). This is by design — the inbox is never exposed unauthenticated.

1. **[Owner Action]** Obtain `POLICY_AUD` (the policy audience / application
   audience ID) and `TEAM_DOMAIN` (the Cloudflare Access team domain, e.g.
   `<team>.cloudflareaccess.com`) from the Access application modal created in
   Step 4.
2. **[CLI]** Set them as Worker secrets (interactive — each prompts for the
   value):

```bash
cd /tmp/agentic-inbox
npx wrangler secret put POLICY_AUD
npx wrangler secret put TEAM_DOMAIN
```

> **Without these secrets the Worker returns HTTP 500 on every request (fails
> closed).** Set them before expecting the inbox UI to load.

### Step 6 — Configure Email Routing **[Dashboard]**

Route inbound mail at the mailbox address into the agentic-inbox Worker.

**Navigation path:**

> **Cloudflare Dashboard** → **sampaultoms.com** → **Email** → **Email Routing**.

1. Enable Email Routing for the zone if it is not already enabled (Email Routing
   will configure the required MX/TXT records automatically when `sampaultoms.com`
   uses Cloudflare nameservers, which it does).
2. Add a routing rule:
   - **Single-address (recommended default):** add a custom address rule for
     `contact@sampaultoms.com`.
   - **Catch-all (alternative):** edit the **Catch-all address** → **Send to a
     Worker**.
3. For the rule's action, choose **"Send to a Worker"** and select the deployed
   agentic-inbox Worker.

*(Research doc §6 step 5; §2 notes Email Routing is not yet configured for the
contact flow, so this is a new setup.)*

### Step 7 — Enable Email Service **[Dashboard]**

The `EMAIL` binding (`send_email`, `remote: true`) needs the Cloudflare Email
Service enabled on the account so the agent can **send** confirmed replies (and
so the REST send endpoint works).

**Navigation path:**

> **Cloudflare Dashboard** → **sampaultoms.com** → **Email** → **Email Routing**
> → **Settings** → ensure **Email Service** is enabled.

*(Research doc §6 step 6, §7 "Email Service enabled".)*

### Step 8 — Create the mailbox **[Inbox UI]**

The Worker ignores mail for mailboxes that don't exist (research doc §3 Option A
prerequisite item 3; §6 step 7). Create the mailbox so R2 has
`mailboxes/contact@sampaultoms.com.json`.

1. Visit the deployed inbox UI (behind Cloudflare Access), e.g.
   `https://inbox.sampaultoms.com`. Authenticate via the Access login.
2. Create a new mailbox: `contact@sampaultoms.com`.

> **Why this is required:** `receiveEmail()` resolves the recipient to a mailbox
> and stores the message in `Folders.INBOX` inside the corresponding
> `MailboxDO`. If no mailbox exists for the address, the message is not stored.
> *(Substitute the owner's chosen mailbox address from §2.)*

### Step 9 — Repoint `CONTACT_RECIPIENT_EMAIL` **[Dashboard]**

**This is the only portfolio-side change.** No file under `src/` is edited and no
code change triggers a redeploy — the next form submission simply picks up the
new value at runtime.

**Navigation path:**

> **Cloudflare Dashboard** → **Workers & Pages** → `sam-music` (the portfolio
> Pages project) → **Settings** → **Environment variables**.

1. Edit `CONTACT_RECIPIENT_EMAIL` and set it to `contact@sampaultoms.com`.
2. **Do this for both the Production and Preview environments.**

> **No code edit, no redeploy triggered from code.** `CONTACT_RECIPIENT_EMAIL`
> is read at runtime by `src/pages/api/contact.ts` via
> `import.meta.env.CONTACT_RECIPIENT_EMAIL` (used as the `to:` address for the
> notification, and as the auto-reply `replyTo:`). Repointing the env var changes
> the delivery target without touching this file. *(See
> [deployment guide §3 Environment Variables](./deployment.md#3-cloudflare-pages-project).)*

---

## 4. Verification

Perform this end-to-end test after completing all nine steps.

1. **Submit the contact form** on the live site (`sampaultoms.com`) with a test
   name, a test email address you control, and a test message.
2. **Confirm the message appears** in the `contact@sampaultoms.com` inbox
   **INBOX** folder — within 1–2 minutes of submission.
3. **If AI auto-draft is enabled (§2 default):** confirm the agent produces a
   **draft reply** in the Drafts folder (prompt-injection-checked; never
   auto-sent — the owner confirms to send).
4. **Confirm the Resend auto-reply** ("Thank you for your message") reaches the
   submitter's test email address. This side-channel is independent of the
   agentic-inbox path.

### Expected failure modes

If the inbox receives nothing after submission, check in order:

- **(a) Email Routing rule** — the rule for `contact@` (or catch-all) points to
  the agentic-inbox Worker and Email Routing is enabled for the zone (Step 6).
- **(b) Mailbox exists in R2** — the `contact@sampaultoms.com` mailbox was
  created in the inbox UI (Step 8). `receiveEmail()` ignores mail for
  non-existent mailboxes.
- **(c) `EMAIL_ADDRESSES` includes the address** — `wrangler.jsonc` lists
  `contact@sampaultoms.com` (Step 2). `receiveEmail()` drops mail to addresses
  not in the list.
- **(d) `CONTACT_RECIPIENT_EMAIL` was repointed in the correct environment**
  — Production (and Preview, if testing there) in Pages env vars (Step 9).

*(Research doc §6 "Verification" steps 8–9.)*

---

## 5. Rollback

Option A is reversible and incremental (research doc §4 point 6).

### Immediate (instant, no teardown)

Repoint `CONTACT_RECIPIENT_EMAIL` back to the previous personal address in the
Cloudflare Pages dashboard:

> **Cloudflare Dashboard** → **Workers & Pages** → `sam-music` → **Settings** →
> **Environment variables** → edit `CONTACT_RECIPIENT_EMAIL` back to the previous
> value (do for Production and Preview).

Contact submissions immediately resume flowing to the old inbox. **No code
rollback** — this is a config change, and `src/pages/api/contact.ts` was never
modified.

### Full teardown (optional)

The agentic-inbox Worker can remain dormant at **$0/month** (see §6). If full
removal is desired:

1. Delete the Email Routing rule (Step 6) — **Dashboard → sampaultoms.com →
   Email → Email Routing → Routing Rules → delete the `contact@` / catch-all
   rule.**
2. Delete the agentic-inbox Worker — **Dashboard → Workers & Pages → the
   Worker → delete.**
3. Delete the R2 bucket `agentic-inbox` — **Dashboard → R2 → the bucket →
   delete** (after confirming no data needs preserving).
4. Remove the Cloudflare Access application created in Step 4 — **Dashboard →
   Zero Trust → Access → Applications → delete the application.**

---

## 6. Cost

**Estimated total: $0/month** at current traffic — consistent with the model
documented in [deployment guide §8](./deployment.md#8-costs-and-limits). All
added Cloudflare services (Workers, Durable Objects, R2, Email Routing, Email
Service, Workers AI, Cloudflare Access) sit within their free tiers for a single
low-traffic personal mailbox, and Resend/Pages are unchanged. See the full
per-service table in
[research doc §8 (Cost Summary)](./agentic-inbox-integration-research.md#8-cost-summary).
Costs would only arise if Workers AI or Durable Object usage exceeded free-tier
daily allowances — unlikely for a personal portfolio mailbox.

---

## 7. References

- [Agentic Inbox Integration Research](./agentic-inbox-integration-research.md) —
  the source of truth for Option A: §4 (Recommendation), §5 (Architecture flow),
  §6 (Implementation Outline), §7 (Prerequisites), §8 (Cost), §9 (Open
  Questions). *(KB-125 deliverable.)*
- [Deployment Guide §3 (Environment Variables)](./deployment.md#3-cloudflare-pages-project) —
  the Pages env-var table this runbook connects to.
- [Contact Form Backend Research](./contact-form-research.md) — the KB-100
  background doc for the contact form architecture.
- [cloudflare/agentic-inbox](https://github.com/cloudflare/agentic-inbox) — the
  upstream Worker this runbook deploys (Apache-2.0).
- [Cloudflare Email Routing docs](https://developers.cloudflare.com/email-routing/) —
  inbound mail → Worker.
- [Cloudflare Access docs](https://developers.cloudflare.com/cloudflare-one/policies/access/) —
  the inbox's single trust boundary.
- [Cloudflare Durable Objects docs](https://developers.cloudflare.com/durable-objects/) —
  the SQLite-backed `MailboxDO` / `EmailAgent` / `EmailMCP` classes.

---

*This runbook is documentation only. No production code or infrastructure was
changed by writing it; no files under `src/` are modified by following it. The
owner executes the dashboard/CLI steps on production infrastructure.*
