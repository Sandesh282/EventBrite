/**
 * db/index.ts — Neon serverless + Drizzle client singleton.
 *
 * Why @neondatabase/serverless?
 *   Neon's serverless driver uses HTTP (single queries) and WebSockets
 *   (transactions) instead of persistent TCP. This is required on Vercel
 *   serverless/edge functions where long-lived TCP connections are not
 *   supported. It also works fine in Node.js scripts (e.g. db:seed).
 *
 * Why lazy connection string (??  "")?
 *   next build performs static analysis at compile time. Modules are imported
 *   but DB queries are never executed for force-dynamic pages. Using ?? ""
 *   lets the module load without throwing; a real query with an empty URL
 *   will fail at request time with a clear error — correct behaviour.
 */

import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

// process.env.DATABASE_URL must be set in .env.local (local) or Vercel env vars (prod)
const connectionString = process.env.DATABASE_URL ?? ""

const sql = neon(connectionString)

// Pass schema so db.query.* relational API has full type information
export const db = drizzle(sql, { schema })
