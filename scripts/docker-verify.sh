#!/usr/bin/env bash
# Build and run Docker images from .env, run HTTP + Jest e2e, print SAFE / NOT SAFE.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

BACKEND_DIR="$ROOT/backend"
FRONTEND_DIR="$ROOT/frontend"
BACKEND_IMAGE="banshee-backend"
FRONTEND_IMAGE="banshee-frontend"
BACKEND_CONTAINER="banshee-backend"
FRONTEND_CONTAINER="banshee-frontend"

NO_KILL=false
KEEP=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --no-kill) NO_KILL=true; shift ;;
    --keep) KEEP=true; shift ;;
    -h | --help)
      echo "Usage: $0 [--no-kill] [--keep]"
      echo "  --no-kill  Skip freeing ports derived from .env"
      echo "  --keep     Leave containers running after verify"
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      exit 1
      ;;
  esac
done

STEP=""
FAILED_STEP=""
CONTAINERS_STARTED=false

log() { echo "[docker-verify] $*"; }

print_not_safe() {
  echo ""
  echo "=============================================="
  echo "  Build is NOT SAFE"
  echo "=============================================="
  echo "  Failed at: ${FAILED_STEP:-unknown}"
  echo "  Reason: $*"
  echo "=============================================="
  if [[ "$CONTAINERS_STARTED" == true ]]; then
    echo "  Backend logs (last 20 lines):"
    docker logs --tail 20 "$BACKEND_CONTAINER" 2>&1 || true
    echo "  Frontend logs (last 20 lines):"
    docker logs --tail 20 "$FRONTEND_CONTAINER" 2>&1 || true
  fi
}

fail() {
  FAILED_STEP="${STEP:-unknown}"
  print_not_safe "$*"
  exit 1
}

teardown() {
  if [[ "$KEEP" == true ]]; then
    log "Keeping containers (--keep)."
    return
  fi
  if [[ "$CONTAINERS_STARTED" == true ]]; then
    log "Stopping containers..."
    docker rm -f "$BACKEND_CONTAINER" "$FRONTEND_CONTAINER" 2>/dev/null || true
  fi
}
trap teardown EXIT

read_env_var() {
  local key="$1" default="${2:-}"
  local file val line
  for file in "$3" "$4"; do
    [[ -f "$file" ]] || continue
    line="$(grep -E "^[[:space:]]*${key}=" "$file" 2>/dev/null | tail -1 || true)"
    if [[ -n "$line" ]]; then
      val="${line#*=}"
      val="${val#"${val%%[![:space:]]*}"}"
      val="${val%"${val##*[![:space:]]}"}"
      val="${val%\"}"
      val="${val#\"}"
      val="${val%\'}"
      val="${val#\'}"
      echo "$val"
      return 0
    fi
  done
  echo "$default"
}

port_from_url() {
  local url="$1"
  if [[ "$url" =~ :([0-9]+)(/|$|\?) ]]; then
    echo "${BASH_REMATCH[1]}"
  elif [[ "$url" =~ ^https:// ]]; then
    echo "443"
  elif [[ "$url" =~ ^http:// ]]; then
    echo "80"
  else
    echo ""
  fi
}

collect_ports_to_free() {
  local ports=()
  [[ -n "${PORT:-}" ]] && ports+=("$PORT")
  [[ -n "${FRONTEND_PORT:-}" ]] && ports+=("$FRONTEND_PORT")
  local p
  p="$(port_from_url "${CORS_ORIGIN:-}")"
  [[ -n "$p" ]] && ports+=("$p")
  p="$(port_from_url "${NEXT_PUBLIC_API_URL:-}")"
  [[ -n "$p" ]] && ports+=("$p")
  printf '%s\n' "${ports[@]}" | sort -nu | tr '\n' ' '
}

kill_ports() {
  local ports="$1" p
  for p in $ports; do
    if lsof -ti :"$p" >/dev/null 2>&1; then
      log "Freeing port $p..."
      lsof -ti :"$p" | xargs kill -9 2>/dev/null || true
    fi
  done
}

append_next_public_build_args() {
  local file="$1"
  local line key val
  [[ -f "$file" ]] || return 0
  while IFS= read -r line || [[ -n "$line" ]]; do
    [[ "$line" =~ ^[[:space:]]*# ]] && continue
    [[ "$line" =~ ^[[:space:]]*$ ]] && continue
    [[ "$line" =~ ^NEXT_PUBLIC_ ]] || continue
    key="${line%%=*}"
    key="${key//[[:space:]]/}"
    val="${line#*=}"
    val="${val#"${val%%[![:space:]]*}"}"
    val="${val%"${val##*[![:space:]]}"}"
    val="${val%\"}"
    val="${val#\"}"
    val="${val%\'}"
    val="${val#\'}"
    FE_BUILD_ARGS+=("--build-arg" "${key}=${val}")
  done <"$file"
}

wait_for_health() {
  local url="$1" i
  for i in $(seq 1 30); do
    if curl -sf "$url" >/dev/null 2>&1; then
      return 0
    fi
    sleep 1
  done
  return 1
}

run_http_e2e() {
  local api="$NEXT_PUBLIC_API_URL" fe="$FRONTEND_URL"
  local body code cors tmp
  tmp="$(mktemp -t docker-verify.XXXXXX)"

  log "HTTP e2e: GET $api/health"
  body="$(curl -sf "$api/health")" || fail "health check failed"
  echo "$body" | grep -q '"status":"ok"' || fail "health body missing status ok"

  log "HTTP e2e: POST $api/welcome (valid)"
  code="$(curl -s -o "$tmp" -w '%{http_code}' -X POST "$api/welcome" \
    -H "Content-Type: application/json" \
    -d '{"firstName":"Test","lastName":"User"}')" || fail "welcome POST failed"
  [[ "$code" == "201" ]] || fail "welcome POST expected 201 got $code"
  grep -q 'Welcome, Test User' "$tmp" || fail "welcome message mismatch"

  log "HTTP e2e: POST $api/welcome (empty firstName)"
  code="$(curl -s -o /dev/null -w '%{http_code}' -X POST "$api/welcome" \
    -H "Content-Type: application/json" \
    -d '{"firstName":"","lastName":"Doe"}')" || fail "welcome validation request failed"
  [[ "$code" == "400" ]] || fail "welcome empty firstName expected 400 got $code"

  log "HTTP e2e: CORS preflight on $api/welcome"
  cors="$(curl -s -D - -o /dev/null -X OPTIONS "$api/welcome" \
    -H "Origin: $CORS_ORIGIN" \
    -H "Access-Control-Request-Method: POST")" || fail "CORS preflight failed"
  echo "$cors" | grep -qi "access-control-allow-origin:" || fail "CORS headers missing"
  echo "$cors" | grep -qi "$CORS_ORIGIN" || fail "CORS origin not allowed"

  log "HTTP e2e: GET $fe/"
  code="$(curl -s -o /dev/null -w '%{http_code}' "$fe/")" || fail "frontend GET failed"
  [[ "$code" == "200" ]] || fail "frontend expected 200 got $code"

  rm -f "$tmp"
}

BACKEND_ENV_FILE="$BACKEND_DIR/.env"
BACKEND_EXAMPLE_FILE="$BACKEND_DIR/.env.example"
FRONTEND_ENV_FILE="$FRONTEND_DIR/.env"
FRONTEND_EXAMPLE_FILE="$FRONTEND_DIR/.env.example"

STEP="load env"
PORT="$(read_env_var PORT "3001" "$BACKEND_ENV_FILE" "$BACKEND_EXAMPLE_FILE")"
CORS_ORIGIN="$(read_env_var CORS_ORIGIN "http://localhost:3000" "$BACKEND_ENV_FILE" "$BACKEND_EXAMPLE_FILE")"
NEXT_PUBLIC_API_URL="$(read_env_var NEXT_PUBLIC_API_URL "http://localhost:3001" "$FRONTEND_ENV_FILE" "$FRONTEND_EXAMPLE_FILE")"
FRONTEND_PORT="$(read_env_var FRONTEND_PORT "" "$FRONTEND_ENV_FILE" "$FRONTEND_EXAMPLE_FILE")"

if [[ -z "$FRONTEND_PORT" ]]; then
  FRONTEND_PORT="$(port_from_url "$CORS_ORIGIN")"
fi
[[ -z "$FRONTEND_PORT" ]] && FRONTEND_PORT="3000"

FRONTEND_URL="${CORS_ORIGIN%/}"

PORTS_TO_FREE="$(collect_ports_to_free)"

log "Backend port: $PORT | Frontend port: $FRONTEND_PORT | API: $NEXT_PUBLIC_API_URL"

if [[ "$NO_KILL" != true ]]; then
  STEP="kill ports"
  kill_ports "$PORTS_TO_FREE"
fi

STEP="cleanup old containers"
docker rm -f "$BACKEND_CONTAINER" "$FRONTEND_CONTAINER" 2>/dev/null || true

STEP="docker build backend"
docker build -t "$BACKEND_IMAGE" "$BACKEND_DIR"

STEP="docker build frontend"
FE_BUILD_ARGS=()
if [[ -f "$FRONTEND_ENV_FILE" ]]; then
  append_next_public_build_args "$FRONTEND_ENV_FILE"
elif [[ -f "$FRONTEND_EXAMPLE_FILE" ]]; then
  append_next_public_build_args "$FRONTEND_EXAMPLE_FILE"
fi
if [[ ${#FE_BUILD_ARGS[@]} -eq 0 ]]; then
  FE_BUILD_ARGS=(--build-arg "NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL")
fi
docker build -t "$FRONTEND_IMAGE" "${FE_BUILD_ARGS[@]}" "$FRONTEND_DIR"

STEP="docker run backend"
if [[ ! -f "$BACKEND_ENV_FILE" ]]; then
  fail "Missing $BACKEND_ENV_FILE (required for --env-file)"
fi
docker run -d \
  -p "${PORT}:${PORT}" \
  --env-file "$BACKEND_ENV_FILE" \
  --name "$BACKEND_CONTAINER" \
  "$BACKEND_IMAGE"
CONTAINERS_STARTED=true

STEP="docker run frontend"
docker run -d \
  -p "${FRONTEND_PORT}:3000" \
  --name "$FRONTEND_CONTAINER" \
  "$FRONTEND_IMAGE"

STEP="wait for backend health"
wait_for_health "${NEXT_PUBLIC_API_URL}/health" || fail "backend did not become healthy in 30s"

STEP="docker HTTP e2e"
run_http_e2e

STEP="backend jest e2e"
(
  cd "$BACKEND_DIR"
  npm run test:e2e
) || fail "npm run test:e2e failed"

echo ""
echo "=============================================="
echo "  Build is SAFE"
echo "=============================================="
echo "  - Docker images built: $BACKEND_IMAGE, $FRONTEND_IMAGE"
echo "  - Containers ran on ports $PORT (API), $FRONTEND_PORT (UI)"
echo "  - Docker HTTP e2e passed (health, welcome, CORS, frontend)"
echo "  - Backend Jest e2e passed"
echo "=============================================="
exit 0
