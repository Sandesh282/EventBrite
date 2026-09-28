/**
 * lib/auth/password.ts
 *
 * Password hashing and verification using bcryptjs.
 *
 * Why bcryptjs (not bcrypt)?
 *   bcrypt is a native Node.js addon that requires compilation. bcryptjs is
 *   a pure-JavaScript implementation with identical API and output format.
 *   It works in all Next.js runtimes (Node.js, Edge) without native bindings.
 *   The performance difference (~3× slower) is irrelevant at this scale —
 *   bcrypt is intentionally slow; a few extra milliseconds don't matter.
 *
 * Work factor: 12
 *   The work factor controls how many rounds of hashing are applied.
 *   Each increment doubles the time required.
 *   Factor 12 ≈ 250–400ms on a modern server — slow enough to make brute-force
 *   infeasible, fast enough that legitimate logins feel instant.
 *   OWASP minimum recommendation is 10; 12 is a safe production default.
 *
 * Security properties:
 *   - bcrypt outputs include the salt in the hash string — no separate salt column needed.
 *   - bcrypt.compare() is constant-time — not vulnerable to timing attacks.
 *   - Plaintext passwords are never stored, logged, or returned.
 */

import bcrypt from "bcryptjs"

const WORK_FACTOR = 12

/**
 * Hash a plaintext password.
 * The returned string includes the algorithm, work factor, salt, and hash —
 * everything needed to verify future logins.
 */
export async function hashPassword(plaintext: string): Promise<string> {
  return bcrypt.hash(plaintext, WORK_FACTOR)
}

/**
 * Verify a plaintext password against a stored hash.
 * Uses bcrypt.compare() — constant-time, not vulnerable to timing attacks.
 * Returns true only when the password matches.
 */
export async function verifyPassword(
  plaintext: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plaintext, hash)
}
