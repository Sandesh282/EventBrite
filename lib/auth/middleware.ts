/**
 * lib/auth/middleware.ts
 *
 * Route protection helpers used by Next.js API route handlers.
 *
 * Usage in a protected route:
 *
 *   export async function GET(req: NextRequest) {
 *     const user = await requireAuth(req)            // throws 401 if invalid
 *     await requireRole(user, 'organizer')           // throws 403 if wrong role
 *     // ... handler logic with user.userId, user.role
 *   }
 *
 * These functions throw typed AuthError instances which the handler
 * catches and translates to the appropriate HTTP response.
 *
 * Design decision: throw vs return
 *   Throwing forces the caller to handle the error — you can't accidentally
 *   proceed past a failed auth check. If we returned null, a developer
 *   might forget the null check and expose protected data.
 */

import { NextRequest } from "next/server"
import { verifyAccessToken, type AccessTokenPayload } from "@/lib/auth/jwt"
import { JWTExpired } from "jose/errors"

// ---------------------------------------------------------------------------
// Typed error classes — let route handlers return the right HTTP status
// without knowing JWT internals.
// ---------------------------------------------------------------------------

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly status: 401 | 403 = 401
  ) {
    super(message)
    this.name = "AuthError"
  }
}

// ---------------------------------------------------------------------------
// Authenticated user shape — what handlers receive after requireAuth()
// ---------------------------------------------------------------------------

export interface AuthenticatedUser {
  userId: number
  role:   string
}

// ---------------------------------------------------------------------------
// requireAuth — extract and validate the Bearer token from the request.
//
// Token must be in the Authorization header: "Bearer <token>"
// Returns the decoded payload on success.
// Throws AuthError with status 401 on missing, expired, or invalid token.
// ---------------------------------------------------------------------------

export async function requireAuth(req: NextRequest): Promise<AuthenticatedUser> {
  const authHeader = req.headers.get("authorization") ?? ""
  const token      = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : ""

  if (!token) {
    throw new AuthError("Authentication required — provide a Bearer token", 401)
  }

  let payload: AccessTokenPayload
  try {
    payload = await verifyAccessToken(token)
  } catch (err) {
    if (err instanceof JWTExpired) {
      throw new AuthError("Token expired — please refresh your access token", 401)
    }
    throw new AuthError("Invalid token", 401)
  }

  const userId = parseInt(payload.sub ?? "", 10)
  if (isNaN(userId)) {
    throw new AuthError("Malformed token payload", 401)
  }

  return { userId, role: payload.role }
}

// ---------------------------------------------------------------------------
// requireRole — assert that the authenticated user has the required role.
//
// Must be called after requireAuth(). Throws 403 if the role doesn't match.
//
// Example: requireRole(user, 'organizer')
// ---------------------------------------------------------------------------

export async function requireRole(
  user:         AuthenticatedUser,
  requiredRole: string
): Promise<void> {
  if (user.role !== requiredRole) {
    throw new AuthError(
      `Forbidden — this action requires the '${requiredRole}' role`,
      403
    )
  }
}

// ---------------------------------------------------------------------------
// handleAuthError — convert an AuthError to a Response-compatible object.
// Use in catch blocks inside route handlers.
//
// Example:
//   } catch (err) {
//     if (err instanceof AuthError) return handleAuthError(err)
//     throw err
//   }
// ---------------------------------------------------------------------------

export function handleAuthError(err: AuthError): { status: number; body: object } {
  return {
    status: err.status,
    body:   { error: err.message },
  }
}
