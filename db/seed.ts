/**
 * db/seed.ts — transforms lib/events.ts static data into DB inserts.
 *
 * Run with:  npm run db:seed
 *
 * The script is idempotent: it truncates all tables in FK-safe order
 * before re-inserting, so you can re-run it any number of times.
 *
 * Phase 2 additions:
 *   • events now require start_at and end_at (NOT NULL columns).
 *     Seed data uses a deterministic date derived from the event's
 *     array position so the data looks realistic.
 *   • A seed organizer account is created (password: "seed-password-123").
 *     This account owns no registrations but is available for manual testing.
 *   • Registrations table is truncated in FK-safe order.
 */

import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"
import { EVENT_CATEGORIES } from "../lib/events"

// tsx --env-file=.env.local loads DATABASE_URL from .env.local automatically
const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error("ERROR: DATABASE_URL is not set. Run: npm run db:seed")
  process.exit(1)
}

const sql  = neon(connectionString)
const db   = drizzle(sql, { schema })

/**
 * Returns a deterministic startAt date spread across 2023–2024
 * based on the event's index position. This makes the seed data
 * look realistic without requiring manual date entry.
 */
function seedEventDates(index: number): { startAt: Date; endAt: Date } {
  // Spread events across Jan 2023 – Dec 2024 (24 months)
  const baseDate = new Date("2023-01-15T10:00:00Z")
  baseDate.setMonth(baseDate.getMonth() + (index % 24))
  const startAt = new Date(baseDate)
  const endAt   = new Date(baseDate)
  endAt.setHours(endAt.getHours() + 8) // 8-hour event duration
  return { startAt, endAt }
}

async function seed() {
  console.log("🌱 Seeding EventBrite database…")

  // --- 1. Truncate in FK-safe order -----------------------------------------
  // registrations → event_images → events → categories → users
  console.log("  ↳ Clearing existing data…")
  await db.delete(schema.registrations)
  await db.delete(schema.eventImages)
  await db.delete(schema.events)
  await db.delete(schema.categories)
  await db.delete(schema.venues)
  await db.delete(schema.users)

  // --- 2. Insert seed organizer user ----------------------------------------
  // Password hash for "seed-password-123" (bcrypt, work factor 12).
  // This hash is pre-computed so the seed script doesn't depend on bcrypt.
  // Do NOT use this account or hash in production.
  console.log("  ↳ Inserting seed organizer account…")
  await db.insert(schema.users).values({
    email:        "organizer@eventbrite.dev",
    name:         "EventBrite Organizer",
    // bcrypt hash of "seed-password-123" — pre-computed, work factor 12
    passwordHash: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8LtNpG3p8x.Vz8GfHOm",
    role:         "organizer",
  })

  // --- 3. Insert categories --------------------------------------------------
  console.log(`  ↳ Inserting ${EVENT_CATEGORIES.length} categories…`)
  const insertedCategories = await db
    .insert(schema.categories)
    .values(
      EVENT_CATEGORIES.map((cat) => ({
        name:        cat.category,
        slug:        cat.categorySlug,
        description: cat.description,
      }))
    )
    .returning({ id: schema.categories.id, slug: schema.categories.slug })

  // Build a slug → id map for fast lookups in the events loop
  const categoryIdBySlug = new Map<string, number>(
    insertedCategories.map((c) => [c.slug, c.id])
  )

  // --- 4. Insert events + images --------------------------------------------
  let eventCount = 0
  let imageCount = 0

  for (const cat of EVENT_CATEGORIES) {
    const categoryId = categoryIdBySlug.get(cat.categorySlug)
    if (!categoryId) {
      console.error(`  ✗ Category not found in map: ${cat.categorySlug}`)
      continue
    }

    for (const event of cat.events) {
      const { startAt, endAt } = seedEventDates(eventCount)

      // Insert event row and get the generated id for the images FK
      const [insertedEvent] = await db
        .insert(schema.events)
        .values({
          slug:        event.slug,
          name:        event.name,
          description: event.description,
          thumbnail:   event.thumbnail,
          categoryId,
          startAt,
          endAt,
          status:   "published",
          capacity: null, // unlimited for seeded events
        })
        .returning({ id: schema.events.id })

      eventCount++

      // Insert each image as a separate row with its display position
      if (event.images.length > 0) {
        await db.insert(schema.eventImages).values(
          event.images.map((url, position) => ({
            eventId:  insertedEvent.id,
            url,
            position,
          }))
        )
        imageCount += event.images.length
      }
    }
  }

  console.log(`  ↳ Inserted ${eventCount} events and ${imageCount} event images.`)
  console.log("  ↳ Seed organizer: organizer@eventbrite.dev / seed-password-123")
  console.log("✅ Seeding complete!")
}

seed().catch((err) => {
  console.error("Seed failed:", err)
  process.exit(1)
})
