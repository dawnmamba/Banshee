# Implementation: user-profile-menu

## API contract

Uses existing endpoint only:

### GET `/auth/me`

Header: `Authorization: Bearer <token>`

Response `200`: `{ "id", "email", "firstName", "lastName" }`

No new backend routes in this feature.

## Theme storage (client)

| Key | Value |
|-----|--------|
| `banshee-theme` | `"system"` \| `"light"` \| `"dark"` |

Applied via `class="dark"` on `<html>` for dark mode; system follows `prefers-color-scheme`.

## Test cases (TDD)

| ID | Requirement | Layer | Test file | Describes |
|----|-------------|-------|-----------|-----------|
| T1 | FR-6 | frontend | `theme.test.ts` | get/set theme preference in localStorage |
| T2 | FR-6 | frontend | `ThemeProvider.test.tsx` | applies dark class for dark theme |
| T3 | FR-4, FR-7 | frontend | `UserProfileMenu.test.tsx` | shows name, email, logout; fetches `/auth/me` |
| T4 | FR-1, FR-8 | frontend | `AppShell.test.tsx` | profile on left; no standalone logout button |

## File list

### Frontend

- `frontend/src/lib/theme.ts`
- `frontend/src/lib/theme.test.ts`
- `frontend/src/components/user-profile-menu/ThemeProvider.tsx`
- `frontend/src/components/user-profile-menu/ThemeProvider.test.tsx`
- `frontend/src/components/user-profile-menu/UserProfileMenu.tsx`
- `frontend/src/components/user-profile-menu/UserProfileMenu.test.tsx`
- `frontend/src/components/user-auth/AppShell.tsx` (update)
- `frontend/src/components/user-auth/AppShell.test.tsx`
- `frontend/src/app/layout.tsx` (PrimeReact + ThemeProvider)
- `frontend/src/app/globals.css` (class-based dark mode)
- `frontend/package.json` (primereact, primeicons)

## TDD checklist

- [x] T1 — `theme.test.ts`
- [x] T2 — `ThemeProvider.test.tsx`
- [x] T3 — `UserProfileMenu.test.tsx`
- [x] T4 — `AppShell.test.tsx`

## Dependencies

```bash
cd frontend && npm install primereact primeicons
```

PrimeReact CSS imported in `layout.tsx` or a dedicated provider module.
