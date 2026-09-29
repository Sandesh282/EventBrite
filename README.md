<div align="center">

# EventBrite

### Where Spaces Tell Stories

**A premier real estate marketing studio crafting Sales Lounges, Experience Centres, Show Apartments, and corporate events across India.**

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white)](https://neon.tech)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?logo=socketdotio&logoColor=white)](https://socket.io)
[![Vitest](https://img.shields.io/badge/Tested_with-Vitest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev)
[![CI](https://img.shields.io/badge/CI-GitHub_Actions-2088FF?logo=githubactions&logoColor=white)](https://github.com/Sandesh282/EventBrite/actions)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white)](https://www.vercel.com)

</div>

---

## Engineering Overview

EventBrite is a production-oriented full-stack event management platform. Beyond the product itself, it is built to demonstrate backend engineering depth — authentication, database design, concurrency control, real-time systems, testing, and observability.

### Architecture

```
Browser / API Client
       │
       ├── HTTP (pages, REST API)
       │         │
       │    Express → Next.js App Router
       │         │
       │    Route Handler  (thin — validates, delegates, returns HTTP)
       │         │
       │    Service Layer  (business logic, typed errors)
       │         │
       │    Repository Layer  (all DB queries isolated here)
       │         │
       │    Neon PostgreSQL  (via Drizzle ORM)
       │
       └── WebSocket
                 │
           Socket.IO (same HTTP server)
                 │
           Event Rooms  (event:{slug})
                 │
           seats:updated events → all connected clients
```

---

## Engineering Highlights

### Authentication — JWT two-token scheme
- **Access token** (15 min, `JWT_SECRET`) — sent as `Authorization: Bearer <token>`
- **Refresh token** (7 days, `JWT_REFRESH_SECRET`) — stored in `httpOnly SameSite=Strict` cookie, never accessible to JavaScript
- **Token rotation** — every `/api/auth/refresh` call issues a new refresh token; if a stolen token is used, the legitimate user's next refresh fails
- **Timing attack prevention** — `bcrypt.compare()` is always called even for unknown emails, preventing response-time enumeration
- **bcrypt work factor 12** — ~300ms per hash; infeasible to brute-force
- **RBAC** — `requireRole(user, 'organizer')` enforced at middleware layer

### Concurrency — `SELECT ... FOR UPDATE`
The registration endpoint uses row-level locking to prevent overselling:

```
Two users register for the last seat simultaneously:

Without locking:
  T=0: A reads count=0 < capacity=1 → proceed
  T=0: B reads count=0 < capacity=1 → proceed
  T=1: A inserts → count=1
  T=1: B inserts → count=2  ← OVERSOLD

With SELECT ... FOR UPDATE:
  T=0: A acquires exclusive lock on events row
  T=0: B attempts lock → BLOCKS
  T=1: A counts, inserts, COMMITS → releases lock
  T=1: B unblocks, re-reads count=1 = capacity=1 → CapacityExceededError
  Result: exactly 1 registration ✓
```

A `UNIQUE(event_id, user_id)` index acts as a second line of defence.

### Real-time — Socket.IO
- Custom Express server replaces `next dev`/`next start` — Express + Socket.IO + Next.js on one HTTP port
- Clients join event rooms (`event:{slug}`) to receive live seat updates
- After every registration/cancellation, the route handler fire-and-forgets `emitSeatsUpdated()` to all room subscribers
- Degrades gracefully: REST API works identically without the custom server (Vercel deploy)

### Observability — structured logging with pino
- JSON logs in production (ingestible by Datadog, Logflare, Axiom)
- Pretty-printed in development
- Every request gets a UUID `requestId`; echoed in `X-Request-ID` response header
- Sensitive fields (`password`, `passwordHash`, `authorization`, `cookie`) auto-redacted
- `withLogging()` HOF wraps handlers: logs method, path, status, response time

### Testing
- **35 unit tests** — auth, JWT, service logic (mocked repos, no DB)
- **1 concurrency integration test** — fires 10 simultaneous registrations against a real Neon DB event with `capacity=3`, asserts exactly 3 confirmed
- **Vitest** with v8 coverage provider

### CI/CD — GitHub Actions
- **`ci.yml`** — on every push/PR: `tsc --noEmit` + unit tests
- **`concurrency.yml`** — post-merge to main: real DB concurrency test (needs `DATABASE_URL` secret)

---

## API Reference

Live spec at [`GET /api/docs`](https://www.eventbrite.in/api/docs) — OpenAPI 3.1.0.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | — | Create account, get tokens |
| `POST` | `/api/auth/login` | — | Login, get tokens |
| `POST` | `/api/auth/refresh` | cookie | Rotate refresh token |
| `GET` | `/api/auth/me` | Bearer | Current user profile |
| `POST` | `/api/auth/logout` | — | Clear refresh cookie |
| `GET` | `/api/events` | — | List events (paginated, filterable) |
| `POST` | `/api/events` | Bearer | Create event |
| `POST` | `/api/events/:slug/register` | Bearer | Register (SELECT FOR UPDATE) |
| `DELETE` | `/api/events/:slug/register` | Bearer | Cancel registration |
| `GET` | `/api/events/:slug/registrations` | Bearer + organizer | List registrations |
| `GET` | `/api/users/me/registrations` | Bearer | My registrations |
| `POST` | `/api/contact` | — | Submit enquiry |

---

## Socket.IO Events

Connect to `ws://localhost:3000` (same port as HTTP).

```js
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000', {
  auth: { token: accessToken }  // optional — enables authenticated events
})

// Subscribe to live seat updates for an event
socket.emit('join:event', { slug: 'viacom' })

// Receive updates when anyone registers or cancels
socket.on('seats:updated', ({ slug, confirmedCount, capacity, seatsRemaining }) => {
  console.log(`${slug}: ${seatsRemaining ?? '∞'} seats remaining`)
})

// Leave when done
socket.emit('leave:event', { slug: 'viacom' })
```

---

## Local Development

### Prerequisites
- Node.js 22+
- A [Neon](https://neon.tech) PostgreSQL database

### Setup

```bash
# 1. Clone and install
git clone https://github.com/Sandesh282/EventBrite.git
cd EventBrite
npm install

# 2. Configure environment
cp .env.example .env.local
# Fill in: DATABASE_URL, API_SECRET_KEY, JWT_SECRET, JWT_REFRESH_SECRET
#
# Generate JWT secrets:
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# 3. Run database migrations
npx tsx --env-file=.env.local scripts/migrate.ts

# 4. Seed with sample events
npm run db:seed
```

### Running

```bash
# Without Socket.IO (standard Next.js dev server)
npm run dev

# With Socket.IO (custom Express server — required for real-time)
npm run dev:server

# Run unit tests
npm run test:run

# View API docs in browser (server must be running)
npm run docs:preview
```

---

## Project Structure

```
EventBrite/
├── app/
│   ├── api/
│   │   ├── auth/           # register, login, refresh, me, logout
│   │   ├── events/         # list, create, [slug]/register, [slug]/registrations
│   │   ├── users/          # me/registrations
│   │   ├── contact/        # enquiry submission
│   │   └── docs/           # GET /api/docs → OpenAPI spec
│   └── ...                 # Next.js pages and layouts
│
├── lib/
│   ├── auth/
│   │   ├── jwt.ts          # signAccessToken, signRefreshToken, verify*
│   │   ├── password.ts     # hashPassword, verifyPassword (bcrypt wf12)
│   │   └── middleware.ts   # requireAuth(), requireRole()
│   ├── repositories/       # all DB queries (events, registrations, users, contact)
│   ├── services/           # business logic (auth, events, registrations)
│   ├── middleware/
│   │   └── withLogging.ts  # request logging HOF (pino)
│   ├── errors.ts           # typed error classes
│   ├── io.ts               # Socket.IO singleton (setIO/getIO)
│   ├── logger.ts           # pino setup with redaction
│   └── validators.ts       # Zod schemas for all request bodies
│
├── server/
│   ├── index.ts            # custom server: Express + Socket.IO + Next.js
│   └── socket.ts           # Socket.IO event handlers + emitSeatsUpdated()
│
├── db/
│   ├── schema.ts           # Drizzle schema (events, users, registrations, ...)
│   ├── index.ts            # db (HTTP) + dbPool (WebSocket/FOR UPDATE)
│   └── seed.ts             # seed script
│
├── scripts/
│   └── migrate.ts          # idempotent SQL migrations via @neondatabase/serverless
│
├── __tests__/
│   ├── unit/               # 35 tests (password, JWT, auth service, reg service)
│   └── concurrency/        # SELECT FOR UPDATE race condition test (real DB)
│
├── docs/
│   └── openapi.json        # OpenAPI 3.1.0 specification
│
└── .github/workflows/
    ├── ci.yml              # tsc + unit tests on every PR
    └── concurrency.yml     # real DB test post-merge
```

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 16 (App Router) | Full-stack, file-based routing |
| Language | TypeScript 5.7 | Type safety across all layers |
| Database | Neon PostgreSQL (serverless) | Scalable, branching, HTTP + WebSocket drivers |
| ORM | Drizzle ORM | Type-safe queries, no magic |
| Auth | `jose` (JWT) + `bcryptjs` | Edge-compatible, Web Crypto API |
| Real-time | Socket.IO 4 + Express 5 | Persistent WebSocket server alongside Next.js |
| Logging | pino | ~5× faster than winston; structured JSON |
| Testing | Vitest + @vitest/coverage-v8 | Fast, native ESM, no babel |
| CI | GitHub Actions | Type-check + unit tests on PR; concurrency test post-merge |
| Deployment | Vercel | Zero-config Next.js hosting |
