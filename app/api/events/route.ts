/**
 * app/api/events/route.ts
 *
 * GET  /api/events  — paginated, filterable event list
 * POST /api/events  — create a new event (auth-protected)
 *
 * Handlers are wrapped with withLogging() which adds:
 *   - Unique X-Request-ID per request (forwarded from upstream if present)
 *   - Structured JSON log lines via pino (method, path, status, ms)
 *   - Unhandled error capture (returns 500 instead of crashing)
 *
 * Business logic lives in lib/services/events.service.ts
 * DB queries live in lib/repositories/events.repo.ts
 */

import { NextRequest, NextResponse } from "next/server"
import { GetEventsQuerySchema, CreateEventBodySchema } from "@/lib/validators"
import * as eventsService from "@/lib/services/events.service"
import { withLogging } from "@/lib/middleware/withLogging"

// ---------------------------------------------------------------------------
// GET /api/events
// ---------------------------------------------------------------------------
async function _GET(req: NextRequest) {
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
// ---------------------------------------------------------------------------
async function _POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization") ?? ""
  const token      = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : ""

  if (!process.env.API_SECRET_KEY || token !== process.env.API_SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

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

// Wrap with logging middleware — adds request ID, structured logs, response time
export const GET  = withLogging(_GET)
export const POST = withLogging(_POST)
