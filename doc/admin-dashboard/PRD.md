# PRD: Admin dashboard UI

## Overview

Replace the placeholder `/admin` dashboard with a polished operator home: personalized welcome, live user metrics, quick actions, and a recent-users preview. Keeps the existing zinc dark theme with a more professional, modern layout.

## Problem statement

The current admin landing page is a single centered card with placeholder copy. Operators need an at-a-glance control panel that matches the quality of the user banking home and ties into user management.

## Goals

- Live stats from the database (total users, admins, standard users)
- Savvy dark-first layout with stat cards, quick actions, and recent accounts
- Reuse existing admin APIs where possible; minimal new backend surface
- PrimeReact + Tailwind consistent with Banshee admin area

## User stories

1. As an admin, I want to see key user counts when I land on `/admin`.
2. As an admin, I want a clear path to manage users without hunting the nav.
3. As an admin, I want to see who registered recently.
4. As an admin, I want a welcome that uses my name.

## Functional requirements

1. **FR-1** — `GET /admin/dashboard` returns `stats: { totalUsers, adminCount, userCount }`.
2. **FR-2** — Dashboard shows personalized welcome via `GET /auth/me`.
3. **FR-3** — Three stat cards display FR-1 metrics with icons and labels.
4. **FR-4** — Quick-action card links to `/admin/users`.
5. **FR-5** — Recent users section shows up to 5 users (newest first) from `GET /admin/users`.
6. **FR-6** — Layout uses full-width dark canvas and zinc card surfaces (dark mode primary).

## UI requirements

- Match `AdminUserList` container (`max-w-6xl`, zinc borders, dark backgrounds)
- PrimeIcons for stat/action iconography; `Button` or `Link` for actions
- No new native form controls

## Non-goals

- Charts, analytics history, or exports
- Editing users from the dashboard
- Sidebar navigation (future)

## Success metrics

- Dashboard feels cohesive with `/admin/users`
- Stats match database counts
- All tests and builds pass

## Open questions

- None for MVP
