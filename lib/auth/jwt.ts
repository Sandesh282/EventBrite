/**
 * lib/auth/jwt.ts
 *
 * JWT signing and verification using the `jose` library.
 *
 * Why jose (not jsonwebtoken)?
 *   jsonwebtoken uses Node.js crypto APIs — it doesn't work in Next.js Edge
 *   runtime or Vercel Edge Functions. jose uses the Web Crypto API, which
 *   works in all environments (Node.js, Edge, browser).
 *
 * Token architecture — two-token scheme:
 *
 *   Access token (short-lived, 15 minutes):
 *     - Sent in the Authorization: Bearer <token> header on each request.
 *     - Short TTL limits the window of exposure if a token is leaked.
 *     - Stateless — no server-side storage needed to validate.
 *     - Contains: { sub: userId, role, type: 'access' }
 *
 *   Refresh token (long-lived, 7 days):
 *     - Stored in an httpOnly, SameSite=Strict cookie (not in JS-accessible storage).
 *     - httpOnly prevents XSS from stealing the token.
 *     - SameSite=Strict prevents CSRF from using the token cross-origin.
 *     - Used to obtain new access tokens when they expire.
 *     - Contains: { sub: userId, type: 'refresh' }
 *     - Signed with a DIFFERENT secret (JWT_REFRESH_SECRET) from access tokens.
 *       This means a leaked access token cannot be used to forge refresh tokens.
 *
 * Revocation:
 *   Stateless JWTs cannot be revoked before expiry without a server-side store.
 *   The 15-minute access token TTL is the acceptable exposure window.
 *   If Redis is added later, a token blocklist (jti-based) becomes feasible.
 *   This tradeoff is documented here and in docs/auth.md.
 *
 * Algorithm: HS256 (HMAC-SHA256)
 *   Symmetric — the same secret signs and verifies. Appropriate for a
 *   single-service system where only our own server verifies tokens.
 *   RS256 (asymmetric) would be needed if third-party services needed to
 *   verify tokens without accessing our secret.
 */

import { SignJWT, jwtVerify, type JWTPayload } from "jose"

// ---------------------------------------------------------------------------
// Token payload types
// ---------------------------------------------------------------------------

export interface AccessTokenPayload extends JWTPayload {
  sub:  string    // userId as string (JWT spec: sub is always string)
  role: string    // 'attendee' | 'organizer'
  type: "access"
}

export interface RefreshTokenPayload extends JWTPayload {
  sub:  string    // userId as string
  type: "refresh"
}

// ---------------------------------------------------------------------------
// Secret helpers — encode secrets to Uint8Array as jose requires
// ---------------------------------------------------------------------------

function getAccessSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error("JWT_SECRET environment variable is not set")
  return new TextEncoder().encode(secret)
}

function getRefreshSecret(): Uint8Array {
  const secret = process.env.JWT_REFRESH_SECRET
  if (!secret) throw new Error("JWT_REFRESH_SECRET environment variable is not set")
  return new TextEncoder().encode(secret)
}

// ---------------------------------------------------------------------------
// Token lifetimes
// ---------------------------------------------------------------------------

export const ACCESS_TOKEN_TTL  = "15m"  // 15 minutes
export const REFRESH_TOKEN_TTL = "7d"   // 7 days

// ---------------------------------------------------------------------------
// signAccessToken — create a short-lived access token
// ---------------------------------------------------------------------------

export async function signAccessToken(payload: {
  userId: number
  role:   string
}): Promise<string> {
  return new SignJWT({
    sub:  String(payload.userId),
    role: payload.role,
    type: "access" as const,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_TTL)
    .sign(getAccessSecret())
}

// ---------------------------------------------------------------------------
// signRefreshToken — create a long-lived refresh token
// Signed with a DIFFERENT secret so access token leaks can't forge refresh tokens.
// ---------------------------------------------------------------------------

export async function signRefreshToken(payload: {
  userId: number
}): Promise<string> {
  return new SignJWT({
    sub:  String(payload.userId),
    type: "refresh" as const,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_TTL)
    .sign(getRefreshSecret())
}

// ---------------------------------------------------------------------------
// verifyAccessToken — validate signature + expiry on an access token.
// Throws JWTExpired, JWTInvalid, or JOSEError on failure.
// ---------------------------------------------------------------------------

export async function verifyAccessToken(
  token: string
): Promise<AccessTokenPayload> {
  const { payload } = await jwtVerify(token, getAccessSecret(), {
    algorithms: ["HS256"],
  })

  if (payload.type !== "access") {
    throw new Error("Invalid token type — expected access token")
  }

  return payload as AccessTokenPayload
}

// ---------------------------------------------------------------------------
// verifyRefreshToken — validate signature + expiry on a refresh token.
// ---------------------------------------------------------------------------

export async function verifyRefreshToken(
  token: string
): Promise<RefreshTokenPayload> {
  const { payload } = await jwtVerify(token, getRefreshSecret(), {
    algorithms: ["HS256"],
  })

  if (payload.type !== "refresh") {
    throw new Error("Invalid token type — expected refresh token")
  }

  return payload as RefreshTokenPayload
}
