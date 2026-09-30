/**
 * app/api/auth/register/route.ts
 *
 * POST /api/auth/register
 *
 * Creates a new user account, issues access + refresh tokens.
 * The refresh token is set as an httpOnly cookie (not in the response body)
 * so JavaScript cannot access it — mitigates XSS token theft.
 */

import { NextRequest, NextResponse } from "next/server"
import { RegisterBodySchema } from "@/lib/validators"
import * as authService from "@/lib/services/auth.service"

const REFRESH_COOKIE = "refresh_token"

export async function POST(req: NextRequest) {
  // --- Parse + validate body ------------------------------------------------
  let rawBody: unknown
  try { rawBody = await req.json() }
  catch { return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }) }

  const parsed = RegisterBodySchema.safeParse(rawBody)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  // --- Delegate to service --------------------------------------------------
  try {
    const result = await authService.register(parsed.data)

    const res = NextResponse.json(
      { data: { user: result.user, accessToken: result.accessToken } },
      { status: 201 }
    )

    // Set refresh token in httpOnly cookie — not accessible to JavaScript
    res.cookies.set(REFRESH_COOKIE, result.refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure:   process.env.NODE_ENV === "production",
      maxAge:   60 * 60 * 24 * 7, // 7 days in seconds
      path:     "/api/auth",       // scoped — only sent to auth routes
    })

    return res
  } catch (err) {
    if (err instanceof authService.EmailAlreadyExistsError) {
      return NextResponse.json({ error: err.message }, { status: 409 })
    }
    throw err
  }
}
