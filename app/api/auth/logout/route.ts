/**
 * app/api/auth/logout/route.ts
 *
 * POST /api/auth/logout
 *
 * Clears the httpOnly refresh token cookie.
 * Access tokens are stateless and cannot be revoked server-side —
 * they expire naturally after 15 minutes.
 *
 * This is intentional and documented (see lib/auth/jwt.ts):
 * "Stateless JWTs cannot be revoked before expiry without a server-side
 * store. The 15-minute access token TTL is the acceptable exposure window."
 *
 * Clients should discard the access token from memory on logout.
 * If Redis is added later, a token blocklist (jti-based) can be introduced.
 */

import { NextResponse } from "next/server"

const REFRESH_COOKIE = "refresh_token"

export async function POST() {
  const res = NextResponse.json({ data: { message: "Logged out successfully" } })

  // Clear the refresh token cookie by setting maxAge=0
  res.cookies.set(REFRESH_COOKIE, "", {
    httpOnly: true,
    sameSite: "strict",
    secure:   process.env.NODE_ENV === "production",
    maxAge:   0,
    path:     "/api/auth",
  })

  return res
}
