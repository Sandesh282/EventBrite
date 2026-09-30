/**
 * lib/repositories/registrations.repo.ts
 *
 * All database queries for the registrations domain.
 *
 * THE CRITICAL FUNCTION HERE IS `registerWithCapacityCheck`.
 *
 * The concurrency problem it solves:
 * ─────────────────────────────────
 * Imagine an event with capacity=1 and 0 current registrations.
 * Two users (A and B) hit POST /api/events/:slug/register simultaneously.
 *
 * Without locking:
 *   T=0: A reads registrationCount=0 → 0 < 1 → proceed
 *   T=0: B reads registrationCount=0 → 0 < 1 → proceed
 *   T=1: A inserts registration       → count=1 ✓
 *   T=1: B inserts registration       → count=2 ✗ OVERSOLD
 *
 * With SELECT ... FOR UPDATE:
 *   T=0: A's transaction acquires row-level EXCLUSIVE lock on events row
 *   T=0: B's transaction attempts to acquire same lock → BLOCKS
 *   T=1: A counts registrations → 0 < 1 → inserts → COMMITS → releases lock
 *   T=1: B unblocks, re-reads count → 1 = 1 → throws CapacityExceededError
 *   Result: exactly 1 registration, capacity respected ✓
 *
 * The UNIQUE(event_id, user_id) index is a second line of defence:
 *   Even if locking somehow fails, Postgres rejects a duplicate
 *   INSERT with error code 23505.
 */

import { and, count, eq, sql } from "drizzle-orm"
import { dbPool } from "@/db"          // Pool client — supports FOR UPDATE
import { db }    from "@/db"          // HTTP client — for non-transactional reads
import * as schema from "@/db/schema"
import {
  CapacityExceededError,
  DuplicateRegistrationError,
} from "@/lib/errors"

// ---------------------------------------------------------------------------
// registerWithCapacityCheck — the core concurrency-safe registration function
//
// Uses a PostgreSQL transaction with SELECT ... FOR UPDATE to prevent
// concurrent registrations from exceeding event capacity.
//
// Must use dbPool (WebSocket driver) — the HTTP driver cannot hold
// a transaction open across multiple statements with locking semantics.
// ---------------------------------------------------------------------------
export async function registerWithCapacityCheck(opts: {
  eventId: number
  userId:  number
}) {
  return dbPool.transaction(async (tx) => {
    // Step 1: Lock the events row exclusively for the duration of this transaction.
    // Any concurrent transaction attempting the same lock will block here
    // until we COMMIT or ROLLBACK — guaranteeing serialised capacity checks.
    const [event] = (await tx.execute(
      sql`SELECT id, capacity FROM events WHERE id = ${opts.eventId} FOR UPDATE`
    ) as unknown) as Array<{ id: number; capacity: number | null }>

    if (!event) {
      throw new Error("Event not found during registration transaction")
    }

    // Step 2: Count current CONFIRMED registrations (excluding cancelled).
    const [{ confirmedCount }] = await tx
      .select({ confirmedCount: count() })
      .from(schema.registrations)
      .where(
        and(
          eq(schema.registrations.eventId, opts.eventId),
          eq(schema.registrations.status, "confirmed")
        )
      )

    // Step 3: Check capacity (null = unlimited — always allow).
    if (event.capacity !== null && confirmedCount >= event.capacity) {
      throw new CapacityExceededError()
    }

    // Step 4: Insert the registration.
    // If UNIQUE(event_id, user_id) is violated, Postgres throws 23505.
    // We catch that below and re-throw as DuplicateRegistrationError.
    try {
      const [registration] = await tx
        .insert(schema.registrations)
        .values({
          eventId: opts.eventId,
          userId:  opts.userId,
          status:  "confirmed",
        })
        .returning()

      return registration
    } catch (err: unknown) {
      if (
        typeof err === "object" && err !== null &&
        "code" in err && (err as { code: string }).code === "23505"
      ) {
        throw new DuplicateRegistrationError()
      }
      throw err
    }
    // COMMIT — lock released here. Waiting transactions proceed with updated count.
  })
}

// ---------------------------------------------------------------------------
// cancel — soft-delete a registration (set status = 'cancelled')
//
// Returns the updated registration, or null if not found.
// Hard-delete is intentionally avoided: organizers need registration history.
// ---------------------------------------------------------------------------
export async function cancel(opts: { eventId: number; userId: number }) {
  const [updated] = await db
    .update(schema.registrations)
    .set({ status: "cancelled" })
    .where(
      and(
        eq(schema.registrations.eventId, opts.eventId),
        eq(schema.registrations.userId,  opts.userId),
        eq(schema.registrations.status,  "confirmed")
      )
    )
    .returning()

  return updated ?? null
}

// ---------------------------------------------------------------------------
// findByEvent — list all registrations for an event (organizer view)
// ---------------------------------------------------------------------------
export async function findByEvent(opts: {
  eventId: number
  status?: "confirmed" | "cancelled"
}) {
  return db.query.registrations.findMany({
    where: and(
      eq(schema.registrations.eventId, opts.eventId),
      opts.status ? eq(schema.registrations.status, opts.status) : undefined
    ),
    with: {
      user: { columns: { id: true, name: true, email: true, role: true } },
    },
    orderBy: (r, { desc }) => [desc(r.createdAt)],
  })
}

// ---------------------------------------------------------------------------
// findByUser — list all registrations for the current user (attendee view)
// ---------------------------------------------------------------------------
export async function findByUser(opts: {
  userId: number
  status?: "confirmed" | "cancelled"
}) {
  return db.query.registrations.findMany({
    where: and(
      eq(schema.registrations.userId, opts.userId),
      opts.status ? eq(schema.registrations.status, opts.status) : undefined
    ),
    with: {
      event: {
        columns: { id: true, slug: true, name: true, thumbnail: true, startAt: true, endAt: true, status: true },
        with: {
          category: { columns: { name: true, slug: true } },
        },
      },
    },
    orderBy: (r, { desc }) => [desc(r.createdAt)],
  })
}

// ---------------------------------------------------------------------------
// findOne — find a specific registration by event + user
// ---------------------------------------------------------------------------
export async function findOne(opts: { eventId: number; userId: number }) {
  const reg = await db.query.registrations.findFirst({
    where: and(
      eq(schema.registrations.eventId, opts.eventId),
      eq(schema.registrations.userId,  opts.userId)
    ),
  })
  return reg ?? null
}

// ---------------------------------------------------------------------------
// confirmedCount — count of confirmed registrations for an event.
// Used by the service layer to expose seat availability.
// ---------------------------------------------------------------------------
export async function confirmedCount(eventId: number): Promise<number> {
  const [{ total }] = await db
    .select({ total: count() })
    .from(schema.registrations)
    .where(
      and(
        eq(schema.registrations.eventId, eventId),
        eq(schema.registrations.status,  "confirmed")
      )
    )
  return total
}
