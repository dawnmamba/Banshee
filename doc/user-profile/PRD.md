# PRD: User profile

## Overview

Signed-in users open **Profile** from the header avatar menu and manage account details, personal information, and password on a dedicated `/profile` page.

## Problem statement

Registration only captures basic account fields. Users need a place to view and update those details, store personal/banking-related information, and change their password without re-registering.

## Goals

- Add **Profile** to the avatar dropdown; navigate to `/profile`
- **Account info**: view/edit first name, last name, email; change password (current + new + confirm)
- **Personal info**: account number and NIC (required); address, mobile, landline, secondary email (optional)
- Persist personal fields in PostgreSQL; validate Sri Lanka NIC format
- Protect all profile APIs with JWT

## User stories

1. As a signed-in user, I want a Profile menu item so I can open my profile page.
2. As a user, I want to edit my registration details so my account stays accurate.
3. As a user, I want to change my password in-app with my current password.
4. As a user, I want to save personal and contact details for my account.

## Functional requirements

1. **FR-1** — Avatar dropdown includes **Profile** (navigates to `/profile`) and **Log out**.
2. **FR-2** — `GET /profile` returns full profile for the authenticated user.
3. **FR-3** — `PATCH /profile/account` accepts `{ firstName, lastName, email }`; rejects duplicate email with `409`.
4. **FR-4** — `PATCH /profile/personal` accepts `{ accountNumber, nic, address?, mobile?, landline?, secondaryEmail? }`; `accountNumber` and `nic` required; NIC must match old (9 digits + V/X) or new (12 digit) Sri Lanka format.
5. **FR-5** — `POST /profile/change-password` accepts `{ currentPassword, newPassword, confirmPassword }`; rejects wrong current password with `401`; passwords min 8 chars; confirm must match new.
6. **FR-6** — Profile page has two sections with separate Save actions: Account info | Personal info (contact fields grouped in personal).
7. **FR-7** — `/profile` requires authentication (same gate as other protected routes).
8. **FR-8** — UI uses PrimeReact unstyled + `auth-pt` patterns.

## Non-goals

- Email-based forgot-password flow
- Profile photo upload
- Admin view of other users’ profiles

## Success metrics

- Profile menu → edit account → change password → save personal info works manually
- All backend and frontend tests pass

## Open questions

- None for MVP
