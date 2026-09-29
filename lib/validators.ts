/**
 * lib/validators.ts — Zod schemas for all API inputs.
 *
 * Centralising validation here means every route handler gets
 * the same error shape and the schemas are easy to find during
 * code reviews or interview walkthroughs.
 */

import { z } from "zod"

// ---------------------------------------------------------------------------
// GET /api/events — query param schema
//
// Key design decisions:
//   • z.coerce.number() — query params arrive as strings; coerce converts safely.
//   • limit clamped via .transform() not .max() — returning clamped data is more
//     client-friendly than rejecting the request. Classic interviewer question:
//     "what stops a client from passing limit=99999?"
//   • page minimum 1 — negative or zero pages are nonsensical; reject them early.
// ---------------------------------------------------------------------------
export const GetEventsQuerySchema = z.object({
  page:     z.coerce.number().int().min(1).default(1),
  limit:    z.coerce.number().int().min(1).default(12)
              .transform((val) => Math.min(val, 50)), // clamp to max 50, never reject
  category: z.string().min(1).optional(),             // category slug, e.g. "corporate-event"
  q:        z.string().min(1).optional(),             // ILIKE search on event name
})

export type GetEventsQuery = z.infer<typeof GetEventsQuerySchema>

// ---------------------------------------------------------------------------
// POST /api/events — request body schema
//
// Key design decisions:
//   • slug regex: /^[a-z0-9-]+$/ — enforces URL-safe slugs at validation time,
//     not just "hope the client does it right".
//   • thumbnail / images startsWith("/images/") — prevents storing external URLs
//     or absolute paths; all media lives under /public/images/.
//   • images max 50 — prevents accidental unbounded inserts in the images loop.
// ---------------------------------------------------------------------------
export const CreateEventBodySchema = z.object({
  slug:        z.string().min(2)
                 .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens only"),
  name:        z.string().min(2).max(200),
  description: z.string().min(10).max(2000),
  thumbnail:   z.string().startsWith("/images/", "Thumbnail must be a relative /images/ path"),
  categoryId:  z.number().int().positive(),
  venueId:     z.number().int().positive().optional(), // optional — not all events have a venue
  images:      z
    .array(z.string().startsWith("/images/", "Each image must be a relative /images/ path"))
    .min(1, "At least one image is required")
    .max(50, "Maximum 50 images per event"),
})

export type CreateEventBody = z.infer<typeof CreateEventBodySchema>

// ---------------------------------------------------------------------------
// POST /api/contact — request body schema
//
// Key design decisions:
//   • z.email() — uses Zod's built-in RFC-compliant email parser; no regex needed.
//   • phone regex — accepts international formats (+91 9876543210, 9876543210)
//     while rejecting obvious garbage. Optional field, so only validated when present.
//   • service enum — enforces the studio's 5 real service verticals at the API
//     boundary; prevents arbitrary strings entering the DB.
//   • message min(10) — filters out accidental button presses; max(2000) prevents
//     payload abuse.
// ---------------------------------------------------------------------------
export const SERVICE_OPTIONS = [
  "Experience Centre",
  "Marketing Office",
  "Project Office",
  "Show Apartment",
  "Sample-Up Apartment",
  "Other",
] as const

export const ContactEnquiryBodySchema = z.object({
  name:    z.string().min(2, "Name must be at least 2 characters").max(100),
  email:   z.string().email("Please enter a valid email address"),
  phone:   z
    .string()
    .regex(
      /^(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}$/,
      "Please enter a valid phone number"
    )
    .optional()
    .or(z.literal("")),   // allow empty string from uncontrolled inputs
  service: z.enum(SERVICE_OPTIONS).optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
})

export type ContactEnquiryBody = z.infer<typeof ContactEnquiryBodySchema>

// ---------------------------------------------------------------------------
// POST /api/auth/register — request body schema
//
// Key decisions:
//   • password min 8 — OWASP minimum; balance between usability and security.
//   • role enum — only 'attendee' | 'organizer' accepted at the API boundary.
//     The DB stores TEXT but we validate here so no arbitrary role strings enter.
//   • email normalised to lowercase in the service layer (not here) — Zod
//     validation should not have side effects.
// ---------------------------------------------------------------------------
export const RegisterBodySchema = z.object({
  email:    z.string().email("Please enter a valid email address"),
  name:     z.string().min(2, "Name must be at least 2 characters").max(100),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
  role:     z.enum(["attendee", "organizer"]).optional().default("attendee"),
})

export type RegisterBody = z.infer<typeof RegisterBodySchema>

// ---------------------------------------------------------------------------
// POST /api/auth/login — request body schema
// ---------------------------------------------------------------------------
export const LoginBodySchema = z.object({
  email:    z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

export type LoginBody = z.infer<typeof LoginBodySchema>

// ---------------------------------------------------------------------------
// POST /api/auth/refresh — body schema
// Refresh token is read from httpOnly cookie in the route handler,
// but we also support it in the body as a fallback (e.g. mobile clients).
// ---------------------------------------------------------------------------
export const RefreshBodySchema = z.object({
  refreshToken: z.string().min(1).optional(),
})

export type RefreshBody = z.infer<typeof RefreshBodySchema>
