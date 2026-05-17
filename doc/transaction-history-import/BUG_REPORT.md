# Bug reports: transaction-history-import

## BUG-001

| Field | Value |
|-------|-------|
| **Status** | fixed |
| **Severity** | high |
| **Date opened** | 2026-05-17 |
| **PRD** | `doc/transaction-history-import/PRD.md` |
| **Linked requirements** | FR-2, FR-3 |

### Summary

`POST /admin/transaction-import` returns HTTP 500 when importing valid JSON.

### Environment

- Backend: `http://localhost:3001` (`npm run start:dev`)
- Frontend: `/admin` JSON upload

### Steps to reproduce

1. Log in as admin.
2. Open `/admin` and upload a valid inquiry JSON file.
3. Click **Import JSON**.

### Expected vs actual

| | Behavior |
|---|----------|
| **Expected** | `200` with `{ customerCount, transactionCount }` (FR-2, FR-3 full replace) |
| **Actual** | `500` — `{"statusCode":500,"message":"Internal server error"}` |

### Root cause

1. **BUG-001a:** TypeORM `EntityManager.delete(Entity, {})` rejects empty criteria.
2. **BUG-001b:** `EntityManager.clear()` uses per-table `TRUNCATE` without `CASCADE`, so truncating `imported_customers` fails while child tables still reference it (`QueryFailedError: cannot truncate a table referenced in a foreign key constraint`).

### Regression test

| ID | Test file | Test name |
|----|-----------|-----------|
| T8 | `transaction-history-import.service.spec.ts` | `clears import tables then inserts customers and transactions` (uses `clear`, not `delete({})`) |

### Fixes applied

#### Fix attempt 1 (2026-05-17)

- **What changed:** Replace `manager.delete(Entity, {})` with `manager.clear(Entity)` in FK-safe order.
- **Files:** `transaction-history-import.service.ts`, `transaction-history-import.service.spec.ts`
- **Why:** `delete({})` is invalid in TypeORM.
- **Result:** Still 500 — Postgres rejects non-CASCADE `TRUNCATE` on parent table.

#### Fix attempt 2 (2026-05-17)

- **What changed:** Single `TRUNCATE TABLE ... RESTART IDENTITY CASCADE` for all four import tables via `manager.query()`.
- **Files:** `transaction-history-import.service.ts`, `transaction-history-import.service.spec.ts`
- **Why:** Matches Postgres FK behavior for full replace (FR-3).

### Verification

- [x] `cd backend && npm test -- --testPathPatterns=transaction-history-import`
- [x] `cd backend && npm test && npm run lint`
- [x] Manual: `POST /admin/transaction-import` → `201` with counts (curl verified)
- [ ] Manual: admin UI import sample JSON → success message and summary table populated
