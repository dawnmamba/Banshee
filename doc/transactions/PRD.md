# Transactions page (tabs shell)

## Overview

Signed-in users get a **Transactions** nav item and a `/transactions` page with two switchable sections: **Fund Transfer** and **Transfer History**. This MVP delivers routing, layout, tab UI, and account-number gating only—no transfer form fields, banking API, or history data yet.

## Problem statement

Users need a dedicated place in the app for money movement and past transfers. The navbar should expose that area next to Home before backend transfer features exist.

## Goals

- Add **Transactions** link after **Home** in the main navbar.
- Provide `/transactions` with two tabs that switch panel content on the same page.
- Require sign-in (existing `AuthGate`).
- If the user has no account number on profile, show guidance to add it in Profile (same pattern as account balance).

## User stories

1. As a signed-in user, I want a Transactions link in the nav so that I can open the transactions area quickly.
2. As a signed-in user, I want to switch between Fund Transfer and Transfer History tabs so that I know where future features will live.
3. As a user without an account number, I want a clear message and link to Profile so that I can set up my account before using transfers.

## Functional requirements

1. **FR-1** — `NAV_ROUTES` includes `{ href: '/transactions', label: 'Transactions' }` immediately after Home.
2. **FR-2** — `/transactions` renders a page titled **Transactions** with zinc layout consistent with Home.
3. **FR-3** — Page shows a tab control with labels **Fund Transfer** and **Transfer History**; selecting a tab shows only that panel’s placeholder content.
4. **FR-4** — Fund Transfer panel placeholder copy indicates content is coming later.
5. **FR-5** — Transfer History panel placeholder copy indicates content is coming later.
6. **FR-6** — Page loads profile via `fetchProfile()`; if `accountNumber` is missing or blank after trim, show missing-account message and link to `/profile` instead of tabs.
7. **FR-7** — When `accountNumber` is present, show the tab control and panels.
8. **FR-8** — Navbar highlights **Transactions** when `pathname === '/transactions'`.

## UI requirements

- PrimeReact unstyled; tab switcher via `SelectButton` styled in `frontend/src/lib/primereact/auth-pt.ts`.
- Page layout matches Home (`max-w-4xl`, zinc/dark tokens).
- Missing-account message uses underline link to Profile (same tone as `AccountBalanceBanner`).
- No native form controls on this page.

## Non-goals

- Fund transfer form fields (to/from account, amount, submit).
- Backend routes or banking API proxy for transfers.
- Transfer history list or persistence.
- E2E against external banking API.

## Success metrics

- Vitest covers nav link, tab switching, and missing-account state.
- `npm test`, `npm run lint`, and `npm run build` pass in `frontend/`.
- Backend suite unchanged and still green.

## Open questions

- Banking API paths and DTOs for fund transfer and history (deferred).
- Whether missing-account state should still show disabled tabs (deferred; MVP hides tabs).
