/**
 * app/api/contact/route.ts
 *
 * POST /api/contact  — submit a new enquiry (public, no auth required)
 * GET  /api/contact  — list all enquiries (auth-protected, for internal use)
 *
 * Handler delegates to contact.service.ts for business logic.
 * Response envelope matches /api/events:
 *   Success → { data: T }
 *   Error   → { error: string, details?: ZodFlatError }
 */

import { NextRequest, NextResponse } from "next/server"
import { ContactEnquiryBodySchema } from "@/lib/validators"
import * as contactService from "@/lib/services/contact.service"
import type { EnquiryStatus } from "@/lib/repositories/contact.repo"

// ---------------------------------------------------------------------------
// POST /api/contact
//
// Public endpoint — no authentication needed.
// Status codes:
//   201 — enquiry created; returns the new row's id and createdAt
//   400 — invalid JSON body or Zod validation failure
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  let rawBody: unknown
  try {
    rawBody = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const parsed = ContactEnquiryBodySchema.safeParse(rawBody)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const enquiry = await contactService.submitEnquiry(parsed.data)

  return NextResponse.json(
    { data: { id: enquiry.id, createdAt: enquiry.createdAt } },
    { status: 201 }
  )
}

// ---------------------------------------------------------------------------
// GET /api/contact
//
// Internal endpoint — protected by Bearer token (API_SECRET_KEY).
// Optional ?status=new|read|replied filter.
//
// Status codes:
//   200 — returns { data: ContactEnquiry[] }
//   401 — missing or incorrect Bearer token
//   400 — invalid status param (not in allowed enum)
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  // --- Auth check -----------------------------------------------------------
  const authHeader = req.headers.get("authorization") ?? ""
  const token      = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : ""

  if (!process.env.API_SECRET_KEY || token !== process.env.API_SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // --- Optional status filter -----------------------------------------------
  const validStatuses = ["new", "read", "replied"] as const
  const statusParam   = req.nextUrl.searchParams.get("status")

  if (statusParam && !(validStatuses as readonly string[]).includes(statusParam)) {
    return NextResponse.json(
      { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
      { status: 400 }
    )
  }

  const status = statusParam ? (statusParam as EnquiryStatus) : undefined

  const rows = await contactService.listEnquiries({ status })
  return NextResponse.json({ data: rows })
}
