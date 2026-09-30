/**
 * __tests__/unit/auth/password.test.ts
 *
 * Unit tests for lib/auth/password.ts
 *
 * No DB, no network. Pure bcrypt behaviour.
 */

import { describe, it, expect } from "vitest"
import { hashPassword, verifyPassword } from "@/lib/auth/password"

describe("hashPassword", () => {
  it("returns a bcrypt hash string starting with $2b$", async () => {
    const hash = await hashPassword("my-password-123")
    expect(hash).toMatch(/^\$2b\$12\$/)
  })

  it("produces a different hash each call (unique salts)", async () => {
    const hash1 = await hashPassword("same-password")
    const hash2 = await hashPassword("same-password")
    expect(hash1).not.toBe(hash2)
  })

  it("never returns the plaintext password in the hash output", async () => {
    const password = "super-secret"
    const hash = await hashPassword(password)
    expect(hash).not.toContain(password)
  })
})

describe("verifyPassword", () => {
  it("returns true for the correct password", async () => {
    const password = "correct-horse-battery"
    const hash = await hashPassword(password)
    const result = await verifyPassword(password, hash)
    expect(result).toBe(true)
  })

  it("returns false for an incorrect password", async () => {
    const hash = await hashPassword("correct-password")
    const result = await verifyPassword("wrong-password", hash)
    expect(result).toBe(false)
  })

  it("returns false for an empty string against a real hash", async () => {
    const hash = await hashPassword("notempty")
    const result = await verifyPassword("", hash)
    expect(result).toBe(false)
  })

  it("is consistent — same hash verifies true multiple times", async () => {
    const password = "consistency-check"
    const hash = await hashPassword(password)
    expect(await verifyPassword(password, hash)).toBe(true)
    expect(await verifyPassword(password, hash)).toBe(true)
  })
})
