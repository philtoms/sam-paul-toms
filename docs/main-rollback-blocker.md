# `main` force-reset blocker — KB-263 (KB-177 Option-3 trigger-watch) stalled

> **KB-266 records and escalates this blocker; it does NOT resolve it.**
> This task made **no commits to `main`**, moved **no git refs**, recovered **no
> `kb/*` branches**, and reconstructed **no `.kb/tasks/` records**. The decision
> below is the board/human's to make, not the executor's. Read-only git was the
> only git activity performed for this document. (Do-no-harm rationale in its
> dedicated section below.)

- **Raised by:** KB-266
- **Blocked task:** KB-263 (the eleventh-cycle KB-177 Option-3 Markdown-preference
  trigger-watch, successor to KB-254)
- **Status:** BLOCKED — awaiting a binary board/human decision (branch (a) or (b)).
- **Decision task:** **KB-267** (column `triage`), created via `task_create` during
  KB-266 — see the "Decision required" section for its description and the task IDs
  it references. This is the actionable task for the board/human.

---

## Summary

Between 06:08:51 and 06:17:25 (+01:00) on 2026-06-20, a deliberate
`[gitup] set tip` action (the GitUp macOS GUI) reset `main` — and `origin/main` —
from KB-253 (`076b0b4`) back to KB-145 (`77002915`), discarding the **89 commits**
of the KB-146→KB-254 lineage (`git rev-list --count 77002915..076b0b4` = 89). That
lineage includes KB-158, which is what first creates `src/data/name-links.ts` —
the name→URL registry that the KB-177 Option-3 trigger-watch chain exists to
guard. Current `main` therefore **predates the registry**, the entire
KB-184→KB-254 trigger-watch CHANGELOG chain, and KB-254's own CHANGELOG precedent;
`src/data/` does not exist on `HEAD`. KB-263, dispatched to record a Case-A
CHANGELOG no-op against that registry, **stopped cleanly at its Step 0 Preflight**
because its preconditions are catastrophically invalidated. **No data is lost** —
the rolled-back commits survive as valid objects reachable via the reflog, so both
resolution branches remain open. KB-263 made **zero commits and zero tracked file
changes**. This document fixes every verified fact with cited evidence, proves the
causal chain, records the executor's do-no-harm rationale, and escalates the
binary decision to the board.

---

## Verified facts

Every claim below is grounded in a live, re-runnable command. The full SHAs are
given once; reflog lines are cited verbatim.

1. **The rollback is the current state of `main` and `origin/main`.**
   - `git rev-parse HEAD` = `git rev-parse origin/main` =
     `77002915abc8461e3dd3cbdb5b37ab9c6185173a`.
   - `git log -1 --format='%H %ci %s' 77002915` →
     `77002915… 2026-06-19 17:18:08 +0100 feat(KB-145): render optional per-track
credit in now-playing display`. So current `main` **is** KB-145.

2. **The reset was a deliberate `[gitup] set tip` (GitUp GUI) action at 06:17:25.**
   Verbatim reflog:
   - `7700291 refs/heads/main@{2026-06-20T06:17:25+01:00}: [gitup] set tip`
   - The immediately preceding entry pins the **pre-reset** tip:
     `076b0b4 refs/heads/main@{2026-06-20T06:08:51+01:00}: commit: docs(KB-253):
re-confirm KB-223-deferred toHaveScreenshot trigger not fired, defer to
KB-260`.
   - `git log -1 --format='%H %ci %s' 076b0b4` → `076b0b44… 2026-06-20 06:08:51
+0100 docs(KB-253): …` — i.e. the rolled-back tip **is** KB-253.

3. **The rollback was PUSHED (not a local-only reset).**
   - `7700291 refs/remotes/origin/main@{2026-06-20T06:25:01+01:00}: update by
push` — `origin/main` also points at `77002915` (KB-145).
   - This is the proof that do-no-harm forbids an autonomous re-push: re-pushing
     the rolled-back lineage would contradict a deliberately **pushed** rollback.

4. **89 commits were rolled back (KB-146→KB-254 lineage).**
   - `git rev-list --count 77002915..076b0b4` = **89**.
   - `git merge-base --is-ancestor 77002915 076b0b4` succeeds → the rollback is
     **linear** (KB-145 is an ancestor of KB-253); no merge-graph surgery is
     needed to understand or reverse it.

5. **KB-158 — which creates `src/data/name-links.ts` — is in the rolled-back
   lineage.**
   - `git log -1 --format='%H %ci %s' 712f8c9` → `712f8c92… 2026-06-19 19:22:22
+0100 feat(KB-158): add bare-domain + registered-name linkification to
per-track credits`.
   - `git show 712f8c9:src/data/name-links.ts` succeeds — 168 lines, `NAME_LINKS`
     near the end: exactly what KB-263's preflight expects.
   - `git ls-tree HEAD src/data` returns **empty** — the registry directory does
     **not exist** on current `main`. It was removed by the rollback, not by
     KB-263.

6. **The `kb/*` branches and KB-263's worktree are gone.**
   - `git branch -a` shows only `main`, `remotes/origin/main`, and `kb/kb-266`
     (this task's own worktree branch). There is **no** KB-263 worktree: `git
worktree list` lists only `/Users/phil/dev/sam` (`main`) and this worktree.
     The would-be KB-263 worktree (`.worktrees/pearl-plume`) does not exist.

7. **KB-263's on-disk board record is missing (the board data-loss defect).**
   - `ls /Users/phil/dev/sam/.kb/tasks/KB-263/` → **No such file or directory**.
   - The highest surviving task directory below the gap is **KB-145**; the next
     survivors are **KB-264, KB-265, KB-266**. The entire KB-146→KB-263 range is
     gone from `.kb/tasks/` too. (`.kb/` is gitignored and lives only on the main
     checkout; worktrees carry no `.kb/`.)
   - `config.nextId` is **267** (`cat /Users/phil/dev/sam/.kb/config.json`), so the
     board still believes it is allocating new IDs despite ~89 missing task
     records. KB-266 **intentionally leaves `nextId` untouched** — reconciling it
     is a separate follow-up.

8. **KB-263 stopped at its Step 0 Preflight with zero commits / zero tracked
   changes.**
   - KB-263's preconditions fail verbatim because the registry is absent on `HEAD`
     (fact 5) and the chain's CHANGELOG history is absent on `main`. KB-263's only
     on-disk side-effect was a transient `npm install` into gitignored
     `node_modules/`; it made no commits and no tracked file changes.

9. **The baseline suite is green on KB-145.**
   - At KB-266's Step 0 Preflight, `npm test` passed: **727 passed | 16 skipped**
     (743 total), 39 test files passed | 2 skipped. (Recorded for the Step 4
     no-regression comparison.)

---

## Causal chain

The rollback is the single root cause of the stall; each link is independently
verifiable above.

1. **The rollback removed KB-158** (`712f8c9`) and the entire KB-146→KB-254
   lineage from `main`/`origin/main` (facts 2–4).
2. **`src/data/name-links.ts` therefore does not exist on `main`** —
   `git ls-tree HEAD src/data` is empty (fact 5). The registry was removed _by the
   rollback_, not by any task action.
3. **KB-263's Step-0 Preflight precondition #1 fails verbatim** — it expects the
   registry KB-158 created, but the registry is absent on the branch it must run
   against (facts 5, 8).
4. **KB-263 cannot run** to completion; it cannot record its Case-A CHANGELOG
   no-op (fact 8), because…
5. **…recording a Case-A CHANGELOG no-op on a `main` that lacks both the registry
   _and_ the chain's own CHANGELOG history would be contradictory and
   nonsensical.** The KB-184→KB-254 trigger-watch CHANGELOG entries (e.g. KB-254's
   `chore(KB-254): …` CHANGELOG +1 at `0a9149a`) are **not on current `main`** —
   they live only on the rolled-back lineage. (KB-254 = `0a9149ac`, `git show
--stat 0a9149a` → `CHANGELOG.md | 1 +`.)
6. **The KB-177 Option-3 trigger-watch chain (KB-184 … KB-254 … KB-263) is
   therefore stalled.** The next-cycle successor cannot be dispatched against a
   branch that no longer contains the feature or the precedent it extends.

---

## No data lost

The rolled-back lineage is **fully recoverable** — this is why both decision
branches below remain open and why no recovery was performed autonomously.

- `git cat-file -t 712f8c9` → `commit` (KB-158 — creates the registry).
- `git cat-file -t 076b0b4` → `commit` (KB-253 — the pre-reset tip).
- `git cat-file -t 0a9149a` → `commit` (KB-254 — the prior cycle in the chain; its
  CHANGELOG +1 and its KB-263-successor creation are the precedent KB-263 would
  extend).

All three are valid commit objects reachable via the reflog despite being
off-branch on current `main`. The registry file itself is recoverable too:
`git show 712f8c9:src/data/name-links.ts` reproduces all 168 lines. **No
destruction is required to undo this rollback** — a forward recovery (reset
`main`/`origin/main` back to `076b0b4`, or re-merge the lineage) is purely
additive in git-object terms. The decision is about _whether_ to undo it, not
_whether it can be_ undone.

> **Note on a compounding, distinct event:** the `.kb/tasks/` record purge (the
> KB-146→KB-263 range missing from `.kb/`, fact 7) is a **separate** defect from
> the git rollback and is **not** git-recoverable (`.kb/` is gitignored). It is
> documented by sibling task **KB-265** (`docs/board-data-loss-postmortem.md`,
> `scripts/kb-board-health.mjs`). The two events compound — **both** must be fixed
> for KB-263 to ever re-run on a restored `main` — but neither blocks the other.
> KB-264 (vitest flakiness) is a third concurrent triage item with an unrelated
> root cause; it is mentioned only for situational awareness, not coupled here.

---

## Do-no-harm rationale

The executor deliberately did **not**:

- **re-push the rolled-back lineage**, move `main`/`origin/main`/`HEAD`, or
  recover any `kb/*` branch (no `git reset`, `git push`, `git branch`,
  `git update-ref`, `git rebase`, `git revert`, or `git worktree` mutation). The
  rollback was a **deliberately pushed** action (fact 3); autonomously reversing
  it could discard intentional work or mask a board decision that has not yet been
  made.
- **reconstruct `.kb/tasks/KB-263/`** — that presumes decision-branch (b) and is
  deferred to the human's choice (record materialization is KB-265's defect scope).
- **mutate `.kb/config.json`** — `nextId` stays 267.
- **patch the board engine** (`node_modules/@dustinbyrne/kb/`) or the "gitup" tool
  — both are external.

Only **read-only git** was used to gather this evidence
(`log`/`reflog`/`show`/`cat-file`/`ls-tree`/`branch`/`worktree list`/`status`/`diff`).
The invariant is checked again at delivery: `git rev-parse HEAD` is still
`77002915` (KB-145) and `origin/main` is unchanged.

---

## Decision required from board/human

> This is a binary **either/or**. The executor does not pick. Pick **one** branch
> and act on its follow-ups. The actionable task for this decision is **KB-267**
> (`triage`), created by KB-266.

The KB-145 reset was either **intentional** or **unintended**. The two branches
are mutually exclusive and lead to opposite outcomes for the KB-177 Option-3
chain.

```
                ┌─ main == 77002915 (KB-145) ─┐
                │   origin/main == 77002915   │
                │   (rollback in effect)      │
                └─────────────┬───────────────┘
                              │
            Was the reset INTENTIONAL or UNINTENDED?
                              │
          ┌───────────────────┴────────────────────┐
          │ (a) INTENTIONAL abandon                │ (b) UNINTENDED defect
          ▼                                        ▼
  KB-145 reset is deliberate:              The reset was a mistake:
  abandoning the KB-146+ work.             restore the rolled-back lineage.
  ──────────────────────────────           ──────────────────────────────
  • Retire KB-263 and the ENTIRE          • Restore main to KB-253 (076b0b4)
    KB-177 Option-3 trigger-watch chain      OR re-merge the KB-146+ lineage
    (KB-184 … KB-254 … KB-263): the          (force-push 076b0b4 to origin/main).
    feature (name-links) and the           • Materialize KB-263's missing
    CHANGELOG chain they gate no longer      .kb/tasks/KB-263/task.json per the
    exist on main.                           KB-265 board-data-loss defect (the
  • Mark KB-263 + the chain CANCELLED          .kb/ purge is NOT git-recoverable).
    via the board; do NOT re-dispatch.     • Re-dispatch KB-263 so its Case-A
  • No CHANGELOG no-op is recorded —          no-op (one CHANGELOG ### Tests/
    recording one on a main that lacks        ### Changed line above KB-254's
    the registry would be nonsensical.        entry + next-cycle task_create
  • Touches: KB-263 (cancelled).              successor) runs normally.
                                            • If vitest flakes resurface on the
                                              restored lineage, route via KB-264.
                                            • Touches: KB-263 (re-dispatched),
                                              KB-265 (record materialization),
                                              KB-264 (only if flakes resurface).
```

### (a) INTENTIONAL abandon — the KB-145 reset is deliberate

The KB-146+ work is being abandoned. Concretely:

- **Retire KB-263 and the entire KB-177 Option-3 trigger-watch chain**
  (KB-184 … KB-254 … KB-263). The feature (`src/data/name-links.ts`) and the
  CHANGELOG chain they gate no longer exist on `main`, so the chain's premise is
  void.
- **Mark KB-263 + the chain cancelled** via the board; do **not** re-dispatch.
- **No CHANGELOG no-op is recorded** — KB-263's whole purpose (a Case-A no-op
  against the registry) is moot on a registry-less `main`.
- **Touches:** KB-263 (cancelled).

### (b) UNINTENDED defect — the reset was a mistake

Concretely:

- **Restore `main` to KB-253 (`076b0b4`)** or re-merge the KB-146+ lineage, then
  force-push to `origin/main` so the registry and the chain's history return.
- **Materialize KB-263's missing `.kb/tasks/KB-263/task.json`** per the KB-265
  board-data-loss defect — the `.kb/` purge (KB-146→KB-263 range) is **not**
  git-recoverable, so the record must be reconstructed from surviving evidence.
- **Re-dispatch KB-263** so its Case-A no-op (one CHANGELOG `### Tests`/
  `### Changed` line above KB-254's entry, plus the next-cycle `task_create`
  successor) runs normally.
- **If vitest flakes resurface on the restored lineage**, route them via KB-264.
- **Touches:** KB-263 (re-dispatched), KB-265 (record materialization + the
  `kb-board-health` audit), KB-264 (only if flakes resurface).

---

## Cross-references

- **KB-263** — the blocked task. Its on-disk record is **missing** on the main
  checkout (fact 7), the same board-infrastructure data-loss defect KB-265
  documents, so `task_get`/`task_update` cannot currently persist against it. Its
  remediation is part of decision-branch (b).
- **KB-265** (`specifying`/`triage`) — the **distinct** `.kb/tasks/` record-deletion
  defect + KB-254 reconstruction + `scripts/kb-board-health.mjs` audit. Compounding
  (both must be fixed for KB-263 to re-run) but **not** blocking KB-266. If KB-265
  has landed, its `docs/board-data-loss-postmortem.md` and `node scripts/kb-board-
health.mjs` output corroborate the `.kb/` purge; the git rollback itself is
  independently verifiable from git alone.
- **KB-264** (`triage`) — vitest flakiness. Unrelated root cause; the third
  concurrent triage item. Mentioned for awareness only.
- **`config.nextId` (267)** has diverged from on-disk reality (~89 missing task
  records) but is **intentionally left untouched** by KB-266 — reconciliation is a
  separate follow-up (do not mutate it).
