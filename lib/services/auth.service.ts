/**
 * lib/services/auth.service.ts
 *
 * Business logic for authentication.
 * Route handlers → auth.service → users.repo + jwt + password utilities.
 *
 * This layer owns:
 *   - Credential validation
 *   - Token issuance
 *   - Typed errors for duplicate email, wrong password, etc.
 *
 * It does NOT own:
 *   - HTTP concerns (no NextRequest/NextResponse imports)
 *   - Cookie setting (that belongs in route handlers — they have access to
 *     the response object needed to set httpOnly cookies)
 */

import * as usersRepo from "@/lib/repositories/users.repo"
import { hashPassword, verifyPassword } from "@/lib/auth/password"
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "@/lib/auth/jwt"

// ---------------------------------------------------------------------------
// Typed error classes
// ---------------------------------------------------------------------------

export class EmailAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`An account with email "${email}" already exists`)
    this.name = "EmailAlreadyExistsError"
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid email or password")
    this.name = "InvalidCredentialsError"
  }
}

export class UserNotFoundError extends Error {
  constructor() {
    super("User not found")
    this.name = "UserNotFoundError"
  }
}

// ---------------------------------------------------------------------------
// register — create a new user account
//
// Steps:
//   1. Hash the plaintext password (bcrypt, work factor 12)
//   2. Insert user row (email normalised to lowercase by repo)
//   3. Issue access + refresh tokens
//   4. Return tokens + safe user profile (no passwordHash)
//
// Throws EmailAlreadyExistsError if email is already registered.
// ---------------------------------------------------------------------------

export async function register(data: {
  email:    string
  name:     string
  password: string
  role?:    "attendee" | "organizer"
}) {
  const passwordHash = await hashPassword(data.password)

  let user: Awaited<ReturnType<typeof usersRepo.create>>
  try {
    user = await usersRepo.create({
      email:        data.email,
      name:         data.name,
      passwordHash,
      role:         data.role ?? "attendee",
    })
  } catch (err: unknown) {
    // Postgres unique violation — email already exists
    if (
      typeof err === "object" && err !== null &&
      "code" in err && (err as { code: string }).code === "23505"
    ) {
      throw new EmailAlreadyExistsError(data.email)
    }
    throw err
  }

  const [accessToken, refreshToken] = await Promise.all([
    signAccessToken({ userId: user.id, role: user.role }),
    signRefreshToken({ userId: user.id }),
  ])

  return {
    user: {
      id:        user.id,
      email:     user.email,
      name:      user.name,
      role:      user.role,
      createdAt: user.createdAt,
    },
    accessToken,
    refreshToken,
  }
}

// ---------------------------------------------------------------------------
// login — verify credentials and issue tokens
//
// Steps:
//   1. Look up user by email
//   2. Verify password using bcrypt.compare() (constant-time)
//   3. Issue access + refresh tokens
//
// We use the same error message ("Invalid email or password") whether the
// email doesn't exist or the password is wrong. This prevents user enumeration:
// an attacker can't determine whether an email is registered by testing it.
// ---------------------------------------------------------------------------

export async function login(data: {
  email:    string
  password: string
}) {
  const user = await usersRepo.findByEmail(data.email)

  // Always run verifyPassword even if user is null — prevents timing attacks
  // that could reveal whether an email exists based on response time.
  const dummyHash = "$2b$12$invalidhashfortimingattackprevention00000000000000000000"
  const passwordValid = await verifyPassword(
    data.password,
    user?.passwordHash ?? dummyHash
  )

  if (!user || !passwordValid) {
    throw new InvalidCredentialsError()
  }

  const [accessToken, refreshToken] = await Promise.all([
    signAccessToken({ userId: user.id, role: user.role }),
    signRefreshToken({ userId: user.id }),
  ])

  return {
    user: {
      id:    user.id,
      email: user.email,
      name:  user.name,
      role:  user.role,
    },
    accessToken,
    refreshToken,
  }
}

// ---------------------------------------------------------------------------
// refresh — issue a new access token from a valid refresh token
//
// The refresh token is verified (signature + expiry).
// The user is looked up from DB to ensure account still exists.
// A new access token is issued; the refresh token is NOT rotated here —
// rotation is handled at the HTTP layer (the route handler sets a new cookie).
// ---------------------------------------------------------------------------

export async function refresh(refreshToken: string) {
  let payload: Awaited<ReturnType<typeof verifyRefreshToken>>
  try {
    payload = await verifyRefreshToken(refreshToken)
  } catch {
    throw new InvalidCredentialsError()
  }

  const userId = parseInt(payload.sub ?? "", 10)
  if (isNaN(userId)) throw new InvalidCredentialsError()

  const user = await usersRepo.findById(userId)
  if (!user) throw new UserNotFoundError()

  const [newAccessToken, newRefreshToken] = await Promise.all([
    signAccessToken({ userId: user.id, role: user.role }),
    signRefreshToken({ userId: user.id }),
  ])

  return {
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    accessToken:  newAccessToken,
    refreshToken: newRefreshToken,
  }
}

// ---------------------------------------------------------------------------
// getMe — fetch the current user's profile (no sensitive fields)
// ---------------------------------------------------------------------------

export async function getMe(userId: number) {
  const user = await usersRepo.findById(userId)
  if (!user) throw new UserNotFoundError()

  return {
    id:        user.id,
    email:     user.email,
    name:      user.name,
    role:      user.role,
    createdAt: user.createdAt,
  }
}
