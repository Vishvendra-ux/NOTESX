# NOTESX

[![CI](https://github.com/Vishvendra-ux/NOTESX/actions/workflows/ci.yml/badge.svg)](https://github.com/Vishvendra-ux/NOTESX/actions/workflows/ci.yml)

A full-stack study platform for college students: hierarchical notes library, Q&A (doubts) community, GATE prep with practice tests, career roadmaps, jobs board, build-together project collaboration with real-time workspaces, contests, campus communities, and a games lobby.

## Stack

| Layer  | Tech |
|--------|------|
| Client | React 19, Vite, Tailwind CSS 4, React Router 7, Socket.IO client, Axios |
| Server | Node.js, Express 5, Mongoose 9, Socket.IO, JWT auth, Helmet, rate limiting |
| DB     | MongoDB (local or Atlas) |

## Project structure

```
client/   React SPA (src/pages, src/components, src/services/api.js)
server/   Express API (routes/ controllers/ models/ middleware/ socket/)
```

## Getting started

Prerequisites: Node 20.19+ (22 LTS recommended — required by Vite 8), and a MongoDB instance (`mongod` running locally, or a connection string).

### Root workflow (recommended)

```bash
npm install          # from the repo root: adds root tooling and activates git hooks
npm run dev          # server (:5001) + client (:5173) together
npm run lint         # client ESLint
npm test             # server integration tests
npm run build        # client production build
npm run seed         # load all sample data
```

Individual servers and seeds still work per-package as shown below. See [CONTRIBUTING.md](CONTRIBUTING.md) for the branch/commit/test conventions.

### 1. Server

```bash
cd server
cp .env.example .env        # then edit values
npm install
npm run dev                 # or: npm start
```

`.env` keys (see `.env.example`):

- `PORT` — API port (default 5001)
- `MONGO_URI` — e.g. `mongodb://127.0.0.1:27017/notesx`
- `JWT_SECRET` — generate with `openssl rand -hex 32` (required to be strong in production)
- `CLIENT_URL` — comma-separated allowed origins for CORS (e.g. `http://localhost:5173`)
- Optional: `GOOGLE_CLIENT_ID`, `GEMINI_API_KEY`, `ADMIN_EMAIL`/`ADMIN_PASSWORD`/`ADMIN_NAME`

### 2. Client

```bash
cd client
npm install
npm run dev                 # Vite dev server on http://localhost:5173
```

The dev server proxies `/api` to the backend (see `vite.config.js`).

### 3. Optional seed data

```bash
cd server
npm run seed:notes          # degrees → branches → subjects hierarchy + notes
npm run seed:community      # colleges & community content
npm run seed:doubts         # sample GATE doubts
npm run seed:jobs           # sample job postings
npm run seed:roadmaps       # career roadmaps
npm run seed:build          # build-together projects
npm run seed:gate           # GATE practice questions (one MCQ set per subject)
```

## Scripts

Client (`cd client`):

- `npm run dev` — dev server
- `npm run build` — production build (code-split per route)
- `npm run lint` — ESLint (flat config in `eslint.config.js`)
- `npm run lint:ci` — same lint with the warning ceiling used by CI and the pre-commit hook

Server (`cd server`):

- `npm start` / `npm run dev` — run the API + Socket.IO server
- `npm test` — alias for the integration test suite
- `npm run test:integration` — BuildTogether + GATE import integration tests (requires MongoDB; honours `TEST_MONGO_URI`, which must contain the word `test`)
- `npm run seed:gate` — import the bundled GATE practice set
- `npm run db:migrate` — migrate legacy data design
- `npm run seed:*` — seed scripts listed above

## GATE question bank

Practice questions live in the `gatequestions` collection, organized by subject/topic IDs from `client/src/data/gateSyllabus.js` (validated server-side against `server/data/gateSyllabus.json`).

- **Admin UI:** log in as an admin and open the profile menu → *GATE Question Import* (`/admin/gate-questions`) — paste or load a JSON array, optionally fill missing subject/topic from dropdowns, and get a per-row import report. Make an admin with `ADMIN_EMAIL`/`ADMIN_PASSWORD` in `server/.env` (seeded on boot if no admin exists).
- **CLI:** `node scripts/importGateQuestions.js <file.json> [subjectId topicId]` — rows may carry their own `subjectId`/`topicId`, or the CLI arguments apply to every row. Re-imports upsert (no duplicates).
- **API:** `POST /api/gate/questions/import` (admin only) returns `{ total, inserted, updated, matched, rejected: [{ row, reason }] }`; `GET /api/gate/catalog` lists valid IDs.

## Deployment notes

- Set `NODE_ENV=production`, a strong `JWT_SECRET`, and `CLIENT_URL` to your deployed origins — the server refuses placeholder secrets in production.
- The client expects `VITE_API_URL` (optional) pointing at the API base; without it, requests go to the same origin.
- Socket.IO connections use the same origin (or `VITE_API_URL`) and authenticate with the JWT via the `auth` payload.
