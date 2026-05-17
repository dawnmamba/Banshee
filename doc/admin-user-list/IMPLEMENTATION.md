# Implementation: admin-user-list

## API contract

### GET `/admin/users?search={optional}`

Requires `Authorization: Bearer` with `role: admin`.

Response `200`:

```json
{
  "users": [
    {
      "id": "uuid",
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane@example.com",
      "role": "user",
      "accountNumber": "ACC123",
      "nic": "123456789V",
      "mobile": "0771234567",
      "createdAt": "2026-05-17T00:00:00.000Z"
    }
  ]
}
```

### PATCH `/admin/users/:id/role`

Body:

```json
{ "role": "admin" }
```

Response `200`: single user object (same shape as list item).

Errors:

- `403` — not admin, seed admin protected, or self-change blocked
- `404` — user id not found
- `400` — invalid role

## Test cases (TDD)

| ID | Requirement | Layer | Test file | Describes |
|----|-------------|-------|-----------|-----------|
| T1 | FR-1, FR-2 | backend | `admin-user-list.service.spec.ts` | list users, search filter |
| T2 | FR-3–FR-5 | backend | `admin-user-list.service.spec.ts` | update role, protections |
| T3 | FR-1, FR-3 | backend | `admin-user-list.controller.spec.ts` | routes delegate to service |
| T4 | FR-7–FR-9 | frontend | `AdminUserList.test.tsx` | table, search, role change |
| T5 | FR-8 | frontend | `AdminHeader.test.tsx` | nav links to users |

## Files

### Backend

- `backend/src/admin-user-list/admin-user-list.module.ts`
- `backend/src/admin-user-list/admin-user-list.service.ts`
- `backend/src/admin-user-list/admin-user-list.service.spec.ts`
- `backend/src/admin-user-list/admin-user-list.controller.ts`
- `backend/src/admin-user-list/admin-user-list.controller.spec.ts`
- `backend/src/admin-user-list/admin-user-list.constants.ts`
- `backend/src/admin-user-list/dto/list-users-query.dto.ts`
- `backend/src/admin-user-list/dto/update-user-role.dto.ts`
- `backend/src/app.module.ts`

### Frontend

- `frontend/src/lib/api.ts`
- `frontend/src/app/admin/layout.tsx`
- `frontend/src/app/admin/users/page.tsx`
- `frontend/src/components/admin/AdminHeader.tsx`
- `frontend/src/components/admin/AdminHeader.test.tsx`
- `frontend/src/components/admin/AdminUserList.tsx`
- `frontend/src/components/admin/AdminUserList.test.tsx`

## TDD checklist

- [x] T1 — list and search
- [x] T2 — role update and protections
- [x] T3 — controller
- [x] T4 — AdminUserList UI
- [x] T5 — AdminHeader nav

## Status

All Phase 6 checks passed.
