# PRD: User authentication

## Overview

Visitors register with first name, last name, email, and password (with confirmation), log in to receive a JWT access token, and can only use the application when authenticated. Logout clears the client session.

## Problem statement

The app needs secure account creation and sign-in so that features and APIs are available only to authenticated users.

## Goals

- Register and store users in PostgreSQL with hashed passwords and profile names
- Issue JWT access tokens on successful login or registration
- Protect backend routes and the frontend app behind authentication
- Support logout (clear session on the client; stateless server acknowledgment)

## User stories

1. As a new user, I want to register with my first name, last name, email, and password (confirming the password) so that I can access the app.
2. As a registered user, I want to log in so that I receive a session token.
3. As a signed-in user, I want to use the app without re-entering credentials until the token expires.
4. As a signed-in user, I want to log out so that my session ends on this device.
5. As a visitor without a token, I want to be redirected to login instead of seeing protected pages.

## Functional requirements

1. **FR-1** — `POST /auth/register` accepts `{ firstName, lastName, email, password, confirmPassword }`, validates that `password` matches `confirmPassword`, creates a user, returns `{ user: { id, email, firstName, lastName }, accessToken }`.
2. **FR-2** — Registration rejects duplicate emails with `409 Conflict`.
3. **FR-3** — `POST /auth/login` accepts `{ email, password }`, returns `{ user, accessToken }` for valid credentials.
4. **FR-4** — Login rejects invalid credentials with `401 Unauthorized`.
5. **FR-5** — `GET /auth/me` returns `{ id, email, firstName, lastName }` when a valid `Authorization: Bearer` token is sent.
6. **FR-6** — `POST /auth/logout` returns `{ ok: true }` (client removes token from localStorage).
7. **FR-7** — Passwords are stored hashed (bcrypt); never returned in API responses.
8. **FR-8** — Protected API routes (e.g. `POST /welcome`) require a valid JWT.
9. **FR-9** — Frontend stores the access token in `localStorage` and sends it on API requests.
10. **FR-10** — Unauthenticated users may only access `/login` and `/register`; other routes redirect to `/login`.
11. **FR-11** — Authenticated users on `/login` or `/register` redirect to the home page.
12. **FR-12** — UI provides login, register, and logout actions.
13. **FR-13** — Register form collects first name, last name, email, password, and confirm password; shows an error when passwords do not match before calling the API.

## Non-goals

- Refresh tokens or silent renewal
- Email verification, password reset, OAuth
- Role-based access control
- Server-side token revocation / blocklist

## Success metrics

- Register → login → access protected page → logout flow works manually
- All backend and frontend tests pass

## Open questions

- Token expiry default: `1h` via `JWT_EXPIRES_IN`
