/**
 * db/index.ts — Neon serverless + Drizzle client setup.
 *
 * TWO clients are exported:
 *
 * 1. `db`    — HTTP-based client (neon-http)
 *    Used for all standard queries: SELECT, INSERT, UPDATE, DELETE.
 *    Stateless HTTP — ideal for Vercel serverless functions.
 *    Cannot do multi-statement transactions with row-level locking.
 *
 * 2. `dbPool` — WebSocket/Pool-based client (neon-serverless)
 *    Used ONLY for transactions that require `SELECT ... FOR UPDATE`.
 *    Maintains a persistent WebSocket connection per request lifecycle.
 *    Required for the registration concurrency check (Phase 4).
 *
 * Why two clients?
 *   Neon's HTTP driver batches queries into a single HTTP request — fast
 *   for independent queries, but it cannot hold a transaction open across
 *   multiple round-trips with locking semantics. The Pool driver uses
 *   WebSockets which support stateful transactions and row-level locks.
 *   We use the simpler HTTP client everywhere we don't need locking,
 *   and the Pool client only where SELECT ... FOR UPDATE is required.
 */

import { neon, Pool, neonConfig } from "@neondatabase/serverless"
import { drizzle as drizzleHttp }  from "drizzle-orm/neon-http"
import { drizzle as drizzlePool }  from "drizzle-orm/neon-serverless"
import * as schema from "./schema"

// WebSocket is required by the Pool driver in Node.js environments
// (it's built-in in the browser/Edge but needs a polyfill in Node.js).
import ws from "ws"
neonConfig.webSocketConstructor = ws

const connectionString = process.env.DATABASE_URL ?? ""

// HTTP client — used for all standard queries
const sql = neon(connectionString)
export const db = drizzleHttp(sql, { schema })

// Pool client — used only for transactional queries with FOR UPDATE locking
const pool = new Pool({ connectionString })
export const dbPool = drizzlePool(pool, { schema })
