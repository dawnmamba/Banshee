# Implementation: user-profile

## API contract

### GET `/profile`

Header: `Authorization: Bearer <token>`

Response `200`:

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "Jane",
  "lastName": "Doe",
  "accountNumber": "1234567890",
  "nic": "123456789V",
  "address": "Colombo",
  "mobile": "+94771234567",
  "landline": "0112345678",
  "secondaryEmail": "alt@example.com"
}
```

Nullable fields may be `null` when unset.

### PATCH `/profile/account`

Request: `{ "firstName", "lastName", "email" }`

Response `200`: same shape as GET.

Response `409`: email already in use.

### PATCH `/profile/personal`

Request: `{ "accountNumber", "nic", "address?", "mobile?", "landline?", "secondaryEmail?" }`

Response `200`: full profile.

Response `400`: validation (invalid NIC, missing required fields).

### POST `/profile/change-password`

Request: `{ "currentPassword", "newPassword", "confirmPassword" }`

Response `200`: `{ "ok": true }`

Response `401`: current password incorrect.

## Test cases (TDD)

| ID | Requirement | Layer | Test file | Describes |
|----|-------------|-------|-----------|-----------|
| T1 | FR-2 | backend | `user-profile.service.spec.ts` | `getProfile()` returns full profile |
| T2 | FR-3 | backend | `user-profile.service.spec.ts` | `updateAccount()` updates fields |
| T3 | FR-3 | backend | `user-profile.service.spec.ts` | `updateAccount()` conflict on email |
| T4 | FR-4 | backend | `user-profile.service.spec.ts` | `updatePersonal()` saves valid data |
| T5 | FR-4 | backend | `user-profile.service.spec.ts` | `updatePersonal()` rejects invalid NIC |
| T6 | FR-5 | backend | `user-profile.service.spec.ts` | `changePassword()` success |
| T7 | FR-5 | backend | `user-profile.service.spec.ts` | `changePassword()` wrong current password |
| T8 | FR-2–5 | backend | `user-profile.e2e-spec.ts` | profile routes with JWT |
| T9 | FR-1 | frontend | `UserProfileMenu.test.tsx` | Profile link navigates to `/profile` |
| T10 | FR-6 | frontend | `AccountInfoSection.test.tsx` | loads and saves account fields |
| T11 | FR-6, FR-5 | frontend | `ChangePasswordForm.test.tsx` | submits password change |
| T12 | FR-6, FR-4 | frontend | `PersonalInfoSection.test.tsx` | saves personal fields; NIC validation message |

## Files

### Backend

- `backend/src/database/migrations/1747500000000-AddUserProfileColumns.ts`
- `backend/src/user-auth/user.entity.ts` (extend columns)
- `backend/src/user-profile/*`
- `backend/src/app.module.ts`
- `backend/src/main.ts` (CORS PATCH)
- `backend/test/user-profile.e2e-spec.ts`

### Frontend

- `frontend/src/components/user-profile-menu/UserProfileMenu.tsx`
- `frontend/src/components/user-profile/*`
- `frontend/src/app/profile/page.tsx`
- `frontend/src/lib/api.ts`
- `frontend/src/components/user-auth/AppShell.tsx`

## TDD checklist

- [x] T1 — getProfile full
- [x] T2 — updateAccount
- [x] T3 — updateAccount conflict
- [x] T4 — updatePersonal
- [x] T5 — invalid NIC
- [x] T6 — changePassword success
- [x] T7 — changePassword unauthorized
- [x] T8 — e2e
- [x] T9 — UserProfileMenu
- [x] T10 — AccountInfoSection
- [x] T11 — ChangePasswordForm
- [x] T12 — PersonalInfoSection

## Status

All Phase 6 checks passed.
