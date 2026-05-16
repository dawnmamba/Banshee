---
name: debug
description: >-
  Debug and fix bugs with TDD regression tests. Scoped mode uses
  doc/{feature}/PRD.md and IMPLEMENTATION.md; exploratory mode investigates
  without docs, writes BUG_REPORT.md, fixes until checks pass. Resume on same
  BUG-00X if fix fails. Use when the user types /debug.
disable-model-invocation: true
---

# /debug — Bug fix + TDD regression + verify

Read [reference.md](reference.md) for `BUG_REPORT.md` template, exploratory checklist, regression test examples, and git/PR commands.

## Rules

- **Regression test before fix** — Red-Green-Refactor; confirm red before green.
- **Read before write** — match patterns in `frontend/` and `backend/`; no drive-by refactors.
- **No secrets** — never commit `.env`.
- **Fix until green** — re-run checks (max 10 attempts); no PR until all pass.
- **Git safety** — never force-push; stage only bugfix-related files.
- **One bug report file per feature** — `doc/{feature-name}/BUG_REPORT.md`; multiple bugs as `## BUG-001`, `## BUG-002`.
- Prefer fixing implementation over weakening tests; document test changes in `BUG_REPORT.md` and `IMPLEMENTATION.md` if the requirement was wrong.
- **UI form bugfixes** — preserve PrimeReact + `auth-pt`; fix pass-through in `auth-pt.ts` before one-off `className` (see [reference.md — Frontend UI](reference.md#frontend-ui--primereact-unstyled--tailwind)).

---

## Mode detection (first step)

**Scoped** if any of:
- User names `feature-name` (e.g. `welcome-message`)
- User attaches or cites `doc/{feature}/PRD.md` and/or `IMPLEMENTATION.md`
- User cites `doc/{feature}/BUG_REPORT.md` for resume/iterate

**Exploratory** otherwise — **do not read** `doc/` until a feature is identified.

If ambiguous, use **AskQuestion**: known feature vs exploratory.

**Resume / iterate** — user says fix still fails or cites existing `BUG-00X` → scoped on that feature; do **not** create a new `BUG-001` unless it is a different bug.

---

## Scoped mode

### Phase 1 — Intake

1. Resolve `feature-name` (kebab-case).
2. Read `doc/{feature-name}/PRD.md` and `IMPLEMENTATION.md` if they exist.
3. If `doc/{feature-name}/BUG_REPORT.md` exists and user references a bug ID, open that section (resume flow).
4. Collect from user (ask if missing):
   - **Symptoms** (actual behavior)
   - **Expected** (link PRD `FR-*` when possible)
   - **Steps to reproduce**
   - **Environment** (ports, browser, env vars) if relevant

### Phase 2 — Reproduce and localize

1. Map symptom → PRD requirement IDs when PRD exists.
2. Run targeted tests from `IMPLEMENTATION.md`:
   - `cd backend && npm test -- --testPathPattern={feature-name}`
   - `cd frontend && npm test -- --run`
3. Reproduce manually (API curl / UI) using IMPLEMENTATION API contract.
4. If symptom is layout/styling on login, register, or any PrimeReact form → inspect `frontend/src/lib/primereact/auth-pt.ts` and compare to `LoginForm.tsx`; see [reference.md — UI bug checklist](reference.md#ui-bug-checklist-primereact-forms).

### Phase 3 — Document bug

1. Create or update `doc/{feature-name}/BUG_REPORT.md` ([template](reference.md#bug_report-template)).
2. New bug: next ID `BUG-001`, `BUG-002`, …; status `investigating`.
3. Resume: set existing bug status to `investigating` or `fix-incomplete`; read prior **Root cause** and **Fixes applied** — do not repeat failed approaches without re-testing.

### Phase 4 — Regression test (TDD)

1. **Red** — add/extend test that fails on current bug (use paths from `IMPLEMENTATION.md`):
   - Backend: `backend/src/{feature-name}/*.spec.ts` or `backend/test/{feature-name}.e2e-spec.ts`
   - Frontend: `frontend/src/components/{feature-name}/*.test.tsx` — use `renderWithProviders` for PrimeReact forms; `getByLabelText(/^password$/i)` for password fields with `toggleMask`
2. Run tests; **must fail** for the reported behavior.
3. If tests pass but manual repro fails → test is too narrow; add e2e/integration test first, then fix.
4. Add row to `IMPLEMENTATION.md` test cases table (e.g. `T5 | regression BUG-001 | …`).

### Phase 5 — Fix and document

1. **Green** — minimal fix; for UI forms extend `authPt` in `auth-pt.ts` rather than duplicating Tailwind on components.
2. **Refactor** — re-run targeted tests.
3. Update `BUG_REPORT.md`: root cause, **Fixes applied**, regression test ref, status `fixed`, verification steps.
4. Resume: append **Fix attempt N** block (do not delete history); see [reference.md](reference.md#resume--iterate).
5. Tick new row in `IMPLEMENTATION.md` TDD checklist.

### Phase 6 — Verify and fix until green

```bash
cd backend && npm test
cd backend && npm run lint
cd frontend && npm test -- --run
cd frontend && npm run lint
cd frontend && npm run build
```

Fix loop (max 10 attempts): read failures → fix → re-run. After 10 failures: report and stop — **do not offer PR**.

### Phase 7 — PR gate (optional)

Ask: **"Open a PR for this bugfix?"**

- Do **not** open PR unless user confirms.
- If yes: see [reference.md — Git and PR](reference.md#git-and-pr).
- If PR already exists for this fix: commit to same branch, push; do not open duplicate PR.
- If no: report summary (files changed, `BUG_REPORT.md` path, how to verify).

---

## Exploratory mode

### Phase 1 — Intake (no docs)

1. Parse bug description only; **skip** `doc/` reads.
2. Ask 2–3 questions if needed: error text, URL/route, backend vs frontend, when it started.

### Phase 2 — Investigate

1. `cd backend && npm test` and `cd frontend && npm test -- --run`.
2. Search codebase by symptoms (routes, components, error strings).
3. Infer `feature-name` from module paths (e.g. `backend/src/welcome-message/` → `welcome-message`).

### Phase 3 — Align with docs

- If `doc/{feature-name}/` exists → read `PRD.md` / `IMPLEMENTATION.md`; continue as scoped.
- If no doc folder → create `doc/{feature-name}/BUG_REPORT.md` only; note `PRD: not found`. Suggest `/prd` if this is a new feature area.

### Phases 4–7

Same as scoped: regression test → fix → `BUG_REPORT.md` → verify → PR gate.

---

## Resume / iterate when fix still fails

Run **`/debug`** again on the **same feature** with the same `BUG-00X` ID.

Example:

```
/debug welcome-message

Fix for BUG-001 still fails.
@doc/welcome-message/BUG_REPORT.md

Still seeing: … Expected: … Steps: …
```

Agent steps:

1. Set bug status `fix-incomplete` or `investigating`.
2. Reproduce; strengthen tests if unit tests pass but manual fails.
3. Append **Fix attempt N** under that bug (keep history).
4. Re-run Phase 6; set `fixed` when verified.
5. PR gate: update existing branch/PR if applicable.

**New bug vs same bug:**

| Situation | Action |
|-----------|--------|
| Same symptom, same layer | Same `BUG-00X`, new fix attempt |
| Different symptom or area | New `BUG-002` section |
| Tests green, manual fails | Stronger e2e/integration test, then fix |

**After merge still broken:** checkout latest `main`, same `BUG-00X`, fix attempt N+1.

---

## Status values (`BUG_REPORT.md`)

| Status | Meaning |
|--------|---------|
| `investigating` | Root cause not confirmed or fix not started |
| `fix-incomplete` | Fix tried; user reports still broken |
| `fixed` | Regression tests + manual repro pass |
| `wont-fix` | Accepted limitation (document why) |

---

## Interrupt mid-workflow

Read `doc/{feature-name}/BUG_REPORT.md` and `IMPLEMENTATION.md` checklist; continue from current bug status and first unchecked regression test row.
