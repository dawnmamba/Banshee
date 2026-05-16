# Implementation: user-auth

## API contract

### POST `/auth/register`

Request:

```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "user@example.com",
  "password": "secret123",
  "confirmPassword": "secret123"
}
```

Response `201`:

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "Jane",
    "lastName": "Doe"
  },
  "accessToken": "eyJ..."
}
```

Response `400`: validation failure (e.g. passwords do not match, missing names).

Response `409`: email already registered.

### POST `/auth/login`

Request: `{ "email", "password" }`

Response `200`: same shape as register.

Response `401`: invalid credentials.

### POST `/auth/logout`

Response `200`: `{ "ok": true }`

No auth required (stateless JWT; client clears token).

### GET `/auth/me`

Header: `Authorization: Bearer <token>`

Response `200`: `{ "id", "email", "firstName", "lastName" }`

Response `401`: missing or invalid token.

## Environment

| Variable | Example | Required |
|----------|---------|----------|
| `JWT_SECRET` | `change-me-in-production` | yes |
| `JWT_EXPIRES_IN` | `1h` | yes |
| `DB_*` | (existing) | yes |

## Test cases (TDD)

| ID | Requirement | Layer | Test file | Describes |
|----|-------------|-------|-----------|-----------|
| T1 | FR-1 | backend | `user-auth.service.spec.ts` | `register()` creates user and returns token |
| T2 | FR-2 | backend | `user-auth.service.spec.ts` | `register()` throws conflict for duplicate email |
| T3 | FR-3, FR-4 | backend | `user-auth.service.spec.ts` | `login()` success and unauthorized |
| T4 | FR-6 | backend | `user-auth.service.spec.ts` | `logout()` returns `{ ok: true }` |
| T5 | FR-5 | backend | `user-auth.service.spec.ts` | `getProfile()` returns user by id |
| T6 | FR-1–FR-4 | backend | `user-auth.controller.spec.ts` | register/login delegate to service |
| T7 | FR-8 | backend | `welcome-message.controller.spec.ts` | welcome route uses JWT guard |
| T8 | FR-1 | backend | `user-auth.e2e-spec.ts` | register + me with token |
| T9 | FR-9 | frontend | `auth.test.ts` | token get/set/clear in localStorage |
| T10 | FR-10–FR-12 | frontend | `AuthGate.test.tsx` | redirect when unauthenticated |
| T11 | FR-3 | frontend | `LoginForm.test.tsx` | submits login and stores token |
| T12 | FR-6 | frontend | `LogoutButton.test.tsx` | clears token and navigates to login |
| T13 | BUG-001 | backend | `jwt-module.options.spec.ts` | `JWT_EXPIRES_IN` typed for JwtModule `expiresIn` |
| T14 | FR-1 | backend | `user-auth.service.spec.ts` | `register()` persists firstName and lastName |
| T15 | FR-1 | backend | `register.dto.spec.ts` | rejects mismatched confirmPassword |
| T16 | FR-1, FR-13 | frontend | `RegisterForm.test.tsx` | renders all register fields |
| T17 | FR-13 | frontend | `RegisterForm.test.tsx` | blocks submit when passwords mismatch |
| T18 | FR-1 | frontend | `RegisterForm.test.tsx` | submits register with names and stores token |

## Files

### Backend

- `backend/src/user-auth/user.entity.ts`
- `backend/src/database/migrations/*CreateUsersTable.ts`
- `backend/src/database/migrations/*AddUserNameColumns.ts`
- `backend/src/user-auth/dto/match.decorator.ts`
- `backend/src/user-auth/dto/register.dto.spec.ts`
- `backend/src/user-auth/user-auth.module.ts`
- `backend/src/user-auth/jwt-module.options.ts`
- `backend/src/user-auth/jwt-module.options.spec.ts`
- `backend/src/user-auth/user-auth.service.ts`
- `backend/src/user-auth/user-auth.service.spec.ts`
- `backend/src/user-auth/user-auth.controller.ts`
- `backend/src/user-auth/user-auth.controller.spec.ts`
- `backend/src/user-auth/dto/register.dto.ts`
- `backend/src/user-auth/dto/login.dto.ts`
- `backend/src/user-auth/jwt.strategy.ts`
- `backend/src/user-auth/jwt-auth.guard.ts`
- `backend/src/app.module.ts`
- `backend/src/main.ts` (ValidationPipe)
- `backend/src/welcome-message/welcome-message.controller.ts` (guard)
- `backend/.env.example`
- `backend/test/user-auth.e2e-spec.ts`

### Frontend

- `frontend/src/lib/auth.ts`
- `frontend/src/lib/auth.test.ts`
- `frontend/src/lib/api.ts`
- `frontend/src/components/user-auth/AuthProvider.tsx`
- `frontend/src/components/user-auth/AuthGate.tsx`
- `frontend/src/components/user-auth/AuthGate.test.tsx`
- `frontend/src/components/user-auth/LoginForm.tsx`
- `frontend/src/components/user-auth/LoginForm.test.tsx`
- `frontend/src/components/user-auth/RegisterForm.tsx`
- `frontend/src/components/user-auth/RegisterForm.test.tsx`
- `frontend/src/components/user-auth/LogoutButton.tsx`
- `frontend/src/components/user-auth/LogoutButton.test.tsx`
- `frontend/src/app/login/page.tsx`
- `frontend/src/app/register/page.tsx`
- `frontend/src/app/layout.tsx`

## TDD checklist

- [x] T1 — register success
- [x] T2 — register duplicate
- [x] T3 — login success / failure
- [x] T4 — logout
- [x] T5 — getProfile
- [x] T6 — controller spec
- [x] T7 — welcome guarded
- [x] T8 — auth e2e
- [x] T9 — auth lib
- [x] T10 — AuthGate
- [x] T11 — LoginForm
- [x] T12 — LogoutButton
- [x] T13 — JWT expiresIn typing (BUG-001)
- [x] T14 — register persists names
- [x] T15 — confirmPassword validation
- [x] T16 — register form fields
- [x] T17 — password mismatch client-side
- [x] T18 — register submit flow

## Status

All Phase 6 checks passed (extended register fields).
