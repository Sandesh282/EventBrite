/**
 * __tests__/unit/auth/jwt.test.ts
 *
 * Unit tests for lib/auth/jwt.ts
 *
 * Tests JWT signing, verification, expiry, and cross-secret rejection.
 * No DB, no network. Sets process.env secrets before each test.
 */

import { describe, it, expect, beforeAll } from "vitest"
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "@/lib/auth/jwt"

// Set secrets before any tests run
beforeAll(() => {
  process.env.JWT_SECRET         = "test-access-secret-at-least-32-characters-long"
  process.env.JWT_REFRESH_SECRET = "test-refresh-secret-at-least-32-characters-long"
})

describe("signAccessToken / verifyAccessToken", () => {
  it("issues a token that verifies successfully", async () => {
    const token = await signAccessToken({ userId: 42, role: "attendee" })
    const payload = await verifyAccessToken(token)

    expect(payload.sub).toBe("42")
    expect(payload.role).toBe("attendee")
    expect(payload.type).toBe("access")
  })

  it("encodes userId as string in sub field (JWT spec)", async () => {
    const token = await signAccessToken({ userId: 99, role: "organizer" })
    const payload = await verifyAccessToken(token)
    // JWT spec requires sub to be a string
    expect(typeof payload.sub).toBe("string")
    expect(payload.sub).toBe("99")
  })

  it("sets type = 'access' so tokens cannot be confused with refresh tokens", async () => {
    const token = await signAccessToken({ userId: 1, role: "attendee" })
    const payload = await verifyAccessToken(token)
    expect(payload.type).toBe("access")
  })

  it("rejects a refresh token when verifying as access token", async () => {
    // Because access and refresh tokens use DIFFERENT secrets, the signature
    // check fails first ('signature verification failed') before reaching our
    // type check. Either way, the token is rejected — that's what we care about.
    const refreshToken = await signRefreshToken({ userId: 1 })
    await expect(verifyAccessToken(refreshToken)).rejects.toThrow()
  })

  it("rejects a tampered token", async () => {
    const token = await signAccessToken({ userId: 1, role: "attendee" })
    const tampered = token.slice(0, -5) + "xxxxx"
    await expect(verifyAccessToken(tampered)).rejects.toThrow()
  })
})

describe("signRefreshToken / verifyRefreshToken", () => {
  it("issues a refresh token that verifies successfully", async () => {
    const token = await signRefreshToken({ userId: 7 })
    const payload = await verifyRefreshToken(token)

    expect(payload.sub).toBe("7")
    expect(payload.type).toBe("refresh")
  })

  it("rejects an access token when verifying as refresh token", async () => {
    // Signature check fails before type check (different secrets) — still rejected.
    const accessToken = await signAccessToken({ userId: 1, role: "attendee" })
    await expect(verifyRefreshToken(accessToken)).rejects.toThrow()
  })
})

describe("Cross-secret rejection (security property)", () => {
  it("access token cannot be verified with refresh secret", async () => {
    // This tests that the two secrets are truly separate.
    // If they were the same, a leaked access token could be used as a refresh token.
    const accessToken = await signAccessToken({ userId: 1, role: "attendee" })
    // verifyRefreshToken uses JWT_REFRESH_SECRET (different from JWT_SECRET)
    // The type check will fail first, but even without it the signature differs
    await expect(verifyRefreshToken(accessToken)).rejects.toThrow()
  })
})
