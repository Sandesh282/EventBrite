/**
 * lib/repositories/events.repo.ts
 *
 * All database queries for the events domain live here.
 * Route handlers and service functions never import `db` directly —
 * they go through this module so that:
 *   1. DB queries are easy to find and audit in one place.
 *   2. Service unit tests can mock this module without touching the DB.
 *   3. Query changes don't require hunting through handler files.
 *
 * Functions return plain Drizzle result types.
 * The service layer is responsible for any business-logic transforms.
 */

import { and, asc, count, eq, ilike, ne } from "drizzle-orm"
import { db } from "@/db"
import * as schema from "@/db/schema"

// ---------------------------------------------------------------------------
// Types inferred from the schema — keeps return types in sync with the DB
// ---------------------------------------------------------------------------

export type EventListItem = {
  id:          number
  slug:        string
  name:        string
  description: string
  thumbnail:   string
  createdAt:   Date | null
  category: {
    id:   number | null
    name: string | null
    slug: string | null
  }
}

export type EventDetail = Awaited<ReturnType<typeof findBySlug>>

// ---------------------------------------------------------------------------
// findMany — paginated, filterable event list
//
// Runs count + data queries in parallel (Promise.all) so both execute in a
// single round-trip to the DB rather than sequentially.
// ---------------------------------------------------------------------------
export async function findMany(opts: {
  page:      number
  limit:     number
  category?: string
  q?:        string
}) {
  const { page, limit, category, q } = opts
  const offset = (page - 1) * limit

  // and() ignores undefined args — no WHERE clause built for missing filters
  const where = and(
    category ? eq(schema.categories.slug, category) : undefined,
    q        ? ilike(schema.events.name, `%${q}%`)  : undefined,
  )

  const [countResult, rows] = await Promise.all([
    db
      .select({ total: count() })
      .from(schema.events)
      .leftJoin(schema.categories, eq(schema.events.categoryId, schema.categories.id))
      .where(where),

    db
      .select({
        id:          schema.events.id,
        slug:        schema.events.slug,
        name:        schema.events.name,
        description: schema.events.description,
        thumbnail:   schema.events.thumbnail,
        createdAt:   schema.events.createdAt,
        category: {
          id:   schema.categories.id,
          name: schema.categories.name,
          slug: schema.categories.slug,
        },
      })
      .from(schema.events)
      .leftJoin(schema.categories, eq(schema.events.categoryId, schema.categories.id))
      .where(where)
      .orderBy(asc(schema.events.id))
      .limit(limit)
      .offset(offset),
  ])

  return {
    rows,
    total: countResult[0]?.total ?? 0,
  }
}

// ---------------------------------------------------------------------------
// findBySlug — single event with all relations joined.
//
// Uses Drizzle's relational query builder (db.query.*) which compiles to
// an efficient JOIN under the hood. Returns null when not found.
// ---------------------------------------------------------------------------
export async function findBySlug(slug: string) {
  const event = await db.query.events.findFirst({
    where: eq(schema.events.slug, slug),
    with: {
      category: {
        columns: { id: true, name: true, slug: true, description: true },
      },
      venue: {
        columns: { id: true, name: true, city: true },
      },
      images: {
        columns: { url: true, position: true },
        orderBy: [asc(schema.eventImages.position)],
      },
    },
  })

  return event ?? null
}

// ---------------------------------------------------------------------------
// findRelated — events in the same category, excluding the current slug.
// Used by the event detail page's "Related Events" section.
// ---------------------------------------------------------------------------
export async function findRelated(opts: {
  categoryId: number
  excludeSlug: string
  limit:       number
}) {
  return db.query.events.findMany({
    where: and(
      eq(schema.events.categoryId, opts.categoryId),
      ne(schema.events.slug, opts.excludeSlug),
    ),
    columns: { slug: true, name: true, thumbnail: true },
    limit:   opts.limit,
    orderBy: [asc(schema.events.id)],
  })
}

// ---------------------------------------------------------------------------
// create — insert a new event + its images inside a single transaction.
//
// Using a transaction guarantees that if the image inserts fail, the event
// row is rolled back automatically — no orphaned event rows with no images.
//
// Returns { id, slug } of the newly created event.
// Throws with code "23505" on slug uniqueness violation (caught in service).
// ---------------------------------------------------------------------------
export async function create(data: {
  slug:        string
  name:        string
  description: string
  thumbnail:   string
  categoryId:  number
  venueId?:    number
  images:      string[]
}) {
  return db.transaction(async (tx) => {
    const [newEvent] = await tx
      .insert(schema.events)
      .values({
        slug:        data.slug,
        name:        data.name,
        description: data.description,
        thumbnail:   data.thumbnail,
        categoryId:  data.categoryId,
        venueId:     data.venueId,
      })
      .returning({ id: schema.events.id, slug: schema.events.slug })

    if (data.images.length > 0) {
      await tx.insert(schema.eventImages).values(
        data.images.map((url, position) => ({
          eventId: newEvent.id,
          url,
          position,
        }))
      )
    }

    return newEvent
  })
}
