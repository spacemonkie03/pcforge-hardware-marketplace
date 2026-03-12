#!/usr/bin/env bash
set -Eeuo pipefail

deploy_path="${1:-}"
deploy_ref="${2:-unknown}"

if [[ -z "${deploy_path}" ]]; then
  echo "Usage: bash scripts/deploy.sh <deploy-path> [git-sha]" >&2
  exit 1
fi

if [[ ! -d "${deploy_path}" ]]; then
  echo "Deployment path does not exist: ${deploy_path}" >&2
  exit 1
fi

log() {
  printf '[%s] %s\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" "$*"
}

cd "${deploy_path}"

compose_args=(-f docker-compose.yml)
if [[ -f docker-compose.prod.yml ]]; then
  compose_args+=(-f docker-compose.prod.yml)
  log "Using docker-compose.prod.yml override."
fi

on_error() {
  local exit_code=$?
  log "Deployment failed. Current service state:"
  docker compose "${compose_args[@]}" ps || true
  log "Recent logs:"
  docker compose "${compose_args[@]}" logs --tail=100 || true
  exit "${exit_code}"
}

trap on_error ERR

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required on the deployment host." >&2
  exit 1
fi

if [[ ! -f docker-compose.yml ]]; then
  echo "docker-compose.yml not found in ${deploy_path}" >&2
  exit 1
fi

log "Deploying commit ${deploy_ref}"
printf 'commit=%s\ndeployed_at=%s\n' \
  "${deploy_ref}" \
  "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" > .deploy-release

log "Validating compose configuration"
docker compose "${compose_args[@]}" config -q

log "Pulling base service images"
docker compose "${compose_args[@]}" pull postgres redis elasticsearch

log "Building application services"
docker compose "${compose_args[@]}" build --pull backend frontend nginx

log "Restarting application"
docker compose "${compose_args[@]}" up -d --remove-orphans

log "Deployment completed"
docker compose "${compose_args[@]}" ps
