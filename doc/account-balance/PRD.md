# Account balance on home

## Overview

Signed-in users see their external account **ledger balance** at the top of the home page (`/`). The Banshee backend proxies calls to the banking inquiry API using credentials and base URL from environment variables.

## Problem statement

The default Next.js home page does not show useful account information. Users need a quick view of their balance using the account number stored in profile personal info.

## Goals

- Replace Next.js starter home content with a balance banner and short welcome.
- Proxy banking API from the backend (secrets never in frontend or source code).
- Reusable `BankingApiService` for future banking endpoints.
- Display `Ledger_balance` formatted as LKR currency.

## User stories

1. As a signed-in user, I want to see my account balance on the home page so that I know my current funds.
2. As a user without an account number on file, I want guidance to add it in Profile so that I can view my balance.
3. As a user, I want to retry when the balance cannot be loaded so that transient errors are recoverable.

## Functional requirements

1. **FR-1** — Backend reads `BANKING_API_BASE_URL` and `BANKING_API_KEY` from env (documented in `.env.example`).
2. **FR-2** — `BankingApiService` performs HTTP requests to the base URL with header `x-api-key` on every call; supports arbitrary paths for future use.
3. **FR-3** — `GET /account/balance` (JWT required) loads the user’s `accountNumber` from PostgreSQL; returns `400` with a clear message if missing.
4. **FR-4** — Balance inquiry calls `GET /Inquiry/Account/AccountInquiry/1.0/GetAccountBalance?AccountCategory=EXT&AccountNumber={accountNumber}`.
5. **FR-5** — Response uses `Account_Balance_Inquiry.Account.Ledger_balance`; non-`0000` status codes map to a friendly API error.
6. **FR-6** — Balance is returned formatted as LKR (ledger value treated as smallest currency unit, divided by 100).
7. **FR-7** — Home page shows a compact top banner: “Your account balance is {formatted}” plus welcome using the user’s name.
8. **FR-8** — Missing account number shows message and link to `/profile`.
9. **FR-9** — Load failures show a friendly error and a Retry control.

## UI requirements

- Match existing zinc / dark theme (Tailwind); no new form fields on home.
- Retry uses PrimeReact `Button` (unstyled via global `authPt`).
- Reference layout: profile and auth pages.

## Non-goals

- Multiple accounts or account picker.
- Caching balance or webhooks.
- Calling banking API from the frontend directly.

## Success metrics

- Authenticated user with account number sees formatted balance on `/`.
- Unit and e2e tests pass; CI lint/build green.

## Open questions

- None for MVP.
