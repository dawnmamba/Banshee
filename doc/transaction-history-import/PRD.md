# PRD: Transaction history JSON import

## Overview

Admins upload a bank **Transaction History Inquiry** JSON file. The backend validates the payload, **fully replaces** persisted import tables in PostgreSQL, and the admin dashboard shows customers, account summaries, and transaction counts from the database.

## Problem statement

Sample inquiry responses arrive as nested JSON (multiple customers, status, account summary, transactions). The app needs normalized relational storage and an operator workflow to load and inspect that data without using the live banking API or end-user transaction routes.

## Goals

- PostgreSQL schema with foreign keys: customer → status, account summary, transactions.
- Admin-only `POST` import (JSON body parsed from uploaded file on the client).
- Full replace on each import (truncate import tables, then insert).
- Admin UI: file upload, import result message, summary table (customer, account, balance, transaction count).

## User stories

1. **As an** admin, **I want** to upload a `.json` inquiry file **so that** customer and transaction data is stored in the database.
2. **As an** admin, **I want** to see a table of imported customers and transaction counts **so that** I can verify the load.
3. **As an** admin, **I want** invalid JSON rejected with a clear error **so that** I do not corrupt stored data.

## Functional requirements

1. **FR-1** — Tables: `imported_customers`, `imported_inquiry_statuses`, `imported_account_summaries`, `imported_bank_transactions` with FKs and `unique_key` unique on transactions.
2. **FR-2** — `POST /admin/transaction-import` (admin JWT): body matches inquiry envelope; on success returns `{ customerCount, transactionCount }`.
3. **FR-3** — Import runs in a DB transaction: delete all import rows, then insert from payload.
4. **FR-4** — `GET /admin/transaction-import/summary` (admin JWT): array of `{ customerId, accountShortName, accountBranch, currency, availableBalance, transactionCount }`.
5. **FR-5** — `GET /admin/transaction-import/customers/:customerId/transactions` (admin JWT): transactions for one customer, newest posting date first.
6. **FR-6** — Invalid payload → `400` with message; non-admin → `403` (existing guards).

## Non-goals

- Linking `CustomerId` to `users`.
- Incremental upsert (only full replace).
- End-user `/transactions` reading from import tables.
- Storing import batch history beyond current snapshot.

## Success metrics

- Import of sample JSON (5 customers, 10 transactions) succeeds.
- Summary and per-customer transaction endpoints match DB after import.
- Second import replaces prior data entirely.

## UI requirements

- PrimeReact unstyled; styling via `frontend/src/lib/primereact/auth-pt.ts` (extend `fileupload` if needed).
- Components: `FileUpload`, `Button`, `Message`, `DataTable` or semantic HTML table with zinc classes.
- Reference: `frontend/src/components/user-auth/LoginForm.tsx`.
- Admin page: `/admin` — upload section + summary table; select row to load transactions list.

## Open questions

- None for MVP.
