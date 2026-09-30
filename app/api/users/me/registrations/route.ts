/**
 * app/api/users/me/registrations/route.ts
 *
 * GET /api/users/me/registrations
 *
 * Returns the authenticated user's registration history.
 * Attendee-facing — any authenticated user can call this.
 * Optional ?status=confirmed|cancelled filter.
 */

import { NextRequest, NextResponse } from "next/server"
import { requireAuth, AuthError } from "@/lib/auth/middleware"
import * as registrationsService from "@/lib/services/registrations.service"

export async function GET(req: NextRequest) {
  let authUser: Awaited<ReturnType<typeof requireAuth>>
  try {
    authUser = await requireAuth(req)
  } catch (err) {
    if (err instanceof AuthError)
      return NextResponse.json({ error: err.message }, { status: err.status })
    throw err
  }

  const statusParam = req.nextUrl.searchParams.get("status")
  const validStatuses = ["confirmed", "cancelled"] as const
  type RegStatus = (typeof validStatuses)[number]

  if (statusParam && !validStatuses.includes(statusParam as RegStatus)) {
    return NextResponse.json(
      { error: "Invalid status. Must be 'confirmed' or 'cancelled'" },
      { status: 400 }
    )
  }

  const registrations = await registrationsService.listByUser({
    userId: authUser.userId,
    status: statusParam as RegStatus | undefined,
  })

  return NextResponse.json({ data: registrations })
}
