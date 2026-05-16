# Implementation: transactions

## API contract

None for this MVP (frontend-only shell). Future work may add:

- `POST /transactions/transfer` — fund transfer proxy
- `GET /transactions/history` — transfer list

## Test cases (TDD)

| ID | Requirement | Layer | Test file | Describes |
|----|-------------|-------|-----------|-----------|
| T1 | FR-1, FR-8 | frontend | `Navbar.test.tsx` | Transactions link after Home, href `/transactions` |
| T2 | FR-2, FR-3, FR-4, FR-5, FR-7 | frontend | `TransactionsPage.test.tsx` | Renders title, tabs, default Fund Transfer panel |
| T3 | FR-3, FR-5 | frontend | `TransactionsPage.test.tsx` | Switching to Transfer History shows history placeholder |
| T4 | FR-6 | frontend | `TransactionsPage.test.tsx` | Missing account number shows Profile guidance, no tabs |
| T5 | FR-7 | frontend | `TransactionsPage.test.tsx` | With account number, tabs and panels visible |

## Files

### Backend

None (deferred).

### Frontend

- `frontend/src/components/navigation/nav-routes.ts`
- `frontend/src/components/navigation/Navbar.test.tsx`
- `frontend/src/components/transactions/TransactionsPage.tsx`
- `frontend/src/components/transactions/TransactionsPage.test.tsx`
- `frontend/src/app/transactions/page.tsx`
- `frontend/src/lib/primereact/auth-pt.ts` (existing `selectbutton` pt)

## TDD checklist

- [x] T1 — Navbar test (red → green)
- [x] T2 — TransactionsPage default tab (red → green)
- [x] T3 — Tab switch (red → green)
- [x] T4 — Missing account (red → green)
- [x] T5 — With account (red → green)

## Status

Complete. Phase 6 checks passed.
