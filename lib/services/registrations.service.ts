/**
 * lib/services/registrations.service.ts
 *
 * Business logic for event registration.
 *
 * Route handler → registrations.service → registrations.repo → DB
 *
 * This layer is responsible for:
 *   - Event eligibility checks (published, not past, not cancelled)
 *   - Delegating the capacity + concurrency check to the repository
 *   - Authorization checks (can this user cancel this registration?)
 *   - Orchestrating repository calls for list/view operations
 */

import * as registrationsRepo from "@/lib/repositories/registrations.repo"
import * as eventsRepo         from "@/lib/repositories/events.repo"
import {
  NotFoundError,
  EventClosedError,
  CapacityExceededError,
  DuplicateRegistrationError,
  RegistrationNotFoundError,
  ForbiddenError,
} from "@/lib/errors"

// Re-export error types so route handlers only need one import
export {
  NotFoundError,
  EventClosedError,
  CapacityExceededError,
  DuplicateRegistrationError,
  RegistrationNotFoundError,
  ForbiddenError,
}

// ---------------------------------------------------------------------------
// register — register a user for an event
//
// Pre-conditions checked before the DB transaction:
//   1. Event exists
//   2. Event is 'published' (not draft or cancelled)
//   3. Event has not ended (endAt > now)
//
// The capacity check and INSERT happen inside a SELECT FOR UPDATE transaction
// in registrations.repo — see that file for the full concurrency explanation.
// ---------------------------------------------------------------------------
export async function register(opts: {
  eventSlug: string
  userId:    number
}) {
  // Fetch event by slug
  const event = await eventsRepo.findBySlug(opts.eventSlug)
  if (!event) throw new NotFoundError("Event")

  // Check event lifecycle
  if (event.status === "cancelled") throw new EventClosedError("cancelled")
  if (event.status === "draft")     throw new EventClosedError("draft")

  // Check event hasn't ended
  const now = new Date()
  if (event.endAt && new Date(event.endAt) < now) {
    throw new EventClosedError("past")
  }

  // Delegate the capacity check + INSERT to the repository.
  // The repository runs this inside a SELECT ... FOR UPDATE transaction.
  try {
    return await registrationsRepo.registerWithCapacityCheck({
      eventId: event.id,
      userId:  opts.userId,
    })
  } catch (err) {
    // Re-throw typed errors; let unexpected errors bubble up as 500
    if (
      err instanceof CapacityExceededError ||
      err instanceof DuplicateRegistrationError
    ) {
      throw err
    }
    throw err
  }
}

// ---------------------------------------------------------------------------
// cancel — cancel a user's registration for an event
//
// Authorization: the user can only cancel their own registration.
// Organisers cancelling on behalf of attendees is out of scope for now.
// Soft-delete: sets status = 'cancelled', preserves the row for history.
// ---------------------------------------------------------------------------
export async function cancel(opts: {
  eventSlug: string
  userId:    number
  requestingUserId: number
}) {
  // Authorization check: only the registrant can cancel their own registration
  if (opts.userId !== opts.requestingUserId) {
    throw new ForbiddenError("You can only cancel your own registration")
  }

  const event = await eventsRepo.findBySlug(opts.eventSlug)
  if (!event) throw new NotFoundError("Event")

  const updated = await registrationsRepo.cancel({
    eventId: event.id,
    userId:  opts.userId,
  })

  if (!updated) throw new RegistrationNotFoundError()
  return updated
}

// ---------------------------------------------------------------------------
// listByEvent — all registrations for an event (organizer-only view)
// ---------------------------------------------------------------------------
export async function listByEvent(opts: {
  eventSlug: string
  status?:   "confirmed" | "cancelled"
}) {
  const event = await eventsRepo.findBySlug(opts.eventSlug)
  if (!event) throw new NotFoundError("Event")

  return registrationsRepo.findByEvent({
    eventId: event.id,
    status:  opts.status,
  })
}

// ---------------------------------------------------------------------------
// listByUser — all registrations for the current user (attendee view)
// ---------------------------------------------------------------------------
export async function listByUser(opts: {
  userId:  number
  status?: "confirmed" | "cancelled"
}) {
  return registrationsRepo.findByUser(opts)
}
