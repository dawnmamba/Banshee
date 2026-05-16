# Implementation: database-health

## API contract

**GET** `/health`

Response `200` (database reachable):

```json
{
  "status": "ok",
  "timestamp": "2026-05-16T12:00:00.000Z",
  "database": "up"
}
```

Response `200` (database unreachable):

```json
{
  "status": "degraded",
  "timestamp": "2026-05-16T12:00:00.000Z",
  "database": "down"
}
```

## Environment

| Variable     | Example        | Required |
|-------------|----------------|----------|
| `DB_HOST`   | `localhost`    | yes      |
| `DB_PORT`   | `5432`         | yes      |
| `DB_NAME`   | `banshee`      | yes      |
| `DB_USER`   | `postgres`     | yes      |
| `DB_PASSWORD` | `secret`     | yes      |

## Test cases (TDD)

| ID | Requirement | Layer | Test file | Describes |
|----|-------------|-------|-----------|-----------|
| T1 | FR-5 | backend | `health.service.spec.ts` | `check()` returns `ok` + `database: up` when ping succeeds |
| T2 | FR-6 | backend | `health.service.spec.ts` | `check()` returns `degraded` + `database: down` when ping fails |
| T3 | FR-4 | backend | `health.controller.spec.ts` | `GET /health` delegates to service and returns full shape |
| T4 | FR-4–FR-6 | backend | `app.e2e-spec.ts` | `/health` returns 200 with `database` field (mocked DB in test) |
| T5 | FR-2 | backend | `database.config.spec.ts` | `getDatabaseConfig()` maps env to TypeORM options |

## Files

### Backend

- `backend/src/database/database.config.ts`
- `backend/src/database/database.config.spec.ts`
- `backend/src/database/database.module.ts`
- `backend/src/health/health.service.ts`
- `backend/src/health/health.service.spec.ts`
- `backend/src/health/health.controller.ts` (async)
- `backend/src/health/health.controller.spec.ts`
- `backend/src/health/health.module.ts`
- `backend/src/app.module.ts`
- `backend/.env.example`
- `backend/test/app.e2e-spec.ts`
- `scripts/docker-verify.sh` (health assertion includes `database`)

### Dependencies

- `typeorm`, `pg` (Nest `DataSource` provider; `@nestjs/typeorm` when entities are added)

## TDD checklist

- [x] T1 — health service ping success
- [x] T2 — health service ping failure
- [x] T3 — health controller spec
- [x] T4 — e2e health shape
- [x] T5 — database config spec

## Status

All Phase 6 backend checks passed.
