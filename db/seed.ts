/**
 * db/seed.ts — transforms lib/events.ts static data into DB inserts.
 *
 * Run with:  npm run db:seed
 *
 * The script is idempotent: it truncates all four tables in FK-safe order
 * before re-inserting, so you can re-run it any number of times.
 *
 * No venue data is seeded because the static source has no venue fields;
 * venues can be added manually or via the POST /api/events endpoint later.
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

async function seed() {
  console.log("🌱 Seeding EventBrite database...")

  // --- 1. Truncate in FK-safe order -----------------------------------------
  // event_images → events → categories (venues has no FK dependents here)
  console.log("  ↳ Clearing existing data...")
  await db.delete(schema.eventImages)
  await db.delete(schema.events)
  await db.delete(schema.categories)
  await db.delete(schema.venues)

  // --- 2. Insert categories --------------------------------------------------
  console.log(`  ↳ Inserting ${EVENT_CATEGORIES.length} categories...`)
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

  // --- 3. Insert events + images --------------------------------------------
  let eventCount = 0
  let imageCount = 0

  for (const cat of EVENT_CATEGORIES) {
    const categoryId = categoryIdBySlug.get(cat.categorySlug)
    if (!categoryId) {
      console.error(`  ✗ Category not found in map: ${cat.categorySlug}`)
      continue
    }

    for (const event of cat.events) {
      // Insert event row and get the generated id for the images FK
      const [insertedEvent] = await db
        .insert(schema.events)
        .values({
          slug:        event.slug,
          name:        event.name,
          description: event.description,
          thumbnail:   event.thumbnail,
          categoryId,
          // venueId omitted — static data has no venue information
        })
        .returning({ id: schema.events.id })

      eventCount++

      // Insert each image as a separate row with its display position
      if (event.images.length > 0) {
        await db.insert(schema.eventImages).values(
          event.images.map((url, position) => ({
            eventId:  insertedEvent.id,
            url,
            position, // preserves original array order from lib/events.ts
          }))
        )
        imageCount += event.images.length
      }
    }
  }

  console.log(`  ↳ Inserted ${eventCount} events and ${imageCount} event images.`)
  console.log("✅ Seeding complete!")
}

seed().catch((err) => {
  console.error("Seed failed:", err)
  process.exit(1)
})
