# Implementation: transactions

## API contract

### `GET /transactions/history?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`

**Auth:** Bearer JWT

**Success `200`:**

```json
{
  "dateFrom": "2021-01-01",
  "dateTo": "2021-01-31",
  "transactions": [
    {
      "id": "12102168276330000001-0000015",
      "postingDate": "2021-02-16",
      "displayDate": "Feb 16, 2021",
      "formattedAmount": "LKR 100.00",
      "currency": "LKR",
      "transactionName": "TRANSFER - DEBIT",
      "statusLabel": "Posted",
      "reference": "TEST001",
      "summary": "TRANSFER - DEBIT · TEST001",
      "isDebit": true
    }
  ]
}
```

**Missing account `400`:** `Add your account number in Profile to view transaction history.`

**Invalid range `400`:** `Start date must be on or before end date.`

**Banking failure `502`:** `Unable to retrieve transaction history. Please try again.`

### External banking API (backend only)

- Path: `/Inquiry/Account/AccountInquiry/1.0/GetAccountTransactions?AccountCategory=EXT&AccountNumber={accountNumber}&StartDate={startDate}&EndDate={endDate}`
- Response root: `TransactionHistoryInquiryResponse`

## Test cases (TDD)

| ID | Requirement | Layer | Test file | Describes |
|----|-------------|-------|-----------|-----------|
| T1 | FR-1, FR-6 | frontend | `Navbar.test.tsx` | Transactions link after Home |
| T2 | FR-2, FR-3, FR-5, FR-7 | frontend | `TransactionsPage.test.tsx` | Default Transfer panel |
| T3 | FR-3, FR-12–FR-14 | frontend | `TransactionsPage.test.tsx` | History tab loads API banners |
| T4 | FR-4, FR-15 | frontend | `TransactionsPage.test.tsx` | Missing account on page |
| T5 | FR-5 | frontend | `TransactionsPage.test.tsx` | Tabs when account present |
| T6 | FR-7, FR-8 | frontend | `TransactionsPage.test.tsx` | Internal form default |
| T7 | FR-9, FR-10 | frontend | `TransactionsPage.test.tsx` | External toggle |
| T8 | FR-11 | frontend | `InternalTransferForm.test.tsx` | Internal validation |
| T9 | FR-11 | frontend | `InternalTransferForm.test.tsx` | Internal success |
| T10 | FR-11 | frontend | `ExternalTransferForm.test.tsx` | External validation |
| T11 | FR-11 | frontend | `ExternalTransferForm.test.tsx` | External success |
| T12 | FR-12–FR-14 | frontend | `TransferHistoryPanel.test.tsx` | Banners, search, missing account |
| T13 | FR-13 | backend | `build-transaction-history-path.spec.ts` | Banking path builder |
| T14 | FR-13, FR-14 | backend | `map-transaction-history.spec.ts` | Maps API transactions |
| T15 | FR-13, FR-15 | backend | `transaction-history.service.spec.ts` | Service + account gating |
| T16 | FR-13 | backend | `transaction-history.controller.spec.ts` | Controller |
| T17 | FR-13 | backend | `test/transaction-history.e2e-spec.ts` | HTTP 200 with JWT |
| T18 | FR-12 regression BUG-001 | frontend | `TransferHistoryDateRange.test.tsx`, `transfer-history-calendar.test.ts` | Calendar inputs show selected dates |

## Files

### Backend

- `backend/src/transaction-history/*`
- `backend/src/app.module.ts`

### Frontend

- `frontend/src/components/transactions/TransferHistoryPanel.tsx`
- `frontend/src/components/transactions/TransferHistoryDateRange.tsx`
- `frontend/src/components/transactions/TransferHistoryBanner.tsx`
- `frontend/src/components/transactions/transfer-history-dates.ts`
- `frontend/src/lib/api.ts` (`fetchTransactionHistory`)
- `frontend/src/lib/primereact/auth-pt.ts` (`calendar`, `historySearchButtonPt`)

## TDD checklist

- [x] T1–T12 — prior + history UI tests
- [x] T13–T17 — backend transaction history
- [x] T18 — regression BUG-001 calendar input display

## Status

Complete. Live transaction history slice; Phase 6 checks passed.
