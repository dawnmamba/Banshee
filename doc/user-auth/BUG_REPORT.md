# Bug reports: user-auth

## BUG-001

| Field | Value |
|-------|-------|
| **Status** | fixed |
| **Severity** | high |
| **Date opened** | 2026-05-17 |
| **PRD** | `doc/user-auth/PRD.md` |
| **Linked requirements** | FR-1–FR-6 (JWT signing required for auth) |

### Summary

Backend fails to compile on `npm run start:dev` because `JWT_EXPIRES_IN` from env is typed as `string`, but `@nestjs/jwt` expects `expiresIn` to be `number | StringValue`.

### Environment

- Backend: `http://localhost:3001`
- `JWT_EXPIRES_IN=1h` (see `backend/.env.example`)

### Steps to reproduce

1. `cd backend && npm run start:dev`
2. Observe TypeScript error in `user-auth.module.ts` line 21.

### Expected vs actual

| | Behavior |
|---|----------|
| **Expected** | Backend compiles and starts with `JWT_EXPIRES_IN` from env |
| **Actual** | `TS2322: Type 'string' is not assignable to type 'number \| StringValue \| undefined'` |

### Root cause

`@types/jsonwebtoken` (via `@nestjs/jwt`) types `expiresIn` as `StringValue` from the `ms` package (template literal like `` `${number}h` ``), not a plain `string`. `requireEnv()` returns `string`.

### Regression test

| ID | Test file | Test name |
|----|-----------|-----------|
| T13 | `jwt-module.options.spec.ts` | `reads JWT_EXPIRES_IN as ms-compatible expiresIn` |

### Fixes applied

#### Fix attempt 1 (2026-05-17)

- **What changed:** Extracted `buildJwtModuleOptions()` with `as StringValue` cast; wired `JwtModule.registerAsync` so env is read at factory time.
- **Files:** `backend/src/user-auth/jwt-module.options.ts`, `jwt-module.options.spec.ts`, `user-auth.module.ts`
- **Why:** Satisfies `SignOptions.expiresIn` typing while keeping env-driven config.

### Verification

- [x] `cd backend && npm test -- --testPathPatterns=user-auth`
- [x] `cd backend && npm run build`
- [x] `cd backend && npm run lint`
- [x] Manual: `npm run start:dev` starts without TS errors
