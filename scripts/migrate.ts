/**
 * scripts/migrate.ts
 *
 * Applies the contact_enquiries migration directly via the Neon HTTP driver.
 * Use this instead of `drizzle-kit migrate` when running locally — drizzle-kit
 * requires a standard TCP postgres driver which isn't installed in this env.
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

  // Step 1: Create the enum type (idempotent via IF NOT EXISTS)
  console.log("▶   Creating enquiry_status enum…")
  await sql`
    DO $$ BEGIN
      CREATE TYPE enquiry_status AS ENUM ('new', 'read', 'replied');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$
  `

  // Step 2: Create the contact_enquiries table (idempotent)
  console.log("▶   Creating contact_enquiries table…")
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

  console.log("✅  Migration applied successfully.")
  console.log("    Tables: contact_enquiries")
  console.log("    Enums:  enquiry_status (new | read | replied)")
}

migrate().catch((err) => {
  console.error("❌  Migration failed:", err.message)
  process.exit(1)
})
