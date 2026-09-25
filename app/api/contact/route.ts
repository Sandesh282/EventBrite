/**
 * app/api/contact/route.ts
 *
 * POST /api/contact  — submit a new enquiry (public, no auth required)
 * GET  /api/contact  — list all enquiries (auth-protected, for internal use)
 *
 * Response envelope matches /api/events:
 *   Success → { data: T }
 *   Error   → { error: string, details?: ZodFlatError }
 */

import { NextRequest, NextResponse } from "next/server"
import { desc, eq } from "drizzle-orm"
import { db } from "@/db"
import * as schema from "@/db/schema"
import { ContactEnquiryBodySchema } from "@/lib/validators"

// ---------------------------------------------------------------------------
// POST /api/contact
//
// Public endpoint — no authentication needed.
// Validates the request body with Zod, then inserts a single row into
// contact_enquiries with status = "new".
//
// Status codes:
//   201 — enquiry created; returns the new row's id and createdAt
//   400 — invalid JSON body or Zod validation failure
//   500 — unexpected DB error (re-thrown so Next.js logs it)
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  // --- Parse body -----------------------------------------------------------
  let rawBody: unknown
  try {
    rawBody = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  // --- Zod validation -------------------------------------------------------
  // safeParse never throws — it returns { success, data } or { success, error }.
  // We surface field-level details so the front-end can show inline errors
  // without a second round-trip to figure out which field failed.
  const parsed = ContactEnquiryBodySchema.safeParse(rawBody)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { name, email, phone, service, message } = parsed.data

  // --- DB insert ------------------------------------------------------------
  // Inserting a single row — no transaction needed (no related tables).
  // .returning() avoids a second SELECT and gives us the generated id + timestamp.
  const [enquiry] = await db
    .insert(schema.contactEnquiries)
    .values({
      name,
      email,
      // Normalise: treat empty string the same as absent (store NULL)
      phone:   phone && phone.trim() !== "" ? phone.trim() : null,
      service: service ?? null,
      message: message.trim(),
      status:  "new",
    })
    .returning({
      id:        schema.contactEnquiries.id,
      createdAt: schema.contactEnquiries.createdAt,
    })

  return NextResponse.json({ data: { id: enquiry.id, createdAt: enquiry.createdAt } }, { status: 201 })
}

// ---------------------------------------------------------------------------
// GET /api/contact
//
// Internal endpoint — protected by Bearer token (same API_SECRET_KEY used
// by POST /api/events). Returns all enquiries ordered newest-first.
//
// Optional query params:
//   ?status=new|read|replied  — filter by enquiry lifecycle status
//
// Status codes:
//   200 — returns { data: ContactEnquiry[] }
//   401 — missing or incorrect Bearer token
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  // --- Auth check -----------------------------------------------------------
  // Simple Bearer token auth — sufficient for a portfolio API.
  // Production would use JWTs or OAuth, but the pattern is identical.
  const authHeader = req.headers.get("authorization") ?? ""
  const token      = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : ""

  if (!process.env.API_SECRET_KEY || token !== process.env.API_SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // --- Optional status filter -----------------------------------------------
  const statusParam = req.nextUrl.searchParams.get("status")
  const validStatuses = ["new", "read", "replied"] as const
  type EnquiryStatus = (typeof validStatuses)[number]

  const statusFilter =
    statusParam && (validStatuses as readonly string[]).includes(statusParam)
      ? (statusParam as EnquiryStatus)
      : null

  // --- Query ----------------------------------------------------------------
  // desc(createdAt) → newest enquiries first, matching how most CRM-style
  // tools present inbound leads.
  const rows = await db
    .select()
    .from(schema.contactEnquiries)
    .where(statusFilter ? eq(schema.contactEnquiries.status, statusFilter) : undefined)
    .orderBy(desc(schema.contactEnquiries.createdAt))

  return NextResponse.json({ data: rows })
}
