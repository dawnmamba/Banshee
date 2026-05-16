# Workflows: `/prd` and `/debug`

This guide explains how to use Cursor skills in this repo to **build features** (`/prd`) and **fix bugs** (`/debug`). You do not need to read the agent skill files in `.cursor/skills/` unless you want full technical detail.

## Project layout

| Path | Stack | Port |
|------|-------|------|
| `backend/` | NestJS | 3001 |
| `frontend/` | Next.js (App Router) | 3000 |

Open the **repo root** in [Cursor](https://cursor.com), then type `/prd` or `/debug` in chat to run the matching skill.

Agent instructions live in `.cursor/skills/` — you normally do not edit those files.

---

## Documentation per feature

Each feature has its own folder under `doc/`:

```
doc/
  {feature-name}/
    PRD.md              # What to build (requirements)
    IMPLEMENTATION.md   # How it was built + test table
    BUG_REPORT.md       # Bugs and fixes (created by /debug)
```

**Example:** [doc/welcome-message/](doc/welcome-message/) — see [PRD.md](doc/welcome-message/PRD.md) and [IMPLEMENTATION.md](doc/welcome-message/IMPLEMENTATION.md).

Use **kebab-case** for feature names (e.g. `welcome-message`, `task-list`).

---

## `/prd` — Build a new feature

### When to use it

- You want a **new capability** (or a clear extension of an existing one).
- You want requirements written down, **tests first** (TDD), then implementation.
- You are fine answering a few clarifying questions before any files are created.

### What happens

1. The agent asks **3–5 clarifying questions** (scope, users, MVP, etc.).
2. You **confirm** — then it creates `doc/{feature}/PRD.md` and `IMPLEMENTATION.md`.
3. **TDD:** failing tests → minimum code to pass → refactor.
4. Full checks run (backend + frontend tests, lint, build).
5. It can open a GitHub PR on branch `feature/{feature-name}` (after you confirm at the start).

### How to invoke

**New feature:**

```text
/prd

I want a task list: add, complete, and delete tasks. In-memory storage is fine for MVP.
```

**Extend an existing feature:**

```text
/prd task-list

Extend the task list with due dates.
@doc/task-list/PRD.md
```

Attach docs with `@` in Cursor (e.g. `@doc/welcome-message/PRD.md`) so the agent has context.

### What you need ready

- A rough description of the feature and who it is for.
- Answers when the agent asks about MVP scope, persistence, auth, UI, etc.
- A clear **yes** when it asks to proceed — nothing is written until you confirm.

### What you get

- `doc/{feature}/PRD.md` — requirements and user stories
- `doc/{feature}/IMPLEMENTATION.md` — API contract, test cases, file list
- Backend module under `backend/src/{feature}/`
- Frontend UI under `frontend/src/` (pages, components, tests)

---

## `/debug` — Fix a bug

### When to use it

- Something **broken** in existing behavior.
- You want a **regression test** before the fix, a **bug report** on disk, and all checks green before an optional PR.

### Two modes

| Mode | When | What to provide |
|------|------|-----------------|
| **Scoped** | You know the feature | Feature name + bug description; optionally `@doc/.../PRD.md` and `IMPLEMENTATION.md` |
| **Exploratory** | You do not know which module | Symptom only — the agent searches the codebase |

### What happens

1. Reproduce the bug (tests + manual steps).
2. Create or update `doc/{feature}/BUG_REPORT.md` (`BUG-001`, `BUG-002`, …).
3. **Regression test first** (must fail on the bug), then fix.
4. Run full test / lint / build suite.
5. The agent **asks** if you want a PR on branch `fix/{feature-name}` (you confirm at the **end**).

### How to invoke

**Scoped (known feature):**

```text
/debug welcome-message

Empty last name still returns 200. Expected 400 per FR-3.
@doc/welcome-message/PRD.md
@doc/welcome-message/IMPLEMENTATION.md
```

**Exploratory (unknown feature):**

```text
/debug

Welcome page shows "Failed to fetch" after submit. Not sure which file is wrong.
```

### If the fix still does not work

Run `/debug` again on the **same feature** and point at the existing report:

```text
/debug welcome-message

Fix for BUG-001 still fails.
@doc/welcome-message/BUG_REPORT.md

Still seeing: 200 on empty lastName. Expected: 400.
Steps: submit the form with a blank last name.
```

The agent adds a new **Fix attempt** section under the same `BUG-001` — it does not start a new bug ID unless the problem is actually different.

### Bug report location

All bugs for a feature live in one file:

**`doc/{feature-name}/BUG_REPORT.md`**

---

## Quick comparison

| | `/prd` | `/debug` |
|---|--------|----------|
| **Purpose** | New feature | Fix bug |
| **Main docs** | `PRD.md` + `IMPLEMENTATION.md` | `BUG_REPORT.md` |
| **Tests** | New feature tests | Regression test |
| **Git branch** | `feature/{name}` | `fix/{name}` |
| **PR timing** | Confirm before build starts | Confirm after fix is verified |

---

## Prerequisites

1. **Cursor** — project opened at this repo root.
2. **Dependencies** — from repo root:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
3. **Local run** (manual testing):
   ```bash
   cd backend && npm run start:dev    # http://localhost:3001
   cd frontend && npm run dev       # http://localhost:3000
   ```
4. **Pull requests** (optional) — GitHub CLI logged in:
   ```bash
   gh auth login
   ```

Environment: frontend uses `NEXT_PUBLIC_API_URL` (default `http://localhost:3001`). See `frontend/.env.example` and `backend/.env.example` — never commit `.env` files.

---

## Verify changes yourself

After `/prd` or `/debug` finishes, you can run the same checks locally:

```bash
cd backend && npm test && npm run lint
cd frontend && npm test -- --run && npm run lint && npm run build
```

---

## Further reading (agent / templates)

| Topic | File |
|-------|------|
| Full `/prd` workflow | [.cursor/skills/prd/SKILL.md](.cursor/skills/prd/SKILL.md) |
| PRD templates, TDD examples | [.cursor/skills/prd/reference.md](.cursor/skills/prd/reference.md) |
| Full `/debug` workflow | [.cursor/skills/debug/SKILL.md](.cursor/skills/debug/SKILL.md) |
| Bug report template, git/PR | [.cursor/skills/debug/reference.md](.cursor/skills/debug/reference.md) |
