/**
 * app/api/events/[slug]/register/route.ts
 *
 * POST   /api/events/:slug/register — register the authenticated user
 * DELETE /api/events/:slug/register — cancel the authenticated user's registration
 *
 * Socket.IO integration:
 *   After each successful registration or cancellation, this handler
 *   emits `seats:updated` to the `event:{slug}` room via the io singleton.
 *
 *   If the custom server is not running (Vercel, plain `next dev`),
 *   getIO() returns null and emitSeatsUpdated() is a no-op — REST API
 *   continues to function normally without real-time updates.
 */

import { NextRequest, NextResponse } from "next/server"
import { requireAuth, AuthError } from "@/lib/auth/middleware"
import * as registrationsService from "@/lib/services/registrations.service"
import * as registrationsRepo    from "@/lib/repositories/registrations.repo"
import * as eventsRepo            from "@/lib/repositories/events.repo"
import { getIO }                  from "@/lib/io"
import { emitSeatsUpdated }       from "@/server/socket"

type RouteParams = { params: Promise<{ slug: string }> }

// ---------------------------------------------------------------------------
// POST /api/events/:slug/register
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest, { params }: RouteParams) {
  const { slug } = await params

  let authUser: Awaited<ReturnType<typeof requireAuth>>
  try {
    authUser = await requireAuth(req)
  } catch (err) {
    if (err instanceof AuthError)
      return NextResponse.json({ error: err.message }, { status: err.status })
    throw err
  }

  try {
    const registration = await registrationsService.register({
      eventSlug: slug,
      userId:    authUser.userId,
    })

    // ── Real-time: emit updated seat count to all watchers ─────────────────
    // Fire-and-forget: emit happens after the response is built.
    // If io is null, emitSeatsUpdated is a no-op — REST API unaffected.
    void (async () => {
      const io = getIO()
      if (!io) return
      try {
        const event = await eventsRepo.findBySlug(slug)
        if (!event) return
        const confirmedCount = await registrationsRepo.confirmedCount(event.id)
        emitSeatsUpdated(io, { slug, confirmedCount, capacity: event.capacity })
      } catch { /* non-critical — don't break the response */ }
    })()

    return NextResponse.json({ data: registration }, { status: 201 })

  } catch (err) {
    if (err instanceof registrationsService.NotFoundError)
      return NextResponse.json({ error: err.message }, { status: 404 })
    if (err instanceof registrationsService.EventClosedError)
      return NextResponse.json({ error: err.message }, { status: 400 })
    if (err instanceof registrationsService.CapacityExceededError)
      return NextResponse.json({ error: err.message }, { status: 409 })
    if (err instanceof registrationsService.DuplicateRegistrationError)
      return NextResponse.json({ error: err.message }, { status: 409 })
    throw err
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/events/:slug/register
// ---------------------------------------------------------------------------
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { slug } = await params

  let authUser: Awaited<ReturnType<typeof requireAuth>>
  try {
    authUser = await requireAuth(req)
  } catch (err) {
    if (err instanceof AuthError)
      return NextResponse.json({ error: err.message }, { status: err.status })
    throw err
  }

  try {
    const registration = await registrationsService.cancel({
      eventSlug:        slug,
      userId:           authUser.userId,
      requestingUserId: authUser.userId,
    })

    // ── Real-time: emit freed seat to all watchers ──────────────────────────
    void (async () => {
      const io = getIO()
      if (!io) return
      try {
        const event = await eventsRepo.findBySlug(slug)
        if (!event) return
        const confirmedCount = await registrationsRepo.confirmedCount(event.id)
        emitSeatsUpdated(io, { slug, confirmedCount, capacity: event.capacity })
      } catch { /* non-critical */ }
    })()

    return NextResponse.json({ data: registration })

  } catch (err) {
    if (err instanceof registrationsService.NotFoundError)
      return NextResponse.json({ error: err.message }, { status: 404 })
    if (err instanceof registrationsService.RegistrationNotFoundError)
      return NextResponse.json({ error: err.message }, { status: 404 })
    if (err instanceof registrationsService.ForbiddenError)
      return NextResponse.json({ error: err.message }, { status: 403 })
    throw err
  }
}
