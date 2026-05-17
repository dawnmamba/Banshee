# Bug reports: admin-rbac

## BUG-001

| Field | Value |
|-------|-------|
| **Status** | fixed |
| **Severity** | high |
| **Date opened** | 2026-05-17 |
| **PRD** | `doc/admin-rbac/PRD.md` |
| **Linked requirements** | FR-1, FR-2 |

### Summary

`npm run migration:run` fails on Windows with "The system cannot find the path specified.", blocking the admin role migration.

### Environment

- OS: Windows 10 (MINGW64 / PowerShell)
- Command cwd: `backend/`
- Postgres configured via `backend/.env`

### Steps to reproduce

1. `cd backend`
2. `npm run migration:run`

### Expected vs actual

| | Behavior |
|---|---|
| **Expected** | Pending migrations (including `AddUserRoleAndSeedAdmin`) apply successfully |
| **Actual** | Immediate failure: `The system cannot find the path specified.` |

### Root cause

The `typeorm` npm script invokes `typeorm-ts-node-commonjs`, whose Windows `.cmd` shim falls back to `/bin/sh` when Git Bash `sh.exe` is not on PATH. That path does not exist under cmd/PowerShell, so the CLI never starts.

### Regression test

| ID | Test file | Test name |
|----|-----------|-----------|
| T9 | `database-cli.spec.ts` | `runs TypeORM via node and ts-node (Windows-compatible)` |

### Fixes applied

#### Fix attempt 1 (2026-05-17)

- **What changed:** Replaced `typeorm-ts-node-commonjs` npm script with `node -r ts-node/register ./node_modules/typeorm/cli.js` so the CLI runs on Windows without `/bin/sh`.
- **Files:** `backend/package.json`, `backend/src/database/database-cli.spec.ts`
- **Why:** The `typeorm-ts-node-commonjs` `.cmd` shim invokes `/bin/sh`, which does not exist under cmd/PowerShell.

#### Fix attempt 2 (2026-05-17)

- **What changed:** Cast seed INSERT parameters to `::varchar` in the admin migration; narrowed migration glob to `[0-9]*-*.{ts,js}` so Jest specs are not loaded as migrations.
- **Files:** `backend/src/database/migrations/1747600000000-AddUserRoleAndSeedAdmin.ts`, `backend/src/database/database.config.ts`, `backend/src/database/add-user-role-and-seed-admin.migration.spec.ts`
- **Why:** Postgres rejected reused `$1` (text vs `character varying`); placing a `.spec.ts` under `migrations/` broke `migration:run` after the CLI fix.

### Verification

- [x] `cd backend && npm test -- --testPathPatterns=database-cli`
- [x] `cd backend && npm test -- --testPathPatterns=AddUserRoleAndSeedAdmin`
- [x] `cd backend && npm run migration:run`
- [x] `cd backend && npm run migration:show` shows `AddUserRoleAndSeedAdmin` applied
