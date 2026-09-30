/**
 * app/api/events/[slug]/registrations/route.ts
 *
 * GET /api/events/:slug/registrations
 *
 * Lists all registrations for an event.
 * Organizer-only — requires Bearer token with role='organizer'.
 *
 * Optional ?status=confirmed|cancelled filter.
 */

import { NextRequest, NextResponse } from "next/server"
import { requireAuth, requireRole, AuthError } from "@/lib/auth/middleware"
import * as registrationsService from "@/lib/services/registrations.service"

type RouteParams = { params: Promise<{ slug: string }> }

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { slug } = await params

  // Auth + role check
  let authUser: Awaited<ReturnType<typeof requireAuth>>
  try {
    authUser = await requireAuth(req)
    await requireRole(authUser, "organizer")
  } catch (err) {
    if (err instanceof AuthError)
      return NextResponse.json({ error: err.message }, { status: err.status })
    throw err
  }

  // Optional status filter
  const statusParam = req.nextUrl.searchParams.get("status")
  const validStatuses = ["confirmed", "cancelled"] as const
  type RegStatus = (typeof validStatuses)[number]

  if (statusParam && !validStatuses.includes(statusParam as RegStatus)) {
    return NextResponse.json(
      { error: "Invalid status. Must be 'confirmed' or 'cancelled'" },
      { status: 400 }
    )
  }

  try {
    const registrations = await registrationsService.listByEvent({
      eventSlug: slug,
      status:    statusParam as RegStatus | undefined,
    })

    return NextResponse.json({ data: registrations })
  } catch (err) {
    if (err instanceof registrationsService.NotFoundError)
      return NextResponse.json({ error: err.message }, { status: 404 })
    throw err
  }
}
