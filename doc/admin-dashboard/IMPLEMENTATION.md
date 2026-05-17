# Implementation: admin-dashboard

## API contract

### GET `/admin/dashboard`

Response `200`:

```json
{
  "message": "Admin dashboard",
  "stats": {
    "totalUsers": 12,
    "adminCount": 2,
    "userCount": 10
  }
}
```

## Test cases (TDD)

| ID | Requirement | Layer | Test file | Describes |
|----|-------------|-------|-----------|-----------|
| T1 | FR-1 | backend | `admin.service.spec.ts` | returns user counts |
| T2 | FR-1 | backend | `admin.controller.spec.ts` | dashboard includes stats |
| T3 | FR-2–FR-6 | frontend | `AdminDashboard.test.tsx` | welcome, stats, links, recent users |
| T4 | FR-4 | frontend | `AdminStatCard.test.tsx` | renders label and value |

## Files

### Backend

- `backend/src/admin/admin.service.ts`
- `backend/src/admin/admin.service.spec.ts`
- `backend/src/admin/admin.controller.ts`
- `backend/src/admin/admin.module.ts`
- `backend/src/admin/admin.controller.spec.ts`

### Frontend

- `frontend/src/lib/api.ts`
- `frontend/src/components/admin/AdminDashboard.tsx`
- `frontend/src/components/admin/AdminDashboard.test.tsx`
- `frontend/src/components/admin/AdminStatCard.tsx`
- `frontend/src/components/admin/AdminStatCard.test.tsx`
- `frontend/src/components/admin/AdminQuickActionCard.tsx`

## TDD checklist

- [x] T1 — admin service stats
- [x] T2 — admin controller dashboard
- [x] T3 — AdminDashboard UI
- [x] T4 — AdminStatCard

## Status

All Phase 6 checks passed.
