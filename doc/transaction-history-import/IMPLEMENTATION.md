# Implementation: transaction-history-import

## API contract

### `POST /admin/transaction-import`

**Auth:** Bearer JWT, role `admin`

**Body:** JSON envelope

```json
{
  "TransactionHistoryInquiryResponses": [
    {
      "CustomerId": "CUS0001",
      "TransactionHistoryInquiryResponse": {
        "Status": { "Transaction_Reference": "...", "Timestamp": "...", "Code": "0000", "Message": null, "Description": null },
        "AccountSummary": { "Account_branch": "0640", "Account_basic_number": "XA114D", "Account_suffix": "001", "Account_short_name": "VOXVERSE STUDIO", "Customer_mnemonic": "XA114D", "Account_type": "CA", "Currency_mnemonic": "LKR", "Available_balance": "10050000.00" },
        "Transaction": [{ "Posting_date": "2026-05-12", "Transaction_Code_Name": "TRANSFER - CREDIT", "Posting_amount": "50000.00", "Running_balance": "50000.00", "Unique_key": "SHOTPEI2605120000001" }]
      }
    }
  ]
}
```

**Response `200`:**

```json
{ "customerCount": 5, "transactionCount": 10 }
```

### `GET /admin/transaction-import/summary`

**Response `200`:**

```json
[
  {
    "customerId": "CUS0001",
    "accountShortName": "VOXVERSE STUDIO",
    "accountBranch": "0640",
    "currency": "LKR",
    "availableBalance": "10050000.00",
    "transactionCount": 2
  }
]
```

### `GET /admin/transaction-import/customers/:customerId/transactions`

**Response `200`:**

```json
[
  {
    "uniqueKey": "SHOTPEI2605120000001",
    "postingDate": "2026-05-12",
    "transactionCodeName": "TRANSFER - CREDIT",
    "postingAmount": "50000.00",
    "runningBalance": "50000.00"
  }
]
```

## Test cases (TDD)

| ID | Requirement | Layer | Test file | Describes |
|----|-------------|-------|-----------|-----------|
| T1 | FR-3 | backend | `parse-import-payload.spec.ts` | Valid payload parses; invalid throws |
| T2 | FR-3 | backend | `transaction-history-import.service.spec.ts` | Full replace inserts customers and transactions |
| T3 | FR-4 | backend | `transaction-history-import.service.spec.ts` | `getSummary()` returns counts per customer |
| T4 | FR-5 | backend | `transaction-history-import.service.spec.ts` | `getTransactions(customerId)` returns rows |
| T5 | FR-2,6 | backend | `transaction-history-import.controller.spec.ts` | Controller delegates to service |
| T6 | UI | frontend | `TransactionImportPanel.test.tsx` | Upload triggers API; shows success message |
| T7 | UI | frontend | `AdminDashboard.test.tsx` | Renders summary table from API |

## File list

### Backend

- `backend/src/transaction-history-import/entities/imported-customer.entity.ts`
- `backend/src/transaction-history-import/entities/imported-inquiry-status.entity.ts`
- `backend/src/transaction-history-import/entities/imported-account-summary.entity.ts`
- `backend/src/transaction-history-import/entities/imported-bank-transaction.entity.ts`
- `backend/src/database/migrations/1747700000000-CreateTransactionHistoryImportTables.ts`
- `backend/src/transaction-history-import/parse-import-payload.ts`
- `backend/src/transaction-history-import/parse-import-payload.spec.ts`
- `backend/src/transaction-history-import/transaction-history-import.service.ts`
- `backend/src/transaction-history-import/transaction-history-import.service.spec.ts`
- `backend/src/transaction-history-import/transaction-history-import.controller.ts`
- `backend/src/transaction-history-import/transaction-history-import.controller.spec.ts`
- `backend/src/transaction-history-import/transaction-history-import.module.ts`
- `backend/src/admin/admin.module.ts` (import module)
- `backend/src/app.module.ts`

### Frontend

- `frontend/src/lib/api.ts`
- `frontend/src/lib/primereact/auth-pt.ts` (fileupload pt)
- `frontend/src/components/admin/TransactionImportPanel.tsx`
- `frontend/src/components/admin/TransactionImportPanel.test.tsx`
- `frontend/src/components/admin/AdminDashboard.tsx`
- `frontend/src/components/admin/AdminDashboard.test.tsx`
- `frontend/src/test/render.tsx`

## TDD checklist

- [x] T1 — parse payload spec
- [x] T2 — service import full replace
- [x] T3 — service getSummary
- [x] T4 — service getTransactions
- [x] T5 — controller spec
- [x] T6 — TransactionImportPanel test
- [x] T7 — AdminDashboard test
