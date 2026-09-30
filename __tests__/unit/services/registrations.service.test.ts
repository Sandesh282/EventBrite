/**
 * __tests__/unit/services/registrations.service.test.ts
 *
 * Unit tests for lib/services/registrations.service.ts
 *
 * The repository layer is mocked — no DB required.
 * Tests focus on business logic: event eligibility checks,
 * error propagation, authorization rules.
 *
 * Mocking strategy:
 *   vi.mock() replaces the entire module with vi.fn() stubs.
 *   Each test configures the stubs to return the scenario under test.
 *   This isolates the service from DB behaviour completely.
 */

import { describe, it, expect, vi, beforeEach } from "vitest"
import * as registrationsService from "@/lib/services/registrations.service"

// Mock the DB module BEFORE any repo is imported — prevents neon() from
// running at module load time and failing with 'No database connection string'
vi.mock("@/db", () => ({ db: {}, dbPool: {} }))

// --- Mock the repository layer ---
vi.mock("@/lib/repositories/registrations.repo")
vi.mock("@/lib/repositories/events.repo")

// Import mocked modules so we can configure them per test
import * as eventsRepo         from "@/lib/repositories/events.repo"
import * as registrationsRepo  from "@/lib/repositories/registrations.repo"

// Helper: build a minimal event object matching the DB shape
function makeEvent(overrides: Partial<{
  id: number; slug: string; status: string;
  endAt: Date; startAt: Date; capacity: number | null;
}> = {}) {
  return {
    id:          1,
    slug:        "test-event",
    name:        "Test Event",
    description: "A test event",
    thumbnail:   "/img.webp",
    status:      "published",
    startAt:     new Date("2024-01-01T09:00:00Z"),
    endAt:       new Date("2099-12-31T23:59:00Z"), // far future — open for registration
    capacity:    null,
    categoryId:  1,
    venueId:     null,
    createdAt:   new Date(),
    updatedAt:   new Date(),
    category:    null,
    venue:       null,
    images:      [],
    ...overrides,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
})

// ---------------------------------------------------------------------------
// register()
// ---------------------------------------------------------------------------
describe("registrations.service.register", () => {
  it("throws NotFoundError when event does not exist", async () => {
    vi.mocked(eventsRepo.findBySlug).mockResolvedValue(null)

    await expect(
      registrationsService.register({ eventSlug: "missing", userId: 1 })
    ).rejects.toThrow(registrationsService.NotFoundError)
  })

  it("throws EventClosedError when event is cancelled", async () => {
    vi.mocked(eventsRepo.findBySlug).mockResolvedValue(
      makeEvent({ status: "cancelled" })
    )

    await expect(
      registrationsService.register({ eventSlug: "test-event", userId: 1 })
    ).rejects.toThrow(registrationsService.EventClosedError)
  })

  it("throws EventClosedError when event is a draft", async () => {
    vi.mocked(eventsRepo.findBySlug).mockResolvedValue(
      makeEvent({ status: "draft" })
    )

    await expect(
      registrationsService.register({ eventSlug: "test-event", userId: 1 })
    ).rejects.toThrow(registrationsService.EventClosedError)
  })

  it("throws EventClosedError when event end date is in the past", async () => {
    vi.mocked(eventsRepo.findBySlug).mockResolvedValue(
      makeEvent({ endAt: new Date("2020-01-01T00:00:00Z") }) // past
    )

    await expect(
      registrationsService.register({ eventSlug: "test-event", userId: 1 })
    ).rejects.toThrow(registrationsService.EventClosedError)
  })

  it("calls registerWithCapacityCheck with correct eventId and userId", async () => {
    vi.mocked(eventsRepo.findBySlug).mockResolvedValue(makeEvent({ id: 42 }))
    const mockReg = { id: 1, eventId: 42, userId: 7, status: "confirmed", createdAt: new Date() }
    vi.mocked(registrationsRepo.registerWithCapacityCheck).mockResolvedValue(mockReg as any)

    const result = await registrationsService.register({
      eventSlug: "test-event",
      userId:    7,
    })

    expect(registrationsRepo.registerWithCapacityCheck).toHaveBeenCalledWith({
      eventId: 42,
      userId:  7,
    })
    expect(result.status).toBe("confirmed")
  })

  it("propagates CapacityExceededError from repo", async () => {
    vi.mocked(eventsRepo.findBySlug).mockResolvedValue(makeEvent())
    vi.mocked(registrationsRepo.registerWithCapacityCheck).mockRejectedValue(
      new registrationsService.CapacityExceededError()
    )

    await expect(
      registrationsService.register({ eventSlug: "test-event", userId: 1 })
    ).rejects.toThrow(registrationsService.CapacityExceededError)
  })

  it("propagates DuplicateRegistrationError from repo", async () => {
    vi.mocked(eventsRepo.findBySlug).mockResolvedValue(makeEvent())
    vi.mocked(registrationsRepo.registerWithCapacityCheck).mockRejectedValue(
      new registrationsService.DuplicateRegistrationError()
    )

    await expect(
      registrationsService.register({ eventSlug: "test-event", userId: 1 })
    ).rejects.toThrow(registrationsService.DuplicateRegistrationError)
  })
})

// ---------------------------------------------------------------------------
// cancel()
// ---------------------------------------------------------------------------
describe("registrations.service.cancel", () => {
  it("throws ForbiddenError when requestingUserId differs from userId", async () => {
    await expect(
      registrationsService.cancel({
        eventSlug:        "test-event",
        userId:           1,
        requestingUserId: 2, // different user trying to cancel
      })
    ).rejects.toThrow(registrationsService.ForbiddenError)
  })

  it("throws NotFoundError when event does not exist", async () => {
    vi.mocked(eventsRepo.findBySlug).mockResolvedValue(null)

    await expect(
      registrationsService.cancel({
        eventSlug:        "missing",
        userId:           1,
        requestingUserId: 1,
      })
    ).rejects.toThrow(registrationsService.NotFoundError)
  })

  it("throws RegistrationNotFoundError when registration does not exist", async () => {
    vi.mocked(eventsRepo.findBySlug).mockResolvedValue(makeEvent({ id: 1 }))
    vi.mocked(registrationsRepo.cancel).mockResolvedValue(null)

    await expect(
      registrationsService.cancel({
        eventSlug:        "test-event",
        userId:           1,
        requestingUserId: 1,
      })
    ).rejects.toThrow(registrationsService.RegistrationNotFoundError)
  })

  it("returns the cancelled registration on success", async () => {
    const mockReg = { id: 5, eventId: 1, userId: 1, status: "cancelled", createdAt: new Date() }
    vi.mocked(eventsRepo.findBySlug).mockResolvedValue(makeEvent({ id: 1 }))
    vi.mocked(registrationsRepo.cancel).mockResolvedValue(mockReg as any)

    const result = await registrationsService.cancel({
      eventSlug:        "test-event",
      userId:           1,
      requestingUserId: 1,
    })

    expect(result.status).toBe("cancelled")
  })
})
