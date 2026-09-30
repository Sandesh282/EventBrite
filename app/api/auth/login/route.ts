/**
 * app/api/auth/login/route.ts
 *
 * POST /api/auth/login
 *
 * Verifies email + password credentials.
 * Returns access token in body; sets refresh token as httpOnly cookie.
 *
 * Same error message for wrong email and wrong password — prevents
 * user enumeration (attacker can't tell if an email is registered).
 */

import { NextRequest, NextResponse } from "next/server"
import { LoginBodySchema } from "@/lib/validators"
import * as authService from "@/lib/services/auth.service"

const REFRESH_COOKIE = "refresh_token"

export async function POST(req: NextRequest) {
  let rawBody: unknown
  try { rawBody = await req.json() }
  catch { return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }) }

  const parsed = LoginBodySchema.safeParse(rawBody)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  try {
    const result = await authService.login(parsed.data)

    const res = NextResponse.json({
      data: { user: result.user, accessToken: result.accessToken },
    })

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
      // Generic message — does not reveal whether email exists
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }
    throw err
  }
}
