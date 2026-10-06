# NOTESX

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

Prerequisites: Node 18+, and a MongoDB instance (`mongod` running locally, or a connection string).

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
```

## Scripts

Client (`cd client`):

- `npm run dev` — dev server
- `npm run build` — production build (code-split per route)
- `npm run lint` — ESLint (flat config in `eslint.config.js`)

Server (`cd server`):

- `npm start` / `npm run dev` — run the API + Socket.IO server
- `npm test` — alias for the integration test suite
- `npm run test:integration` — BuildTogether integration tests (requires MongoDB; honours `TEST_MONGO_URI`, which must contain the word `test`)
- `npm run db:migrate` — migrate legacy data design
- `npm run seed:*` — seed scripts listed above

## Deployment notes

- Set `NODE_ENV=production`, a strong `JWT_SECRET`, and `CLIENT_URL` to your deployed origins — the server refuses placeholder secrets in production.
- The client expects `VITE_API_URL` (optional) pointing at the API base; without it, requests go to the same origin.
- Socket.IO connections use the same origin (or `VITE_API_URL`) and authenticate with the JWT via the `auth` payload.
