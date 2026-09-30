/**
 * lib/errors.ts
 *
 * Typed application error classes for the EventBrite domain.
 *
 * Why typed errors instead of raw strings?
 *   Route handlers can catch specific error types and return the appropriate
 *   HTTP status code without needing to parse error messages or use error codes.
 *   This makes error handling explicit and exhaustive — adding a new error
 *   class forces every catch block to decide how to handle it.
 *
 *   Pattern:
 *     throw new CapacityExceededError()          ← in service
 *     catch (err) {                              ← in route handler
 *       if (err instanceof CapacityExceededError)
 *         return NextResponse.json({ error: err.message }, { status: 409 })
 *     }
 */

// ---------------------------------------------------------------------------
// Registration errors
// ---------------------------------------------------------------------------

export class CapacityExceededError extends Error {
  constructor() {
    super("This event is at capacity — no seats remaining")
    this.name = "CapacityExceededError"
  }
}

export class DuplicateRegistrationError extends Error {
  constructor() {
    super("You are already registered for this event")
    this.name = "DuplicateRegistrationError"
  }
}

export class EventClosedError extends Error {
  constructor(reason: "cancelled" | "past" | "draft") {
    const messages = {
      cancelled: "This event has been cancelled",
      past:      "Registration for this event has closed (event has ended)",
      draft:     "This event is not open for registration",
    }
    super(messages[reason])
    this.name = "EventClosedError"
  }
}

export class RegistrationNotFoundError extends Error {
  constructor() {
    super("Registration not found")
    this.name = "RegistrationNotFoundError"
  }
}

export class ForbiddenError extends Error {
  constructor(message = "You do not have permission to perform this action") {
    super(message)
    this.name = "ForbiddenError"
  }
}

// ---------------------------------------------------------------------------
// General resource errors
// ---------------------------------------------------------------------------

export class NotFoundError extends Error {
  constructor(resource = "Resource") {
    super(`${resource} not found`)
    this.name = "NotFoundError"
  }
}
