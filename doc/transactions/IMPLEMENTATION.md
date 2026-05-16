# Implementation: transactions

## API contract

None for this slice (frontend-only). Future work may add:

- `POST /transactions/transfer/internal` — internal fund transfer proxy
- `POST /transactions/transfer/external` — external fund transfer proxy
- `GET /transactions/history` — transfer list

## Test cases (TDD)

| ID | Requirement | Layer | Test file | Describes |
|----|-------------|-------|-----------|-----------|
| T1 | FR-1, FR-6 | frontend | `Navbar.test.tsx` | Transactions link after Home, href `/transactions` |
| T2 | FR-2, FR-3, FR-5, FR-7 | frontend | `TransactionsPage.test.tsx` | Title, tabs, default Transfer panel with Internal toggle |
| T3 | FR-3, FR-12, FR-13 | frontend | `TransactionsPage.test.tsx` | History tab shows dummy transfer banners |
| T12 | FR-12, FR-13 | frontend | `TransferHistoryPanel.test.tsx` | Renders all dummy records as banners |
| T4 | FR-4 | frontend | `TransactionsPage.test.tsx` | Missing account shows Profile guidance, no tabs |
| T5 | FR-5 | frontend | `TransactionsPage.test.tsx` | With account, tabs visible |
| T6 | FR-7, FR-8 | frontend | `TransactionsPage.test.tsx` | Internal form fields visible by default |
| T7 | FR-9, FR-10 | frontend | `TransactionsPage.test.tsx` | External toggle shows external fields, hides internal |
| T8 | FR-11 | frontend | `InternalTransferForm.test.tsx` | Empty submit shows validation errors |
| T9 | FR-11 | frontend | `InternalTransferForm.test.tsx` | Valid submit shows success message |
| T10 | FR-11 | frontend | `ExternalTransferForm.test.tsx` | Empty submit shows validation errors |
| T11 | FR-11 | frontend | `ExternalTransferForm.test.tsx` | Valid submit shows success message |

## Files

### Backend

None (deferred).

### Frontend

- `frontend/src/components/navigation/nav-routes.ts`
- `frontend/src/components/navigation/Navbar.test.tsx`
- `frontend/src/components/transactions/TransactionsPage.tsx`
- `frontend/src/components/transactions/TransactionsPage.test.tsx`
- `frontend/src/components/transactions/FundTransferPanel.tsx`
- `frontend/src/components/transactions/InternalTransferForm.tsx`
- `frontend/src/components/transactions/InternalTransferForm.test.tsx`
- `frontend/src/components/transactions/ExternalTransferForm.tsx`
- `frontend/src/components/transactions/ExternalTransferForm.test.tsx`
- `frontend/src/components/transactions/transfer-validation.ts`
- `frontend/src/components/transactions/dummy-transfer-history.ts`
- `frontend/src/components/transactions/TransferHistoryBanner.tsx`
- `frontend/src/components/transactions/TransferHistoryPanel.tsx`
- `frontend/src/components/transactions/TransferHistoryPanel.test.tsx`
- `frontend/src/app/transactions/page.tsx`
- `frontend/src/lib/primereact/auth-pt.ts` (existing `transactionsTabSelectPt`)

## TDD checklist

- [x] T1 — Navbar test
- [x] T2 — TransactionsPage default tab
- [x] T3 — Tab switch to History
- [x] T4 — Missing account
- [x] T5 — With account
- [x] T6 — Internal form default
- [x] T7 — External toggle
- [x] T8 — Internal validation
- [x] T9 — Internal success
- [x] T10 — External validation
- [x] T11 — External success
- [x] T3 — History tab dummy banners (updated)
- [x] T12 — TransferHistoryPanel banners

## Status

Complete. History dummy banners slice; Phase 6 checks passed.
