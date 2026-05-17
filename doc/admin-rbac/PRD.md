# PRD: Admin RBAC & route groups

## Overview

The application seeds a default **admin** user at database setup. Self-service **registration** always creates **non-admin** users. Admins and users use separate frontend route groups and cannot access each other's pages (wrong group → **404**). APIs enforce roles via JWT.

## Problem statement

Operators need an initial admin account without using the public registration form, while everyday users must stay in a separate area of the app with no cross-access.

## Goals

- Seed one default admin via TypeORM migration
- Registration assigns `role = user` only
- JWT and `/auth/me` include `role`
- User APIs require `user`; admin APIs require `admin`
- Frontend: user routes (`/`, `/profile`, `/welcome`, `/health`) vs admin routes (`/admin/*`)
- Wrong role on a path → Next.js **not found** (404 UI)

## User stories

1. As an operator, I want a default admin after migrations so I can sign in on first deploy.
2. As a visitor, I want to register knowing I will never receive admin privileges.
3. As an admin, I want to use `/admin` without seeing user banking pages.
4. As a user, I want to use home/profile/welcome/health without accessing admin tools.
5. As either role, if I open the other group's URL I see **page not found**.

## Functional requirements

1. **FR-1** — `users.role` is `admin` or `user` (enum/string); default `user`.
2. **FR-2** — Migration seeds admin `admin@banshee.local` with documented dev password (bcrypt hash in migration).
3. **FR-3** — `POST /auth/register` always creates `role: user`.
4. **FR-4** — Login/register responses and `GET /auth/me` include `role`.
5. **FR-5** — JWT payload includes `role`.
6. **FR-6** — `RolesGuard` on user controllers (`welcome`, `profile`, `account`) requires `user`.
7. **FR-7** — `GET /admin/dashboard` (or equivalent) requires `admin`.
8. **FR-8** — Frontend stores role with session; login redirects admin → `/admin`, user → `/`.
9. **FR-9** — `AuthGate` calls `notFound()` when authenticated user visits the other group's path.
10. **FR-10** — Admin area uses `/admin` layout (placeholder dashboard MVP).

## Non-goals

- Multiple roles or fine-grained permissions
- Admin UI to promote users
- Changing admin password via migration re-run

## Success metrics

- Admin login → `/admin` only; user login → user routes only
- Cross-navigation shows 404
- All tests and builds pass

## Default admin (migration seed)

| Field | Value |
|-------|--------|
| Email | `admin@banshee.local` |
| Password | `BansheeAdmin123!` (document in `.env.example`; change after first login) |
| Name | System / Administrator |

## Open questions

- None for MVP
