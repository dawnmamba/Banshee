# Transactions page (tabs + fund transfer forms)

## Overview

Signed-in users get a **Transactions** nav item and a `/transactions` page with two switchable sections: **Transfer** and **History**. The **Transfer** tab includes an **Internal / External** toggle that shows one of two fund-transfer forms (UI + client validation only; no banking API yet).

## Problem statement

Users need a dedicated place in the app for money movement and past transfers. They must choose between transfers within the bank (internal) and transfers to other institutions (external) before entering details.

## Goals

- Add **Transactions** link after **Home** in the main navbar.
- Provide `/transactions` with Transfer and History tabs on the same page.
- Require sign-in and a profile account number before showing transfer UI.
- On the Transfer tab, toggle **Internal** vs **External** and show the matching form.
- Validate required fields client-side; show success feedback without calling a transfer API.

## User stories

1. As a signed-in user, I want a Transactions link in the nav so that I can open the transactions area quickly.
2. As a signed-in user, I want to switch between Transfer and History tabs so that I can move money or review past activity.
3. As a user without an account number, I want a clear message and link to Profile so that I can set up my account before using transfers.
4. As a signed-in user with an account, I want to choose Internal or External transfer so that I see the right form fields.
5. As a signed-in user, I want validation on transfer fields so that I fix mistakes before a future API submission.

## Functional requirements

1. **FR-1** — `NAV_ROUTES` includes `{ href: '/transactions', label: 'Transactions' }` immediately after Home.
2. **FR-2** — `/transactions` renders a page titled **Transactions** with zinc layout consistent with Home.
3. **FR-3** — Page shows a tab control with labels **Transfer** and **History**; selecting a tab shows only that panel.
4. **FR-4** — Page loads profile via `fetchProfile()`; if `accountNumber` is missing or blank after trim, show missing-account message and link to `/profile` instead of tabs.
5. **FR-5** — When `accountNumber` is present, show the tab control and panels.
6. **FR-6** — Navbar highlights **Transactions** when `pathname === '/transactions'`.
7. **FR-7** — Transfer panel shows an **Internal / External** segmented control (PrimeReact unstyled); default **Internal**.
8. **FR-8** — **Internal** form fields: To account number (required), Amount (required, positive number), Memo (optional).
9. **FR-9** — **External** form fields: Beneficiary name (required), Routing number (required), Account number (required), Amount (required, positive number), Memo (optional).
10. **FR-10** — Only one transfer form is visible at a time; switching type shows the other form.
11. **FR-11** — Submit validates required fields; on success shows a non-destructive success message (no API call).
12. **FR-12** — History panel provides **Start date** and **End date** selectors (PrimeReact Calendar) and a **Search** control; default range is the last 30 days.
13. **FR-13** — On search (and initial load), backend proxies `GetAccountTransactions` using profile `accountNumber`, `AccountCategory=EXT`, and selected dates (`YYYY-MM-DD`).
14. **FR-14** — Each transaction renders as a zinc banner card: display date, status label, formatted amount (debit in red), and summary (`Transaction_Code_Name · reference`).
15. **FR-15** — Empty API result shows a friendly “no transactions” banner; API errors show retry; missing account number shows Profile link (same gating as balance).

## UI requirements

- PrimeReact unstyled; `SelectButton` for section tabs and Internal/External toggle via `transactionsTabSelectPt` in `frontend/src/lib/primereact/auth-pt.ts`.
- Forms use `FieldLabel`, `InputText`, `InputTextarea`, `Button`, `Message` — same patterns as Profile / auth forms.
- Page layout matches Home (`max-w-4xl`, zinc/dark tokens).
- No native form controls.

## Non-goals

- Backend routes or banking API proxy for transfers.
- Persisting custom date-range preferences.
- Real fund movement or OTP / 2FA.

## Success metrics

- Vitest covers nav link, tab switching, missing-account state, transfer-type toggle, both forms, and validation.
- `npm test`, `npm run lint`, and `npm run build` pass in `frontend/`.
- Backend suite unchanged and still green.

## Open questions

- Banking API paths and DTOs for internal vs external transfer (deferred).
- Whether History should show disabled tabs when account is missing (deferred).
