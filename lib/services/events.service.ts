/**
 * lib/services/events.service.ts
 *
 * Business logic for the events domain.
 *
 * This layer sits between route handlers and the repository:
 *   Route handler → events.service → events.repo → DB
 *
 * Responsibilities:
 *   - Orchestrating repository calls
 *   - Computing derived values (totalPages, pagination metadata)
 *   - Transforming DB row shapes into API response shapes
 *   - Throwing typed errors that route handlers translate to HTTP responses
 *
 * What does NOT live here:
 *   - HTTP concerns (NextRequest, NextResponse, status codes)
 *   - Raw DB queries (those belong in events.repo.ts)
 *   - Input validation (that belongs in lib/validators.ts)
 */

import * as eventsRepo from "@/lib/repositories/events.repo"

// ---------------------------------------------------------------------------
// listEvents — paginated, filterable event list for GET /api/events
//
// Returns data rows + pagination metadata in the shape the handler returns
// directly as JSON. Pagination math (offset, totalPages) lives here rather
// than in the handler so it can be unit-tested without HTTP overhead.
// ---------------------------------------------------------------------------
export async function listEvents(opts: {
  page:      number
  limit:     number
  category?: string
  q?:        string
}) {
  const { rows, total } = await eventsRepo.findMany(opts)

  const totalPages = Math.ceil(total / opts.limit)

  return {
    data: rows,
    meta: {
      page:       opts.page,
      limit:      opts.limit,
      total,
      totalPages,
    },
  }
}

// ---------------------------------------------------------------------------
// getEvent — single event by slug for GET /api/events/:slug
//
// Flattens images[] rows into a plain string[] to match the Event interface
// the frontend already expects. Returns null when not found (handler → 404).
// ---------------------------------------------------------------------------
export async function getEvent(slug: string) {
  const event = await eventsRepo.findBySlug(slug)
  if (!event) return null

  // Flatten: { images: [{ url, position }] } → { images: string[] }
  const { images: imageRows, ...rest } = event
  return {
    ...rest,
    images: imageRows.map((img) => img.url),
  }
}

// ---------------------------------------------------------------------------
// createEvent — validate uniqueness and persist event + images
//
// Slug uniqueness is enforced at the DB level (UNIQUE constraint).
// We catch Postgres error code 23505 and re-throw as a typed error
// so the route handler can return a clean 409 without exposing DB internals.
// ---------------------------------------------------------------------------
export class SlugConflictError extends Error {
  constructor(slug: string) {
    super(`An event with slug "${slug}" already exists`)
    this.name = "SlugConflictError"
  }
}

export async function createEvent(data: {
  slug:        string
  name:        string
  description: string
  thumbnail:   string
  categoryId:  number
  venueId?:    number
  images:      string[]
}) {
  try {
    return await eventsRepo.create(data)
  } catch (err: unknown) {
    // Postgres unique violation — slug already exists
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "23505"
    ) {
      throw new SlugConflictError(data.slug)
    }
    throw err
  }
}

// ---------------------------------------------------------------------------
// getRelatedEvents — events in the same category, excluding the current one.
// Used by the event detail page to populate the "Related Events" section.
// ---------------------------------------------------------------------------
export async function getRelatedEvents(opts: {
  categoryId:  number
  excludeSlug: string
  limit:       number
}) {
  return eventsRepo.findRelated(opts)
}
