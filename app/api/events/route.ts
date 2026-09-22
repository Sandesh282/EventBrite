/**
 * app/api/events/route.ts
 *
 * GET  /api/events  — paginated, filterable event list
 * POST /api/events  — create a new event (auth-protected)
 *
 * This handler is intentionally thin: it validates input, delegates to the
 * service layer, and translates results to HTTP responses.
 * All business logic and DB queries live in:
 *   lib/services/events.service.ts
 *   lib/repositories/events.repo.ts
 */

import { NextRequest, NextResponse } from "next/server"
import { GetEventsQuerySchema, CreateEventBodySchema } from "@/lib/validators"
import * as eventsService from "@/lib/services/events.service"

// ---------------------------------------------------------------------------
// GET /api/events
//
// Query params (all optional, all Zod-validated):
//   ?page=1         — 1-indexed page number (default: 1)
//   ?limit=12       — items per page, hard-clamped to max 50 (default: 12)
//   ?category=slug  — filter by category slug
//   ?q=viacom       — ILIKE search on event name (case-insensitive)
//
// Response: { data: EventListItem[], meta: { page, limit, total, totalPages } }
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl

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

  const result = await eventsService.listEvents(parsed.data)
  return NextResponse.json(result)
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
//   409 — slug already exists
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  // --- Auth check -----------------------------------------------------------
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

  // --- Delegate to service --------------------------------------------------
  try {
    const event = await eventsService.createEvent(parsed.data)
    return NextResponse.json({ data: event }, { status: 201 })
  } catch (err) {
    if (err instanceof eventsService.SlugConflictError) {
      return NextResponse.json(
        { error: "An event with this slug already exists" },
        { status: 409 }
      )
    }
    throw err
  }
}
