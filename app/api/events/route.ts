/**
 * app/api/events/route.ts
 *
 * GET  /api/events  — paginated, filterable event list
 * POST /api/events  — create a new event (auth-protected)
 */

import { NextRequest, NextResponse } from "next/server"
import { eq, and, ilike, count, asc } from "drizzle-orm"
import { db } from "@/db"
import * as schema from "@/db/schema"
import { GetEventsQuerySchema, CreateEventBodySchema } from "@/lib/validators"

// ---------------------------------------------------------------------------
// GET /api/events
//
// Query params (all optional, all Zod-validated server-side):
//   ?page=1         — 1-indexed page number (default: 1)
//   ?limit=12       — items per page, hard-clamped to max 50 (default: 12)
//   ?category=slug  — filter by category slug (e.g. "corporate-event")
//   ?q=viacom       — ILIKE search on event name (case-insensitive)
//
// Response: { data: EventListItem[], meta: { page, limit, total, totalPages } }
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl

  // Parse and validate all query params with Zod; return 400 on invalid input
  const parsed = GetEventsQuerySchema.safeParse({
    page:     searchParams.get("page")     ?? undefined,
    limit:    searchParams.get("limit")    ?? undefined,
    category: searchParams.get("category") ?? undefined,
    q:        searchParams.get("q")        ?? undefined,
  })

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query parameters", details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { page, limit, category, q } = parsed.data
  const offset = (page - 1) * limit

  // Build WHERE clause dynamically — drizzle's and() ignores undefined args
  const where = and(
    // Join categories table and filter by slug (index on category_id used by events)
    category ? eq(schema.categories.slug, category) : undefined,
    // Case-insensitive LIKE search on event name
    q ? ilike(schema.events.name, `%${q}%`) : undefined,
  )

  // Run count and data queries in parallel for efficiency
  const [countResult, rows] = await Promise.all([
    // Total matching rows for pagination metadata
    db
      .select({ total: count() })
      .from(schema.events)
      .leftJoin(schema.categories, eq(schema.events.categoryId, schema.categories.id))
      .where(where),

    // Paginated data — LEFT JOIN categories so category info is included in each row
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

  const total      = countResult[0]?.total ?? 0
  const totalPages = Math.ceil(total / limit)

  return NextResponse.json({
    data: rows,
    meta: { page, limit, total, totalPages },
  })
}

// ---------------------------------------------------------------------------
// POST /api/events
//
// Protected by Authorization: Bearer <API_SECRET_KEY> header.
// Body validated with Zod (CreateEventBodySchema).
//
// Status codes:
//   201 — created successfully
//   400 — Zod validation failure (returns field-level error details)
//   401 — missing or incorrect Bearer token
//   409 — slug already exists (Postgres unique constraint violation)
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  // --- Auth check -----------------------------------------------------------
  // Simple Bearer token auth — sufficient for a portfolio API.
  // Production would use JWTs or OAuth, but the pattern is identical.
  const authHeader = req.headers.get("authorization") ?? ""
  const token      = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : ""

  if (!process.env.API_SECRET_KEY || token !== process.env.API_SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // --- Body validation ------------------------------------------------------
  let rawBody: unknown
  try {
    rawBody = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const parsed = CreateEventBodySchema.safeParse(rawBody)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const body = parsed.data

  // --- DB insert (event + images in a transaction) --------------------------
  // Wrapping in a transaction means either both succeed or neither does.
  // If the images insert fails, the event row is rolled back automatically.
  try {
    const result = await db.transaction(async (tx) => {
      // Insert the event record first to get its generated id
      const [newEvent] = await tx
        .insert(schema.events)
        .values({
          slug:        body.slug,
          name:        body.name,
          description: body.description,
          thumbnail:   body.thumbnail,
          categoryId:  body.categoryId,
          venueId:     body.venueId,
        })
        .returning({ id: schema.events.id, slug: schema.events.slug })

      // Insert each image with its display position index
      await tx.insert(schema.eventImages).values(
        body.images.map((url, position) => ({
          eventId: newEvent.id,
          url,
          position, // preserves the order the caller submitted them
        }))
      )

      return newEvent
    })

    return NextResponse.json({ data: result }, { status: 201 })

  } catch (err: unknown) {
    // Postgres unique violation error code — slug already exists
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "23505"
    ) {
      return NextResponse.json(
        { error: "An event with this slug already exists" },
        { status: 409 }
      )
    }
    // Re-throw unexpected errors so Next.js 500 handler logs them properly
    throw err
  }
}
