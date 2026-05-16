# /debug Reference — Buildathon Monorepo

## Stack

| Layer | Path | Port | Notes |
|-------|------|------|-------|
| Backend | `backend/` | 3001 | NestJS, Jest (`npm test`) |
| Frontend | `frontend/` | 3000 | Next.js App Router, Vitest (`npm test`) |
| Docs | `doc/{feature-name}/` | — | `PRD.md`, `IMPLEMENTATION.md`, `BUG_REPORT.md` |

Env: `NEXT_PUBLIC_API_URL=http://localhost:3001` in `frontend/.env.local`.

---

## BUG_REPORT template

One file per feature: `doc/{feature-name}/BUG_REPORT.md`. Multiple bugs as `## BUG-001`, `## BUG-002`.

```markdown
# Bug reports: {feature-name}

## BUG-001

| Field | Value |
|-------|-------|
| **Status** | investigating |
| **Severity** | high / medium / low |
| **Date opened** | YYYY-MM-DD |
| **PRD** | `doc/{feature-name}/PRD.md` (or: not found) |
| **Linked requirements** | FR-3, FR-5 |

### Summary

One-line description of the bug.

### Environment

- Backend: `http://localhost:3001`
- Frontend: `http://localhost:3000`
- Other: browser, env vars if relevant

### Steps to reproduce

1. …
2. …

### Expected vs actual

| | Behavior |
|---|----------|
| **Expected** | … (cite FR-* when PRD exists) |
| **Actual** | … |

### Root cause

(Fill after investigation.)

### Regression test

| ID | Test file | Test name |
|----|-----------|-----------|
| T5 | `welcome-message.service.spec.ts` | `rejects empty lastName` |

### Fixes applied

#### Fix attempt 1 (YYYY-MM-DD)

- **What changed:** …
- **Files:** `backend/src/...`, `frontend/src/...`
- **Why:** …

### Verification

- [ ] `cd backend && npm test -- --testPathPattern={feature-name}`
- [ ] `cd frontend && npm test -- --run`
- [ ] Manual: …

---

## BUG-002

(Next bug — copy structure above.)
```

### Status values

| Status | When to use |
|--------|-------------|
| `investigating` | Opened; root cause not confirmed |
| `fix-incomplete` | Fix attempted; user says still broken |
| `fixed` | Tests + manual repro pass |
| `wont-fix` | Accepted limitation |

---

## Resume / iterate

When a fix fails, append under the same `## BUG-00X` (do not delete prior attempts):

```markdown
#### Fix attempt 2 (YYYY-MM-DD)

- **What changed:** …
- **Why previous fix failed:** …
- **Files:** …
```

Set status to `fix-incomplete` at start of iteration; set `fixed` when Phase 6 passes.

---

## Exploratory checklist

Use when `/debug` runs **without** doc attachments:

1. [ ] Capture symptoms, route/URL, error messages from user
2. [ ] `cd backend && npm test` — note failures
3. [ ] `cd frontend && npm test -- --run` — note failures
4. [ ] `rg` / search: error strings, route paths, component names
5. [ ] Map to `feature-name` from `backend/src/{feature}/` or `frontend/src/components/{feature}/`
6. [ ] If `doc/{feature}/` exists → read PRD + IMPLEMENTATION; else create `BUG_REPORT.md` only
7. [ ] Continue scoped Phases 4–7

---

## TDD regression cycle

```
Red    → write regression test, run, MUST fail on bug
Green  → minimum fix
Refactor → clean up, stay green
```

### Backend regression example

Extend existing spec (e.g. validation bug on `POST /welcome`):

```typescript
it('createWelcome() throws when lastName is empty after trim', () => {
  expect(() =>
    controller.createWelcome({ firstName: 'Jane', lastName: '   ' }),
  ).toThrow();
});
```

Run: `cd backend && npm test -- --testPathPattern=welcome-message`

### Frontend regression example

```typescript
it('shows validation error when last name is blank', async () => {
  render(<WelcomeForm />);
  await userEvent.type(screen.getByLabelText(/first name/i), 'Jane');
  await userEvent.click(screen.getByRole('button', { name: /submit/i }));
  expect(await screen.findByText(/last name/i)).toBeInTheDocument();
});
```

### E2E when unit tests pass but UI fails

Add or extend `backend/test/{feature-name}.e2e-spec.ts`:

```typescript
it('POST /welcome returns 400 for empty lastName', () => {
  return request(app.getHttpServer())
    .post('/welcome')
    .send({ firstName: 'Jane', lastName: '' })
    .expect(400);
});
```

---

## IMPLEMENTATION.md updates

After adding a regression test, append to the test cases table:

```markdown
| T5 | FR-3 regression | backend | `welcome-message.controller.spec.ts` | empty lastName rejected |
```

Add checklist row: `- [ ] T5 — regression BUG-001` → tick when green.

---

## Phase 6 check commands

Same as `/prd`:

```bash
cd backend && npm test && npm run lint
cd frontend && npm test -- --run && npm run lint && npm run build
```

Or run individually during fix loop:

```bash
cd backend && npm test
cd backend && npm run lint
cd frontend && npm test -- --run
cd frontend && npm run lint
cd frontend && npm run build
```

Max **10** fix attempts before stopping without PR.

---

## Git and PR

| Step | Command |
|------|---------|
| Branch | `git checkout -b fix/{feature-name}` or `fix/{feature-name}-bug-001` |
| Push | `git push -u origin HEAD` |
| PR | `gh pr create --title "fix: …" --body "…"` |

**Commit format:**

```
fix({feature-name}): {short description}

Fixes BUG-001 in doc/{feature-name}/BUG_REPORT.md.
```

**Stage only:** `doc/{feature-name}/BUG_REPORT.md`, changed specs, fix files, `IMPLEMENTATION.md` if updated.

**Never stage:** `.env`, `node_modules/`, `frontend/.next/`, `backend/dist/`.

**PR body template:**

```markdown
## Summary
- Fixes BUG-00X for `{feature-name}`
- Regression test: {test file + case name}

## Test plan
- [ ] `cd backend && npm test && npm run lint`
- [ ] `cd frontend && npm test -- --run && npm run lint && npm run build`
- [ ] Manual: {repro steps from BUG_REPORT}

## Docs
- Bug report: `doc/{feature-name}/BUG_REPORT.md`
- PRD: `doc/{feature-name}/PRD.md` (if exists)
- Implementation: `doc/{feature-name}/IMPLEMENTATION.md` (if exists)
```

If a PR already exists for this branch: `git push` only; do not run `gh pr create` again.

---

## Example invocations

**Scoped (new bug):**

```
/debug welcome-message

Bug: Submitting empty last name still returns 200. Expected: 400 per FR-3.
@doc/welcome-message/PRD.md @doc/welcome-message/IMPLEMENTATION.md
```

**Exploratory:**

```
/debug

The welcome page shows "Failed to fetch" after submit. No idea which module.
```

**Resume (fix still broken):**

```
/debug welcome-message

Fix for BUG-001 still fails.
@doc/welcome-message/BUG_REPORT.md

Still seeing: 200 on empty lastName. Expected: 400. Steps: submit form with blank last name.
```
