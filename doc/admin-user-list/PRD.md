# PRD: Admin user list

## Overview

Admins can view all registered users on `/admin/users`, search by name or email, and change a user’s role between `user` and `admin`. The seeded system admin and the signed-in admin’s own account are protected from harmful role changes.

## Problem statement

Operators need a simple way to see who is registered and promote or demote users without database access or the public registration flow.

## Goals

- List users with profile summary fields (no passwords)
- Search by name or email
- Change role via admin-only API
- Enforce safety rules for seed admin and self
- Match Banshee admin UI (zinc, PrimeReact unstyled)

## User stories

1. As an admin, I want to see all users in a table so I can review accounts.
2. As an admin, I want to search users so I can find someone quickly.
3. As an admin, I want to promote a user to admin or demote to user when appropriate.
4. As an admin, I want the system to block demoting the seeded admin or changing my own role by mistake.

## Functional requirements

1. **FR-1** — `GET /admin/users?search=` returns users (admin JWT required). Optional `search` matches first name, last name, or email (case-insensitive).
2. **FR-2** — Each list item includes: `id`, `firstName`, `lastName`, `email`, `role`, `accountNumber`, `nic`, `mobile`, `createdAt`. No `passwordHash`.
3. **FR-3** — `PATCH /admin/users/:id/role` body `{ "role": "admin" | "user" }` updates role (admin JWT required).
4. **FR-4** — Cannot change role of `admin@banshee.local` (seed admin).
5. **FR-5** — Cannot change role of the authenticated admin (self).
6. **FR-6** — Non-admin tokens receive 403 on admin user endpoints.
7. **FR-7** — Frontend page `/admin/users` shows searchable table and role controls.
8. **FR-8** — Admin header/nav links to Dashboard (`/admin`) and Users (`/admin/users`).
9. **FR-9** — Role change shows confirmation before API call; success/error feedback inline.

## UI requirements

- PrimeReact unstyled: `InputText` for search, `Button` for actions, `Message` for errors
- Table: semantic HTML with Tailwind consistent with admin dashboard (zinc borders, dark mode)
- Extend `auth-pt.ts` only if new PrimeReact components need pass-through

## Non-goals

- Create or delete users
- Edit profile fields from admin UI
- Pagination, sort, or filter-by-role (search only for MVP)
- Audit log of role changes

## Success metrics

- Admin can list, search, and change roles; protections return clear errors
- User role cannot access `/admin/users` (404 via AuthGate)
- All tests and builds pass

## Open questions

- None for MVP
