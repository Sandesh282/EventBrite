-- Migration: 0004_add_registrations_table.sql
--
-- Adds the registrations join table linking users to events.
--
-- Design notes:
--   • UNIQUE INDEX on (event_id, user_id) — this is the hard DB-level guarantee
--     against duplicate registrations. Even if application code has a bug,
--     Postgres rejects the second INSERT with error code 23505.
--     This is a second line of defence after the SELECT ... FOR UPDATE check
--     in the registration service (Phase 4).
--
--   • status TEXT DEFAULT 'confirmed' — soft-delete pattern: we set
--     status = 'cancelled' rather than DELETE so organizers retain the
--     full history of who registered and when.
--
--   • ON DELETE CASCADE (both FKs) — removing an event or user automatically
--     purges their registrations, preventing orphaned rows.

CREATE TABLE IF NOT EXISTS "registrations" (
  "id"         SERIAL PRIMARY KEY,
  "event_id"   INTEGER NOT NULL REFERENCES "events"("id") ON DELETE CASCADE,
  "user_id"    INTEGER NOT NULL REFERENCES "users"("id")  ON DELETE CASCADE,
  "status"     TEXT NOT NULL DEFAULT 'confirmed',
  "created_at" TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS "registrations_event_user_uidx"
  ON "registrations"("event_id", "user_id");
