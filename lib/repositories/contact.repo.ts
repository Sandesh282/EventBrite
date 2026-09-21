/**
 * lib/repositories/contact.repo.ts
 *
 * All database queries for the contact_enquiries table live here.
 * Mirrors the pattern in events.repo.ts — handlers and services
 * never import `db` directly for this domain.
 */

import { desc, eq } from "drizzle-orm"
import { db } from "@/db"
import * as schema from "@/db/schema"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type EnquiryStatus = "new" | "read" | "replied"

// ---------------------------------------------------------------------------
// create — insert a single enquiry row.
//
// Returns the generated id and createdAt via .returning() so we avoid
// a separate SELECT round-trip to get the auto-generated fields.
// ---------------------------------------------------------------------------
export async function create(data: {
  name:     string
  email:    string
  phone?:   string | null
  service?: string | null
  message:  string
}) {
  const [enquiry] = await db
    .insert(schema.contactEnquiries)
    .values({
      name:    data.name,
      email:   data.email,
      phone:   data.phone ?? null,
      service: data.service ?? null,
      message: data.message.trim(),
      status:  "new",
    })
    .returning({
      id:        schema.contactEnquiries.id,
      createdAt: schema.contactEnquiries.createdAt,
    })

  return enquiry
}

// ---------------------------------------------------------------------------
// findMany — return all enquiries, newest first.
//
// Optional status filter maps to a WHERE clause; omitting it returns all rows.
// desc(createdAt) matches how most CRM-style tools present inbound leads.
// ---------------------------------------------------------------------------
export async function findMany(opts?: { status?: EnquiryStatus }) {
  return db
    .select()
    .from(schema.contactEnquiries)
    .where(
      opts?.status
        ? eq(schema.contactEnquiries.status, opts.status)
        : undefined
    )
    .orderBy(desc(schema.contactEnquiries.createdAt))
}
