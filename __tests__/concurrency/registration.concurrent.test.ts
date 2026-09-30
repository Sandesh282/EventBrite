/**
 * __tests__/concurrency/registration.concurrent.test.ts
 *
 * Concurrency tests for the registration capacity system.
 *
 * These tests hit the REAL Neon database (requires .env.local with DATABASE_URL).
 * They are intentionally separate from unit tests and slower to run.
 *
 * Run: npx vitest run __tests__/concurrency/
 *
 * WHAT IS BEING TESTED:
 * ─────────────────────
 * The SELECT ... FOR UPDATE in registrations.repo.ts prevents concurrent
 * registrations from exceeding event capacity. This test fires N concurrent
 * POST /register calls (simulated as parallel service calls) and asserts:
 *
 *   1. Exactly `capacity` registrations are confirmed
 *   2. All remaining calls get CapacityExceededError or DuplicateRegistrationError
 *   3. No overselling — total confirmed never exceeds capacity
 *
 * Why test this at all?
 *   The SELECT FOR UPDATE implementation is correct by reasoning, but
 *   concurrency bugs are notoriously hard to reason about. This test
 *   provides empirical evidence that the lock actually works.
 *
 * HOW IT WORKS:
 *   1. Create a test event with capacity=1 (or N) via direct DB insert
 *   2. Create N test users
 *   3. Fire N concurrent registrations with Promise.all()
 *   4. Count confirmed registrations — must equal capacity
 *   5. Clean up all test data
 *
 * NOTE: This test modifies the database. It cleans up after itself,
 * but if the test process is killed mid-run, orphaned test rows may remain.
 * They are identifiable by name prefix "TEST_CONCURRENT_".
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest"
import { db, dbPool } from "@/db"
import * as schema from "@/db/schema"
import { eq, like, and, count } from "drizzle-orm"
import { registerWithCapacityCheck } from "@/lib/repositories/registrations.repo"
import { CapacityExceededError, DuplicateRegistrationError } from "@/lib/errors"
import { hashPassword } from "@/lib/auth/password"

// ---------------------------------------------------------------------------
// Test data
// ---------------------------------------------------------------------------
const TEST_PREFIX   = "TEST_CONCURRENT_"
const TEST_CAPACITY = 3   // set to 1 for strictest test; higher exercises the lock under more load
const CONCURRENT_N  = 10  // total concurrent registration attempts (> capacity to ensure rejections)

let testCategoryId: number
let testEventId:    number
let testUserIds:    number[] = []

// ---------------------------------------------------------------------------
// Setup — create isolated test data
// ---------------------------------------------------------------------------
beforeAll(async () => {
  // Create or reuse a test category
  const [cat] = await db
    .insert(schema.categories)
    .values({
      name:        `${TEST_PREFIX}Category`,
      slug:        `${TEST_PREFIX}category-${Date.now()}`,
      description: "Concurrency test category",
    })
    .returning({ id: schema.categories.id })
  testCategoryId = cat.id

  // Create a test event with limited capacity
  const [event] = await db
    .insert(schema.events)
    .values({
      slug:        `${TEST_PREFIX}event-${Date.now()}`,
      name:        `${TEST_PREFIX}Event`,
      description: "Concurrency test event",
      thumbnail:   "/test.webp",
      categoryId:  testCategoryId,
      capacity:    TEST_CAPACITY,
      startAt:     new Date("2024-01-01T09:00:00Z"),
      endAt:       new Date("2099-12-31T23:59:00Z"),
      status:      "published",
    })
    .returning({ id: schema.events.id })
  testEventId = event.id

  // Create N test users
  const passwordHash = await hashPassword("test-password-concurrent")
  for (let i = 0; i < CONCURRENT_N; i++) {
    const [user] = await db
      .insert(schema.users)
      .values({
        email:        `${TEST_PREFIX}user-${Date.now()}-${i}@test.com`,
        name:         `${TEST_PREFIX}User ${i}`,
        passwordHash,
        role:         "attendee",
      })
      .returning({ id: schema.users.id })
    testUserIds.push(user.id)
  }
}, 30_000) // 30s timeout for setup

// ---------------------------------------------------------------------------
// Cleanup — remove all test data
// ---------------------------------------------------------------------------
afterAll(async () => {
  if (testEventId) {
    // Cascade delete removes registrations
    await db.delete(schema.events).where(eq(schema.events.id, testEventId))
  }
  if (testCategoryId) {
    await db.delete(schema.categories).where(eq(schema.categories.id, testCategoryId))
  }
  for (const userId of testUserIds) {
    await db.delete(schema.users).where(eq(schema.users.id, userId))
  }
}, 30_000)

// ---------------------------------------------------------------------------
// THE CONCURRENCY TEST
// ---------------------------------------------------------------------------
describe("SELECT FOR UPDATE — concurrent registration capacity enforcement", () => {
  it(
    `allows exactly ${TEST_CAPACITY} registrations when ${CONCURRENT_N} arrive simultaneously`,
    async () => {
      // Fire all N registrations concurrently — this is the stress test
      const results = await Promise.allSettled(
        testUserIds.map((userId) =>
          registerWithCapacityCheck({ eventId: testEventId, userId })
        )
      )

      // Tally outcomes
      const fulfilled = results.filter((r) => r.status === "fulfilled")
      const rejected  = results.filter((r) => r.status === "rejected")

      const capacityErrors   = rejected.filter(
        (r) => r.status === "rejected" && r.reason instanceof CapacityExceededError
      )
      const duplicateErrors  = rejected.filter(
        (r) => r.status === "rejected" && r.reason instanceof DuplicateRegistrationError
      )
      const unexpectedErrors = rejected.filter(
        (r) =>
          r.status === "rejected" &&
          !(r.reason instanceof CapacityExceededError) &&
          !(r.reason instanceof DuplicateRegistrationError)
      )

      // Core assertion: exactly TEST_CAPACITY registrations confirmed
      expect(fulfilled.length).toBe(TEST_CAPACITY)

      // All rejections must be typed errors — no unexpected crashes
      expect(unexpectedErrors.length).toBe(0)

      // Total rejections = N - capacity
      expect(capacityErrors.length + duplicateErrors.length).toBe(CONCURRENT_N - TEST_CAPACITY)

      // Verify in DB — the count must match exactly
      const [{ confirmedCount }] = await db
        .select({ confirmedCount: count() })
        .from(schema.registrations)
        .where(
          and(
            eq(schema.registrations.eventId, testEventId),
            eq(schema.registrations.status, "confirmed")
          )
        )

      expect(confirmedCount).toBe(TEST_CAPACITY)
    },
    30_000  // 30s timeout — concurrent DB operations can be slow
  )

  it("DB confirmed count never exceeds capacity (no overselling)", async () => {
    const [{ confirmedCount }] = await db
      .select({ confirmedCount: count() })
      .from(schema.registrations)
      .where(
        and(
          eq(schema.registrations.eventId, testEventId),
          eq(schema.registrations.status, "confirmed")
        )
      )

    expect(confirmedCount).toBeLessThanOrEqual(TEST_CAPACITY)
  })
})
