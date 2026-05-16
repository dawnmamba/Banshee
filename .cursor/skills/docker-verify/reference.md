# /docker-verify — Reference

## Project ports (defaults)

| Service | Port | Env |
|---------|------|-----|
| Frontend | 3000 | `CORS_ORIGIN` URL or `FRONTEND_PORT` |
| Backend | 3001 | `PORT` in `backend/.env` |

API URL for browser/build: `NEXT_PUBLIC_API_URL` in `frontend/.env`.

---

## Env evolution — what auto-updates?

| You add | Script change needed? |
|---------|------------------------|
| Backend runtime var (`LOG_LEVEL`, `DATABASE_URL`, …) | **No** — passed via `docker run --env-file backend/.env` |
| New `NEXT_PUBLIC_*` in `frontend/.env` | **No** for build-args loop; **Yes** in `frontend/Dockerfile` if you need a new `ARG`/`ENV` (undeclared build-args are ignored by Docker) |
| New port not in `PORT` / `CORS_ORIGIN` / `NEXT_PUBLIC_API_URL` | **Maybe** — add `FRONTEND_PORT` or extend port discovery once |
| New API route to gate deploy | **Yes** — add HTTP check in `scripts/docker-verify.sh` |
| New `backend/test/*.e2e-spec.ts` | **No** — Jest picks it up automatically |

---

## Env files

| File | Role |
|------|------|
| `backend/.env` | `--env-file` at `docker run`; must include `PORT`, `CORS_ORIGIN` |
| `frontend/.env` | All `NEXT_PUBLIC_*` → `docker build --build-arg` |
| `*.env.example` | Fallback when `.env` missing (except backend run still needs `.env`) |

Fallback defaults: `PORT=3001`, `CORS_ORIGIN=http://localhost:3000`, `NEXT_PUBLIC_API_URL=http://localhost:3001`.

---

## Script: `scripts/docker-verify.sh`

Steps:

1. Load env; derive ports to free
2. Kill processes on those ports (unless `--no-kill`)
3. `docker rm -f banshee-backend banshee-frontend`
4. `docker build` backend → `banshee-backend`
5. `docker build` frontend with all `NEXT_PUBLIC_*` build-args → `banshee-frontend`
6. `docker run` backend with `--env-file backend/.env` and `-p $PORT:$PORT`
7. `docker run` frontend with `-p $FRONTEND_PORT:3000`
8. Wait for `GET $NEXT_PUBLIC_API_URL/health`
9. HTTP e2e (health, welcome valid/invalid, CORS, frontend `/`)
10. `cd backend && npm run test:e2e`
11. Print **Build is SAFE** (exit 0) or **Build is NOT SAFE** (exit 1)
12. Teardown containers (unless `--keep`)

---

## Manual equivalents

```bash
# From repo root after loading the same .env values
cd backend && docker build -t banshee-backend .
cd frontend && docker build -t banshee-frontend \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:3001 .

docker run -d -p 3001:3001 --env-file backend/.env --name banshee-backend banshee-backend
docker run -d -p 3000:3000 --name banshee-frontend banshee-frontend

curl -s http://localhost:3001/health
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/
cd backend && npm run test:e2e
```

---

## Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| `bind: address already in use` | Dev server still on 3000/3001 — re-run without `--no-kill` or kill manually |
| Backend exits immediately | Missing `PORT` or `CORS_ORIGIN` in `backend/.env` |
| CORS preflight fails | `CORS_ORIGIN` does not match browser origin (e.g. wrong frontend port) |
| Frontend build fails on standalone | `output: "standalone"` missing in `frontend/next.config.ts` |
| `NEXT_PUBLIC_API_URL` mismatch | Rebuild frontend image after changing API URL in `.env` |
| Jest e2e fails, Docker HTTP passes | In-process test regression — fix backend code/tests, not Docker |

---

## Adding a new HTTP e2e check

Edit `run_http_e2e()` in `scripts/docker-verify.sh`. Mirror cases in `backend/test/*.e2e-spec.ts` when possible. Document the new check in this file.

---

## Checklist when adding env later

1. Backend-only runtime var → add to `backend/.env` only.
2. New `NEXT_PUBLIC_*` → add to `frontend/.env` + `ARG`/`ENV` in `frontend/Dockerfile` if used at build time.
3. New listen port → set `FRONTEND_PORT` or update URL vars; extend `collect_ports_to_free` if needed.
4. New deploy gate endpoint → add curl in `run_http_e2e()`.
