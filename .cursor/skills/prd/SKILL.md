---
name: prd
description: >-
  End-to-end feature workflow using TDD: clarify requirements, write
  doc/{feature}/PRD.md and IMPLEMENTATION.md with test cases, implement via
  Red-Green-Refactor (NestJS Jest + Next.js Vitest), fix failures until all
  checks pass, then open a GitHub PR. Use when the user types /prd.
disable-model-invocation: true
---

# /prd — PRD + TDD + End-to-End Build

Read [reference.md](reference.md) for repo-specific templates, TDD examples, and git/PR commands.

## Rules

- **TDD is mandatory** — write failing tests before production code; confirm red before green.
- **One feature per `/prd`** unless extending an existing `doc/{feature-name}/` folder.
- **MVP first** — smallest vertical slice; defer DB, auth, polish unless required.
- **Read before write** — match existing patterns in `frontend/` and `backend/`; no drive-by refactors.
- **No secrets** — never commit `.env`; add vars to `.env.example` only.
- **Stop and ask** before adding major dependencies (Postgres, OAuth, Redis, etc.).
- **Fix until green** — on failure, fix and re-run (up to 10 attempts); no PR until all checks pass.
- **Git safety** — never force-push; never commit secrets; stage only feature-related files.

---

## Phase 1 — Clarify (no files yet)

1. Parse the user's message and skim `frontend/src/` and `backend/src/`.
2. Ask **3–5** clarifying questions via **AskQuestion** (fallback: chat):
   - Problem, users, primary user flow
   - MVP scope for this run vs later
   - Data persistence (default: in-memory for MVP)
   - Auth / permissions if relevant
   - UI: pages, key interactions
3. Summarize understanding in plain language.

---

## Phase 2 — Confirm (gate)

Ask: **"Proceed to create the PRD, build with TDD (tests first), fix until all checks pass, and open a PR?"**

- Do **not** write docs, tests, or code until the user confirms.
- If scope is too large, propose an MVP slice and confirm that subset.

User confirmation authorizes commit + PR in Phase 7.

---

## Phase 3 — Document

1. Set `feature-name` = kebab-case slug (e.g. `task-list`).
2. Create `doc/{feature-name}/`.
3. Write **`doc/{feature-name}/PRD.md`**:
   - Overview, problem statement, goals
   - User stories (As a … I want … so that …)
   - Functional requirements (numbered, testable)
   - Non-goals, success metrics, open questions
4. Write **`doc/{feature-name}/IMPLEMENTATION.md`**:
   - API contract (routes, request/response shapes)
   - **Test cases table** (drives Phases 4–5):

```markdown
## Test cases (TDD)

| ID | Requirement | Layer | Test file | Describes |
|----|-------------|-------|-----------|-----------|
| T1 | … | backend | `{feature}.service.spec.ts` | … |
| T2 | … | frontend | `Component.test.tsx` | … |
```

   - File list (backend + frontend)
   - TDD checklist with `[ ]` per test case

---

## TDD cycle (Phases 4–6)

For each test case, in order:

1. **Red** — Write/update test; run it; **must fail**.
2. **Green** — Minimum code to pass.
3. **Refactor** — Clean up; re-run; stay green.

**Never** add production code for untested behavior.

---

## Phase 4 — Backend TDD (NestJS + Jest)

Per backend row in `IMPLEMENTATION.md`:

1. **Red** — Add `backend/src/{feature-name}/*.spec.ts`; run:
   `cd backend && npm test -- --testPathPattern={feature-name}` — confirm failure.
2. **Green** — Implement service, controller, DTOs, module.
3. **Refactor** — Re-run tests.
4. After unit tests pass, add e2e in `backend/test/{feature-name}.e2e-spec.ts` if HTTP endpoints exist.
5. Register `{FeatureName}Module` in `backend/src/app.module.ts`.
6. Enable CORS in `backend/src/main.ts` if frontend calls API cross-origin (backend port `3001`).
7. Tick off rows in `IMPLEMENTATION.md`.

---

## Phase 5 — Frontend TDD (Next.js + Vitest)

If `frontend` has no `npm test` script, run the **one-time Vitest setup** in [reference.md](reference.md) first.

Per frontend row in `IMPLEMENTATION.md`:

1. **Red** — Add `frontend/src/components/{feature-name}/*.test.tsx` or colocated `*.test.tsx`; run:
   `cd frontend && npm test -- --run` — confirm failure.
2. **Green** — Implement page (`frontend/src/app/{feature-name}/page.tsx`), components, `frontend/src/lib/api.ts`.
3. **Refactor** — Re-run tests.
4. Use `NEXT_PUBLIC_API_URL` (default `http://localhost:3001`).
5. Tick off rows in `IMPLEMENTATION.md`.

---

## Phase 6 — Verify and fix until green

Run all checks; **if any fail, fix and re-run** (max 10 attempts):

```bash
cd backend && npm test
cd backend && npm run lint
cd frontend && npm test -- --run
cd frontend && npm run lint
cd frontend && npm run build
```

**Fix loop:**

- Read stderr and failing test names.
- Fix implementation (prefer over changing tests; document test changes in `IMPLEMENTATION.md` if requirement was wrong).
- Re-run failed checks, then full suite.
- After 10 failed attempts: report failures and ask user — **do not open PR**.

When all pass, mark `IMPLEMENTATION.md` complete → Phase 7.

---

## Phase 7 — Branch, commit, open PR

**Prerequisites:** `git`, `gh auth status`, remote `origin` on GitHub. If working tree has unrelated changes, ask before proceeding.

1. `git checkout main && git pull` (if network), then `git checkout -b feature/{feature-name}`.
2. Stage only feature files: `doc/{feature-name}/`, `backend/src/{feature-name}/`, related `app.module.ts` / `main.ts`, `frontend/src/...`, `.env.example`.
3. Commit:
   ```
   feat({feature-name}): add {short description}

   Implements PRD in doc/{feature-name}/PRD.md.
   ```
4. `git push -u origin HEAD`
5. `gh pr create` with title `feat: {title}` and body:

```markdown
## Summary
- Implements `doc/{feature-name}/PRD.md`
- Backend: NestJS module + REST API
- Frontend: Next.js UI wired to API

## Test plan
- [ ] `cd backend && npm test && npm run lint`
- [ ] `cd frontend && npm test && npm run lint && npm run build`
- [ ] TDD: see `doc/{feature-name}/IMPLEMENTATION.md` test cases
- [ ] Manual: {smoke-test steps}

## Docs
- PRD: `doc/{feature-name}/PRD.md`
- Implementation: `doc/{feature-name}/IMPLEMENTATION.md`
```

6. Report PR URL, branch name, doc paths, and how to run locally.

---

## Resume mid-workflow

If interrupted, read `doc/{feature-name}/IMPLEMENTATION.md` checklist and continue from the first unchecked TDD row.
