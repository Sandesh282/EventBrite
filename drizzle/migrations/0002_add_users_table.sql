-- Migration: 0002_add_users_table.sql
--
-- Adds the users table for Phase 2 (Authentication).
--
-- Design notes:
--   • email UNIQUE — used as the login identifier and prevents duplicate accounts.
--   • password_hash — bcrypt output; plaintext passwords are never stored.
--   • role TEXT DEFAULT 'attendee' — TEXT rather than a PG enum so the role set
--     can be extended ('admin', 'staff') without a DDL ALTER TYPE migration.
--     Invalid roles are rejected at the application layer via Zod validation.

CREATE TABLE IF NOT EXISTS "users" (
  "id"            SERIAL PRIMARY KEY,
  "email"         TEXT NOT NULL UNIQUE,
  "name"          TEXT NOT NULL,
  "password_hash" TEXT NOT NULL,
  "role"          TEXT NOT NULL DEFAULT 'attendee',
  "created_at"    TIMESTAMPTZ DEFAULT NOW()
);
