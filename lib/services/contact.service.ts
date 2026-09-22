/**
 * lib/services/contact.service.ts
 *
 * Business logic for the contact enquiries domain.
 *
 * Route handler → contact.service → contact.repo → DB
 *
 * Currently thin — the enquiry domain has little business logic beyond
 * persisting and retrieving rows. The layer exists so that:
 *   1. Any future business rules (rate limiting per email, auto-reply
 *      triggering, status transitions) have a clear home.
 *   2. The pattern is consistent with events.service.ts.
 *   3. Route handlers remain free of any data-access concerns.
 */

import * as contactRepo from "@/lib/repositories/contact.repo"
import type { EnquiryStatus } from "@/lib/repositories/contact.repo"

// ---------------------------------------------------------------------------
// submitEnquiry — persist a new contact form submission.
//
// Normalises phone: empty string → null (matches the DB's nullable column).
// Returns { id, createdAt } for the 201 response body.
// ---------------------------------------------------------------------------
export async function submitEnquiry(data: {
  name:     string
  email:    string
  phone?:   string
  service?: string
  message:  string
}) {
  const phone =
    data.phone && data.phone.trim() !== "" ? data.phone.trim() : null

  return contactRepo.create({
    name:    data.name,
    email:   data.email,
    phone,
    service: data.service ?? null,
    message: data.message,
  })
}

// ---------------------------------------------------------------------------
// listEnquiries — retrieve all enquiries, optionally filtered by status.
// Used by GET /api/contact (auth-protected internal endpoint).
// ---------------------------------------------------------------------------
export async function listEnquiries(opts?: { status?: EnquiryStatus }) {
  return contactRepo.findMany(opts)
}
