# Nav cleanup — PRD

## Overview

Logged-in regular users see a main navbar with demo links (Welcome, Health) that are not part of the banking product. This feature removes those links from the navbar while keeping Home and Transactions.

## Problem statement

The authenticated user navbar exposes `/welcome` and `/health`, which are development/demo surfaces and clutter the primary navigation.

## Goals

- Show only **Home** and **Transactions** in the main navbar for logged-in non-admin users.
- Leave `/welcome` and `/health` reachable by direct URL (no auth path changes).

## User stories

1. As a **logged-in user**, I want a focused navbar so that I can reach banking features without demo links.
2. As a **developer**, I can still open `/welcome` or `/health` directly when needed.

## Functional requirements

1. `NAV_ROUTES` includes only `/` (Home) and `/transactions` (Transactions).
2. The `Navbar` component renders links from `NAV_ROUTES` only.
3. `USER_PATHS` in `roles.ts` is unchanged (`/welcome`, `/health` remain allowed for users).
4. Admin navigation is unchanged (`AdminHeader`).

## Non-goals

- Removing or redirecting `/welcome` and `/health` pages.
- Changing admin or public (login/register) shells.
- Adding Profile to the center nav (profile stays in avatar menu).

## Success metrics

- Navbar tests assert exactly Home + Transactions links.
- Manual: logged-in user navbar shows two links only.

## Open questions

- None for MVP.
