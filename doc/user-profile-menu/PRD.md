# PRD: User profile menu

## Overview

Add a top-left user profile control on the authenticated app header. Clicking it opens a PrimeReact dropdown showing the logged-in user's identity, a theme switcher (system / light / dark), and log out at the bottom.

## Problem statement

The header only exposes a standalone "Log out" button on the right. Users cannot see who is signed in, change appearance, or access account actions from a cohesive profile menu.

## Goals

- Profile trigger in the **top-left** of the nav header (round avatar with user icon).
- Dropdown shows **full name**, **email**, **theme** options, and **log out** at the bottom.
- Use **PrimeReact** components where practical.
- Persist theme in **localStorage** (no backend API in this slice).

## User stories

1. As a signed-in user, I want a profile button in the top-left so I can access account-related actions quickly.
2. As a signed-in user, I want to see my name and email in the menu so I know which account is active.
3. As a signed-in user, I want to choose system, light, or dark theme so the app matches my preference.
4. As a signed-in user, I want log out at the bottom of the profile menu so it is easy to find without cluttering the header.

## Functional requirements

1. **FR-1** — On protected routes, the header shows a profile control aligned to the **left**.
2. **FR-2** — The profile control is a round **Avatar** with a generic user icon (PrimeIcons).
3. **FR-3** — Clicking the profile control opens a **dropdown** (PrimeReact OverlayPanel or Menu popup).
4. **FR-4** — The dropdown displays the user's **full name** (`firstName` + `lastName`) and **email** from `GET /auth/me`.
5. **FR-5** — The dropdown includes a theme control with options: **System**, **Light**, **Dark**.
6. **FR-6** — Theme preference is stored in **localStorage** and applied to the document (`dark` class + `prefers-color-scheme` for system).
7. **FR-7** — **Log out** appears at the **bottom** of the dropdown and performs the existing logout flow.
8. **FR-8** — The standalone header **Log out** button is removed.

## Non-goals

- Profile photo upload
- Backend theme preference API
- Account settings / password change pages
- Full-app PrimeReact redesign

## Success metrics

- All frontend unit tests pass.
- `npm run build` succeeds.
- Manual smoke: profile menu shows correct user, theme persists across refresh, logout works.

## Open questions

- None for MVP (backend theme API deferred).
