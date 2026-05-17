# Implementation: admin-rbac

## API contract

### Auth responses (register, login, me)

```json
{
  "user": {
    "id": "uuid",
    "email": "admin@banshee.local",
    "firstName": "System",
    "lastName": "Administrator",
    "role": "admin"
  },
  "accessToken": "eyJ..."
}
```

`role` is `"admin"` | `"user"`.

### GET `/admin/dashboard`

Requires `Authorization: Bearer` with `role: admin`.

Response `200`:

```json
{ "message": "Admin dashboard" }
```

Response `403`: non-admin token.

## Environment

Document seeded admin in `backend/.env.example` (comments only; no secrets).

## Test cases (TDD)

| ID | Requirement | Layer | Test file | Describes |
|----|-------------|-------|-----------|-----------|
| T1 | FR-3 | backend | `user-auth.service.spec.ts` | register sets `role: user` |
| T2 | FR-4, FR-5 | backend | `user-auth.service.spec.ts` | JWT sign includes role; profile returns role |
| T3 | FR-6 | backend | `roles.guard.spec.ts` | allows user, denies admin on user route |
| T4 | FR-7 | backend | `admin.controller.spec.ts` | dashboard requires admin role |
| T5 | FR-8 | frontend | `auth.test.ts` | stores/clears role with token |
| T6 | FR-9 | frontend | `AuthGate.test.tsx` | wrong role → notFound |
| T7 | FR-8 | frontend | `LoginForm.test.tsx` | admin redirects to `/admin` |
| T8 | FR-9 | frontend | `route-groups.test.ts` | path group helpers |
| T9 | BUG-001 | backend | `database-cli.spec.ts` | migration CLI script is Windows-compatible |
| T10 | BUG-001 | backend | `add-user-role-and-seed-admin.migration.spec.ts` | admin seed SQL uses varchar casts |

## Files

### Backend

- `backend/src/user-auth/user-role.ts`
- `backend/src/user-auth/roles.decorator.ts`
- `backend/src/user-auth/roles.guard.ts`
- `backend/src/user-auth/roles.guard.spec.ts`
- `backend/src/user-auth/user.entity.ts` (role column)
- `backend/src/user-auth/user-auth.service.ts`
- `backend/src/user-auth/jwt.strategy.ts`
- `backend/src/database/migrations/1747600000000-AddUserRoleAndSeedAdmin.ts`
- `backend/src/admin/admin.module.ts`
- `backend/src/admin/admin.controller.ts`
- `backend/src/admin/admin.controller.spec.ts`
- `backend/src/welcome-message/welcome-message.controller.ts`
- `backend/src/user-profile/user-profile.controller.ts`
- `backend/src/account-balance/account-balance.controller.ts`
- `backend/src/app.module.ts`
- `backend/.env.example`

### Frontend

- `frontend/src/lib/roles.ts`
- `frontend/src/lib/roles.test.ts`
- `frontend/src/lib/auth.ts`
- `frontend/src/lib/auth.test.ts`
- `frontend/src/lib/api.ts`
- `frontend/src/components/user-auth/AuthGate.tsx`
- `frontend/src/components/user-auth/AuthGate.test.tsx`
- `frontend/src/components/user-auth/LoginForm.tsx`
- `frontend/src/components/user-auth/LoginForm.test.tsx`
- `frontend/src/components/user-auth/RegisterForm.tsx`
- `frontend/src/components/user-auth/AppShell.tsx`
- `frontend/src/app/admin/page.tsx`
- `frontend/src/components/admin/AdminDashboard.tsx`

## TDD checklist

- [x] T1 — register role user
- [x] T2 — JWT and profile role
- [x] T3 — roles guard
- [x] T4 — admin controller
- [x] T5 — auth role storage
- [x] T6 — AuthGate notFound
- [x] T7 — login redirect by role
- [x] T8 — route group helpers
- [x] T9 — migration CLI script (BUG-001)
- [x] T10 — admin seed migration SQL casts (BUG-001)

## Status

All Phase 6 checks passed.
