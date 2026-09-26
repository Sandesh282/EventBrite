/**
 * scripts/migrate.ts
 *
 * Applies all pending schema migrations directly via the Neon HTTP driver.
 * Use this instead of `drizzle-kit migrate` when running locally — drizzle-kit
 * requires a standard TCP postgres driver which isn't installed in this env.
 *
 * All migrations are idempotent (IF NOT EXISTS / DO $$ ... EXCEPTION blocks)
 * so this script is safe to re-run at any time.
 *
 * Usage: npx tsx --env-file=.env.local scripts/migrate.ts
 */

import { neon } from "@neondatabase/serverless"

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.error("❌  DATABASE_URL is not set. Create .env.local first.")
  process.exit(1)
}

const sql = neon(DATABASE_URL)

async function migrate() {
  console.log("🔌  Connecting to Neon…")

  // ---------------------------------------------------------------------------
  // Migration 0001 — enquiry_status enum + contact_enquiries table
  // ---------------------------------------------------------------------------
  console.log("▶   [0001] enquiry_status enum + contact_enquiries…")
  await sql`
    DO $$ BEGIN
      CREATE TYPE enquiry_status AS ENUM ('new', 'read', 'replied');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$
  `
  await sql`
    CREATE TABLE IF NOT EXISTS contact_enquiries (
      id         SERIAL PRIMARY KEY,
      name       TEXT NOT NULL,
      email      TEXT NOT NULL,
      phone      TEXT,
      service    TEXT,
      message    TEXT NOT NULL,
      status     enquiry_status NOT NULL DEFAULT 'new',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `

  // ---------------------------------------------------------------------------
  // Migration 0002 — users table
  //
  // password_hash stores a bcrypt hash (work factor >= 12).
  // role TEXT (not enum) so the role set can expand without DDL ALTER TYPE.
  // ---------------------------------------------------------------------------
  console.log("▶   [0002] users table…")
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id            SERIAL PRIMARY KEY,
      email         TEXT NOT NULL UNIQUE,
      name          TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role          TEXT NOT NULL DEFAULT 'attendee',
      created_at    TIMESTAMPTZ DEFAULT NOW()
    )
  `

  // ---------------------------------------------------------------------------
  // Migration 0003 — capacity, scheduling, and status columns on events
  //
  // capacity  NULL  = unlimited registrations.
  // start_at/end_at = event scheduling. NOT NULL with defaults for backfill.
  // status    TEXT  = event lifecycle ('draft'|'published'|'cancelled').
  // ---------------------------------------------------------------------------
  console.log("▶   [0003] events: capacity, start_at, end_at, status…")
  await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS capacity INTEGER`
  await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS start_at TIMESTAMPTZ NOT NULL DEFAULT '2024-01-01T09:00:00Z'`
  await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS end_at   TIMESTAMPTZ NOT NULL DEFAULT '2024-12-31T23:59:00Z'`
  await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS status   TEXT        NOT NULL DEFAULT 'published'`

  // ---------------------------------------------------------------------------
  // Migration 0004 — registrations table
  //
  // Unique index on (event_id, user_id) is the DB-level duplicate prevention.
  // Soft-delete via status = 'cancelled' (no hard DELETEs on registrations).
  // ---------------------------------------------------------------------------
  console.log("▶   [0004] registrations table…")
  await sql`
    CREATE TABLE IF NOT EXISTS registrations (
      id         SERIAL PRIMARY KEY,
      event_id   INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      user_id    INTEGER NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
      status     TEXT    NOT NULL DEFAULT 'confirmed',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS registrations_event_user_uidx
      ON registrations(event_id, user_id)
  `

  console.log("✅  All migrations applied successfully.")
  console.log("    Tables:  users, events (updated), registrations, contact_enquiries")
  console.log("    Indexes: registrations_event_user_uidx")
}

migrate().catch((err) => {
  console.error("❌  Migration failed:", err.message)
  process.exit(1)
})
