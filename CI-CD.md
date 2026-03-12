# CI/CD

## Repository analysis

- Package manager: `npm`
- Applications:
  - `backend/`: NestJS API
  - `frontend/`: Next.js application
- Dependency lockfiles:
  - `backend/package-lock.json`
  - `frontend/package-lock.json`
  - `package-lock.json` at the repo root, but CI uses the app-level lockfiles because the runnable apps live in `backend/` and `frontend/`
- Main application commands:
  - Backend: `npm run lint`, `npx tsc --noEmit -p tsconfig.json`, `npm test`, `npm run build`
  - Frontend: `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`
- Docker layout:
  - `docker-compose.yml` orchestrates `postgres`, `redis`, `elasticsearch`, `backend`, `frontend`, and `nginx`
  - Buildable services: `backend`, `frontend`, `nginx`
  - Pulled image services: `postgres`, `redis`, `elasticsearch`

## Workflows

### `ci.yml`

Triggers:

- Every `push`
- Every `pull_request`

Jobs:

- `Backend CI`
  - Installs dependencies with `npm ci`
  - Runs ESLint
  - Runs a TypeScript check
  - Runs Jest in CI mode with `--passWithNoTests`
  - Builds the NestJS application
  - Starts PostgreSQL, Redis, and Elasticsearch as GitHub Actions service containers for backend test compatibility
- `Frontend CI`
  - Installs dependencies with `npm ci`
  - Runs `next lint`
  - Runs a TypeScript check
  - Runs Jest in CI mode with `--passWithNoTests`
  - Builds the Next.js application
- `Docker Validation`
  - Validates `docker-compose.yml`
  - Pulls image-only services
  - Builds the Compose-managed application images

Implementation notes:

- `actions/setup-node` caches `npm` packages using each app's lockfile.
- Concurrency is enabled so superseded CI runs on the same ref are cancelled.
- The workflow fails immediately if lint, type checks, tests, Docker validation, or builds fail.
- `NEXT_TELEMETRY_DISABLED=1` is set to keep CI logs cleaner.

### `deploy.yml`

Triggers:

- Automatically after the `CI` workflow completes successfully for a `push` to `main`
- Manually with `workflow_dispatch`

Deployment flow:

1. GitHub Actions checks out the exact commit that passed CI.
2. The workflow validates that required deployment secrets are configured.
3. The repository is synchronized to the deployment server with `rsync`.
4. GitHub Actions runs [`scripts/deploy.sh`](./scripts/deploy.sh) on the target host over SSH.
5. The remote deploy script validates Docker Compose, pulls infrastructure images, rebuilds application services, restarts containers, and prints service status.

The deploy workflow uses the GitHub Actions `production` environment. You can add environment protection rules later without changing the workflow file.

## Required GitHub secrets

Set these in GitHub repository secrets or in the `production` environment secrets:

- `DEPLOY_HOST`: Deployment server hostname or IP
- `DEPLOY_USER`: SSH user on the deployment server
- `DEPLOY_PATH`: Absolute path on the server where the project should be deployed
- `DEPLOY_SSH_KEY`: Private SSH key used by GitHub Actions
- `DEPLOY_KNOWN_HOSTS`: Output of `ssh-keyscan -H <host>`
- `DEPLOY_PORT`: Optional SSH port, defaults to `22`

## Deployment host requirements

- Linux host with Docker Engine and Docker Compose plugin installed
- `rsync` installed on the server
- The deployment user can run `docker compose`
- The deployment directory is dedicated to this app
- Optional server-only files such as `.env`, `.env.production`, or `docker-compose.prod.yml` can live in `DEPLOY_PATH`; the workflow preserves them during sync

If you want production-specific environment variables or secret overrides, keep them on the server in `.env` or `docker-compose.prod.yml`. The deploy script automatically uses `docker-compose.prod.yml` when it exists.

## Current test status

There are currently no committed backend or frontend test files in the repository. CI still runs the test commands using `--passWithNoTests`, so:

- the pipeline stays green while the repo has no tests
- any future Jest tests added to either app will start running automatically

## Troubleshooting

- Frontend lint prompts for setup:
  - Fixed by adding `frontend/.eslintrc.json`. If this reappears, verify the file is still present.
- Deploy workflow fails with missing secret errors:
  - Add the required `DEPLOY_*` secrets in GitHub before expecting automatic production deploys.
- SSH connection fails:
  - Re-check `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_PORT`, firewall rules, and the `DEPLOY_KNOWN_HOSTS` fingerprint.
- `rsync` step fails:
  - Confirm `rsync` is installed on the target host and `DEPLOY_PATH` is writable by the deploy user.
- Docker rebuild fails on the server:
  - Run `docker compose config -q` and `docker compose build --pull` directly on the host in `DEPLOY_PATH` to reproduce.
- Services restart but do not come up healthy:
  - Inspect `docker compose ps` and `docker compose logs --tail=100` on the server. The remote deploy script already prints both on failure.
