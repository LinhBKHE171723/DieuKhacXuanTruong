#!/usr/bin/env bash

set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEPLOY_ENV_FILE="${ROOT_DIR}/deploy/.env.production"
COMPOSE_FILE="${ROOT_DIR}/deploy/compose.production.yml"

if [[ ! -f "${DEPLOY_ENV_FILE}" ]]; then
  echo "Missing ${DEPLOY_ENV_FILE}. Copy deploy/.env.production.example and fill production values first."
  exit 1
fi

cd "${ROOT_DIR}"

DEPLOY_BRANCH="$(grep -E '^DEPLOY_BRANCH=' "${DEPLOY_ENV_FILE}" | tail -n 1 | cut -d '=' -f2- || true)"
DEPLOY_BRANCH="${DEPLOY_BRANCH:-main}"

echo "Deploy branch: ${DEPLOY_BRANCH}"
git fetch --all --prune
git checkout "${DEPLOY_BRANCH}"
git pull --ff-only origin "${DEPLOY_BRANCH}"

docker compose --env-file "${DEPLOY_ENV_FILE}" -f "${COMPOSE_FILE}" up -d --build --remove-orphans
docker compose --env-file "${DEPLOY_ENV_FILE}" -f "${COMPOSE_FILE}" ps
