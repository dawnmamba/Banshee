# Nav cleanup — Implementation

## API contract

No backend changes.

## Test cases (TDD)

| ID | Requirement | Layer | Test file | Describes |
|----|-------------|-------|-----------|-----------|
| T1 | NAV_ROUTES has Home + Transactions only | frontend | `nav-routes.test.ts` | Route list excludes Welcome/Health |
| T2 | Navbar renders Home + Transactions only | frontend | `Navbar.test.tsx` | No Welcome/Health links in nav |

## Files

- `doc/nav-cleanup/PRD.md`
- `doc/nav-cleanup/IMPLEMENTATION.md`
- `frontend/src/components/navigation/nav-routes.ts`
- `frontend/src/components/navigation/nav-routes.test.ts` (new)
- `frontend/src/components/navigation/Navbar.test.tsx`

## TDD checklist

- [x] T1 — `nav-routes.test.ts`
- [x] T2 — `Navbar.test.tsx`
