# Implementation: welcome-message

## API contract

**POST** `/welcome`

Request:
```json
{ "firstName": "Jane", "lastName": "Doe" }
```

Response `200`:
```json
{ "message": "Welcome, Jane Doe" }
```

Response `400` — empty or missing names after trim.

## Test cases (TDD)

| ID | Requirement | Layer | Test file | Describes |
|----|-------------|-------|-----------|-----------|
| T1 | FR-4 | backend | `welcome-message.service.spec.ts` | `buildMessage()` returns full welcome string |
| T2 | FR-2, FR-4 | backend | `welcome-message.controller.spec.ts` | `createWelcome()` returns message DTO |
| T3 | FR-2–FR-4 | backend | `welcome-message.e2e-spec.ts` | POST `/welcome` returns 200 + message |
| T4 | FR-1, FR-5 | frontend | `WelcomeForm.test.tsx` | submit shows API welcome message |

## Files

### Backend
- `backend/src/welcome-message/welcome-message.module.ts`
- `backend/src/welcome-message/welcome-message.service.ts`
- `backend/src/welcome-message/welcome-message.controller.ts`
- `backend/src/welcome-message/dto/welcome-request.dto.ts`
- `backend/src/welcome-message/dto/welcome-response.dto.ts`
- `backend/test/welcome-message.e2e-spec.ts`
- `backend/src/app.module.ts` (register module)
- `backend/src/main.ts` (CORS)

### Frontend
- `frontend/src/lib/api.ts`
- `frontend/src/components/welcome-message/WelcomeForm.tsx`
- `frontend/src/components/welcome-message/WelcomeForm.test.tsx`
- `frontend/src/app/welcome/page.tsx`
- Vitest config (one-time)

## TDD checklist

- [x] T1 — service spec (red → green)
- [x] T2 — controller spec (red → green)
- [x] T3 — e2e (red → green)
- [x] T4 — WelcomeForm test (red → green)

## Status

All Phase 6 checks passed. PR skipped per user request.
