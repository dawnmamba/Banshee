# PRD: Database connection and health check

## Overview

Connect the NestJS backend to PostgreSQL via TypeORM and extend `GET /health` to report database connectivity. The API stays available when the database is unreachable; health reflects degraded state instead of failing the process.

## Problem statement

The backend has no database integration. Operators and deploy scripts cannot tell whether PostgreSQL is reachable. A single health endpoint should report both application and database status.

## Goals

- Configure PostgreSQL connection from environment variables (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`).
- Register TypeORM at application bootstrap (no entities or migrations in this slice).
- Extend `GET /health` with a `database` field (`up` | `down`).
- Return HTTP 200 with `status: ok` when the database responds; HTTP 200 with `status: degraded` when it does not.
- Cover behavior with unit tests (TDD) and update e2e expectations.

## User stories

1. **As a** developer, **I want** the backend to connect to PostgreSQL using `.env` credentials **so that** future features can use TypeORM.
2. **As an** operator, **I want** `GET /health` to include database status **so that** I can monitor connectivity without a separate tool.
3. **As a** deploy script, **I want** the app to start even if the database is temporarily down **so that** health can report `degraded` instead of crashing the process.

## Functional requirements

1. **FR-1** — Read `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD` from the environment (required at startup, same pattern as `PORT` / `CORS_ORIGIN`).
2. **FR-2** — Register `TypeOrmModule` for PostgreSQL with no entities and `synchronize: false`.
3. **FR-3** — If the database is unreachable at startup, the application still boots; connection is retried or checked on health requests.
4. **FR-4** — `GET /health` returns JSON: `status`, `timestamp`, and `database` (`up` | `down`).
5. **FR-5** — When `SELECT 1` (or equivalent ping) succeeds, `status` is `ok` and `database` is `up`.
6. **FR-6** — When the ping fails, HTTP status remains **200**, `status` is `degraded`, and `database` is `down`.
7. **FR-7** — Document new variables in `backend/.env.example` (no secrets committed).

## Non-goals

- Database migrations, schemas, or entities
- Frontend UI for health
- Docker Compose for PostgreSQL
- Changing welcome-message persistence
- Auth or connection pooling tuning

## Success metrics

- `cd backend && npm test && npm run lint` passes
- `cd backend && npm run test:e2e` passes (with mocked or optional DB in test module)
- Manual: with Postgres running, `/health` shows `ok` + `database: up`; with DB stopped, `degraded` + `database: down`

## Open questions

- None for MVP; discrete env vars chosen over `DATABASE_URL` per user preference.
