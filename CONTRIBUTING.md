# Contributing to NOTESX

## One-command workflow (from the repo root)

```bash
npm install          # installs root tooling + wires up the git hooks (prepare script)
npm run dev          # server (port 5001) + client (port 5173) together
npm run lint         # client ESLint
npm test             # server integration tests (needs a local MongoDB)
npm run build        # client production build
npm run seed         # load all sample data (or run individual seed:* scripts in server/)
```

Requirements: Node 20.19+ (22 LTS recommended — Vite 8 needs it) and a running `mongod` on `127.0.0.1:27017`.

Both packages still work standalone (`cd client && npm run dev`, `cd server && npm start`) — the root scripts are pass-throughs.

## Branches & commits

- Branch names: short and descriptive (`feat-ai-navigation`, `fix-auth-redirect`).
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/), matching existing history:
  `feat(notes): …`, `fix(auth): …`, `chore(deploy): …`.

## Before you push

CI (`.github/workflows/ci.yml`) runs the same checks on every push to `main` and every PR:

1. **Client** — `npm run lint:ci` then `npm run build`.
2. **Server** — integration tests against a `mongo:7` service container.

### Lint warning ceiling

Client lint currently has **187 pre-existing warnings** and 0 errors. `lint:ci` enforces `--max-warnings 187`, so:

- New code must not add warnings — fix any new ones you introduce.
- When you fix existing warnings, **lower the number** in `client/package.json` (`lint:ci`) — never raise it.
- Full details of warnings: `npm run lint` (no ceiling).

### Server tests

- `npm test` runs `node --test tests/buildTogether.integration.test.js`.
- `TEST_MONGO_URI` is honoured but its database name **must contain a `test` segment** — the suite refuses anything else and creates its own throwaway DB (`notesx_buildtogether_test_<pid>_<uuid>`), dropping it afterwards.
- Don't point tests at a database you care about.

## Pre-commit hook

`.githooks/pre-commit` (activated automatically by `npm install` at the root via `core.hooksPath`) does three fast checks:

1. Blocks committing any `.env` file, even if force-added.
2. Runs the client lint ceiling when `client/` files are staged.
3. Syntax-checks (`node --check`) staged `server/*.js` files.

Escape hatch for WIP commits: `git commit --no-verify` — CI is the safety net.

## Pull requests

Keep PRs small and use the template checklist. One logical change per PR makes review and revert easy.

## Deployment

See [README.md](README.md#deployment-notes) — client on Vercel, API on Render, MongoDB Atlas, Cloudinary for uploads. Deploy client first, then set `CLIENT_URL` on Render and redeploy.
