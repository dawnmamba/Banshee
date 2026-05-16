# Bug reports: database-health

## BUG-001

| Field | Value |
|-------|-------|
| **Status** | fixed |
| **Severity** | medium |
| **Date opened** | 2026-05-16 |
| **PRD** | `doc/database-health/PRD.md` |
| **Linked requirements** | FR-4, FR-5, FR-6 (backend); frontend health page consumer gap |

### Summary

The `/health` page does not display PostgreSQL connectivity from `GET /health`'s `database` field.

### Environment

- Backend: `http://localhost:3001`
- Frontend: `http://localhost:3000/health`
- `NEXT_PUBLIC_API_URL` → backend

### Steps to reproduce

1. Start backend with Postgres running; open `http://localhost:3000/health`.
2. Observe only backend up/down and timestamps — no database row.
3. Stop Postgres; backend still returns HTTP 200 with `database: down` — UI still shows only "Backend is up".

### Expected vs actual

| | Behavior |
|---|----------|
| **Expected** | Health view shows database status (`up` / `down`) from the API `database` field. |
| **Actual** | `HealthResponse` omits `database`; `BackendStatus` ignores it and treats any HTTP 200 as fully healthy. |

### Root cause

`HealthResponse` in `frontend/src/lib/api.ts` omitted the `database` field. `BackendStatus` treated any successful HTTP response as fully healthy and never rendered database connectivity.

### Regression test

| ID | Test file | Test name |
|----|-----------|-----------|
| T6 | `frontend/src/components/database-health/BackendStatus.test.tsx` | shows database up/down from health API |

### Fixes applied

#### Fix attempt 1 (2026-05-16)

- **What changed:** Extended `HealthResponse` with `database` and `status`; `BackendStatus` stores and displays a Database row (`Up` / `Down`).
- **Files:** `frontend/src/lib/api.ts`, `frontend/src/components/BackendStatus.tsx`, `frontend/src/app/health/page.tsx`, `frontend/src/components/database-health/BackendStatus.test.tsx`
- **Why:** Surface `GET /health` `database` field (FR-4) on the existing `/health` page.

### Verification

- [x] `cd backend && npm test && npm run lint`
- [x] `cd frontend && npm test -- --run && npm run lint && npm run build`
- [ ] Manual: `/health` shows Database row; reflects `up`/`down` when Postgres is running/stopped
