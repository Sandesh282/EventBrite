/**
 * app/api/auth/me/route.ts
 *
 * GET /api/auth/me
 *
 * Returns the authenticated user's profile.
 * Requires a valid Bearer access token.
 * Password hash is never included in any response.
 */

import { NextRequest, NextResponse } from "next/server"
import { requireAuth, AuthError } from "@/lib/auth/middleware"
import * as authService from "@/lib/services/auth.service"

export async function GET(req: NextRequest) {
  let user: Awaited<ReturnType<typeof requireAuth>>
  try {
    user = await requireAuth(req)
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    throw err
  }

  try {
    const profile = await authService.getMe(user.userId)
    return NextResponse.json({ data: profile })
  } catch (err) {
    if (err instanceof authService.UserNotFoundError) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    throw err
  }
}
