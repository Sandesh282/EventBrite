-- Migration: 0003_add_event_capacity_dates_status.sql
--
-- Adds capacity, scheduling, and lifecycle columns to the events table.
--
-- Design notes:
--   • capacity INTEGER NULL — NULL means unlimited; checked transactionally
--     during registration using SELECT ... FOR UPDATE (Phase 4).
--   • start_at / end_at — stored with timezone for correctness across regions.
--     Default values backfill existing rows without breaking NOT NULL.
--     Application layer enforces start_at < end_at via Zod refinement.
--   • status TEXT DEFAULT 'published' — TEXT not enum; see schema.ts for
--     the tradeoff documentation. Existing rows backfilled to 'published'.

ALTER TABLE "events"
  ADD COLUMN IF NOT EXISTS "capacity" INTEGER,
  ADD COLUMN IF NOT EXISTS "start_at" TIMESTAMPTZ NOT NULL DEFAULT '2024-01-01T09:00:00Z',
  ADD COLUMN IF NOT EXISTS "end_at"   TIMESTAMPTZ NOT NULL DEFAULT '2024-12-31T23:59:00Z',
  ADD COLUMN IF NOT EXISTS "status"   TEXT NOT NULL DEFAULT 'published';
