/**
 * app/api/auth/refresh/route.ts
 *
 * POST /api/auth/refresh
 *
 * Issues a new access token from a valid refresh token.
 * Also rotates the refresh token — the old one is replaced with a new one.
 *
 * Token rotation means:
 *   - If a refresh token is stolen and used, the legitimate user's next
 *     refresh call will fail (old token is gone), alerting them to re-login.
 *   - Each refresh extends the session by another 7 days (sliding window).
 *
 * Refresh token source (priority order):
 *   1. httpOnly cookie named "refresh_token" (preferred — browser clients)
 *   2. Request body { refreshToken: string } (fallback — mobile/API clients)
 */

import { NextRequest, NextResponse } from "next/server"
import * as authService from "@/lib/services/auth.service"

const REFRESH_COOKIE = "refresh_token"

export async function POST(req: NextRequest) {
  // Try cookie first, then body
  const cookieToken = req.cookies.get(REFRESH_COOKIE)?.value

  let bodyToken: string | undefined
  try {
    const body = await req.json().catch(() => ({}))
    bodyToken = typeof body?.refreshToken === "string" ? body.refreshToken : undefined
  } catch {
    bodyToken = undefined
  }

  const token = cookieToken ?? bodyToken

  if (!token) {
    return NextResponse.json(
      { error: "Refresh token required — provide via cookie or request body" },
      { status: 401 }
    )
  }

  try {
    const result = await authService.refresh(token)

    const res = NextResponse.json({
      data: { user: result.user, accessToken: result.accessToken },
    })

    // Rotate: set new refresh token cookie, replacing the old one
    res.cookies.set(REFRESH_COOKIE, result.refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure:   process.env.NODE_ENV === "production",
      maxAge:   60 * 60 * 24 * 7,
      path:     "/api/auth",
    })

    return res
  } catch (err) {
    if (err instanceof authService.InvalidCredentialsError) {
      return NextResponse.json({ error: "Invalid or expired refresh token" }, { status: 401 })
    }
    if (err instanceof authService.UserNotFoundError) {
      return NextResponse.json({ error: "User account no longer exists" }, { status: 401 })
    }
    throw err
  }
}
