/**
 * app/api/events/[slug]/register/route.ts
 *
 * POST /api/events/:slug/register  — register the authenticated user
 * DELETE /api/events/:slug/register — cancel the authenticated user's registration
 */

import { NextRequest, NextResponse } from "next/server"
import { requireAuth, AuthError } from "@/lib/auth/middleware"
import * as registrationsService from "@/lib/services/registrations.service"

type RouteParams = { params: Promise<{ slug: string }> }

// ---------------------------------------------------------------------------
// POST /api/events/:slug/register
//
// Status codes:
//   201 — registered successfully
//   400 — event is draft, cancelled, or in the past
//   401 — not authenticated
//   404 — event not found
//   409 — already registered OR event at capacity
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest, { params }: RouteParams) {
  const { slug } = await params

  // Auth check — must be logged in
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
//
// Status codes:
//   200 — cancelled successfully
//   401 — not authenticated
//   403 — trying to cancel someone else's registration
//   404 — event or registration not found
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
