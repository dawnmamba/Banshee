# /prd Reference — Buildathon Monorepo

## Stack

| Layer | Path | Port | Notes |
|-------|------|------|-------|
| Backend | `backend/` | 3001 | NestJS, Jest (`npm test`) |
| Frontend | `frontend/` | 3000 | Next.js App Router, Vitest (`npm test`) |
| Docs | `doc/{feature-name}/` | — | `PRD.md`, `IMPLEMENTATION.md` |

Env: `NEXT_PUBLIC_API_URL=http://localhost:3001` in `frontend/.env.local` (document in `.env.example`).

---

## TDD cycle

```
Red    → write test, run, MUST fail
Green  → minimum code to pass
Refactor → clean up, tests stay green
```

### Backend example (service)

**Red** — `backend/src/task-list/task-list.service.spec.ts`:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { TaskListService } from './task-list.service';

describe('TaskListService', () => {
  let service: TaskListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskListService],
    }).compile();
    service = module.get(TaskListService);
  });

  it('create() returns a task with id and title', () => {
    const task = service.create({ title: 'Buy milk' });
    expect(task.id).toBeDefined();
    expect(task.title).toBe('Buy milk');
  });
});
```

Run: `cd backend && npm test -- --testPathPattern=task-list` (expect failure).

**Green** — implement `task-list.service.ts`, then re-run until pass.

### Backend controller spec

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { TaskListController } from './task-list.controller';
import { TaskListService } from './task-list.service';

describe('TaskListController', () => {
  let controller: TaskListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskListController],
      providers: [TaskListService],
    }).compile();
    controller = module.get(TaskListController);
  });

  it('GET /tasks returns 200 and array', () => {
    const result = controller.findAll();
    expect(Array.isArray(result)).toBe(true);
  });
});
```

### E2E (`backend/test/{feature}.e2e-spec.ts`)

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('TaskList (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/tasks (GET)', () => {
    return request(app.getHttpServer()).get('/tasks').expect(200);
  });
});
```

---

## NestJS feature module template

```
backend/src/{feature-name}/
  {feature-name}.module.ts
  {feature-name}.controller.ts
  {feature-name}.service.ts
  {feature-name}.service.spec.ts
  {feature-name}.controller.spec.ts
  dto/
```

**module.ts:**

```typescript
import { Module } from '@nestjs/common';
import { TaskListController } from './task-list.controller';
import { TaskListService } from './task-list.service';

@Module({
  controllers: [TaskListController],
  providers: [TaskListService],
})
export class TaskListModule {}
```

**Register in `app.module.ts`:**

```typescript
import { TaskListModule } from './task-list/task-list.module';

@Module({
  imports: [TaskListModule],
  // ...
})
export class AppModule {}
```

**CORS in `main.ts`:**

```typescript
app.enableCors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000' });
await app.listen(process.env.PORT ?? 3001);
```

---

## Frontend Vitest setup (one-time)

Run from `frontend/` when `npm test` is missing:

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**`frontend/vitest.config.ts`:**

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
```

**`frontend/src/test/setup.ts`:**

```typescript
import '@testing-library/jest-dom/vitest';
```

**`package.json` scripts:**

```json
"test": "vitest",
"test:run": "vitest run"
```

Use `npm test -- --run` for CI/single run.

### Frontend test example

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaskList } from './TaskList';

describe('TaskList', () => {
  it('renders tasks from API', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ id: '1', title: 'Test task' }],
      }),
    );
    render(<TaskList />);
    expect(await screen.findByText('Test task')).toBeInTheDocument();
  });
});
```

### API client (`frontend/src/lib/api.ts`)

```typescript
const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
```

### Page route

`frontend/src/app/{feature-name}/page.tsx` — route `/feature-name`.

---

## Git and PR

| Step | Command |
|------|---------|
| Branch | `git checkout -b feature/{feature-name}` |
| Push | `git push -u origin HEAD` |
| PR | `gh pr create --title "feat: …" --body "…"` |

**Commit format:**

```
feat({feature-name}): add {description}

Implements PRD in doc/{feature-name}/PRD.md.
```

Never stage: `.env`, `node_modules/`, `frontend/.next/`, `backend/dist/`.

---

## Phase 6 check commands

```bash
cd backend && npm test && npm run lint
cd frontend && npm test -- --run && npm run lint && npm run build
```

Fix failures in a loop (max 10 attempts) before Phase 7.
