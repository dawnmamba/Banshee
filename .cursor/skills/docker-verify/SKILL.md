---
name: docker-verify
description: >-
  Verify Docker deployment readiness: free FE/BE ports from .env, build and run
  local images, run container HTTP e2e and backend test:e2e, report SAFE or NOT SAFE.
  Use when the user types /docker-verify.
disable-model-invocation: true
---

# /docker-verify — Docker build + run + e2e gate

Read [reference.md](reference.md) for env evolution, port discovery, manual commands, and troubleshooting.

## Rules

- **Verify only** — do not change Dockerfiles or app code unless the user asks to fix failures.
- **No secrets** — never print `.env` contents in chat.
- **Script is source of truth** — run [scripts/docker-verify.sh](../../../scripts/docker-verify.sh) from repo root.
- **Warn before kill** — unless user passed `--no-kill`, confirm they are OK freeing ports derived from `.env` (dev servers on 3000/3001 will stop).

---

## Phase 1 — Prerequisites

1. Repo root open in Cursor; `backend/Dockerfile` and `frontend/Dockerfile` exist.
2. Docker daemon running (`docker info` succeeds).
3. `backend/.env` exists (required for `docker run --env-file`). `frontend/.env` or `frontend/.env.example` for build-args.
4. Backend deps installed for Jest e2e: `cd backend && npm install` if `node_modules` missing.

---

## Phase 2 — Confirm (unless skipped)

If the user did **not** pass `--no-kill`, use **AskQuestion** or ask once:

> This will kill any process on ports derived from your `.env` (typically 3000 and 3001) and replace running `banshee-*` containers. Continue?

Proceed on yes; re-run with `--no-kill` if they already freed ports.

---

## Phase 3 — Execute

From repo root:

```bash
chmod +x scripts/docker-verify.sh
./scripts/docker-verify.sh
```

Optional flags:

| Flag | Effect |
|------|--------|
| `--no-kill` | Skip freeing ports |
| `--keep` | Leave containers running after verify |

---

## Phase 4 — Verdict

Parse script output. Reply with **exactly one** headline:

### Success

```markdown
## Build is SAFE

- Docker images built and containers started
- Docker HTTP e2e passed
- Backend Jest e2e passed
```

Add port numbers from script log if helpful.

### Failure

```markdown
## Build is NOT SAFE

- Failed at: {step from script}
- {reason}
```

Include last lines from `docker logs banshee-backend` / `banshee-frontend` only if the script did not already print them. Do not paste `.env` values.

---

## What the script checks

| Gate | Proves |
|------|--------|
| Docker HTTP e2e | Images build, containers start, CORS + API URL wiring |
| `npm run test:e2e` | Nest API contract (in-process; not Docker networking) |

---

## Examples

```text
/docker-verify
```

```text
/docker-verify

Verify before merging feature/docker-setup. Ports already free — use --no-kill.
```

Then run: `./scripts/docker-verify.sh --no-kill`
