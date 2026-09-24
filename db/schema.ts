/**
 * db/schema.ts — Drizzle ORM table definitions for EventBrite.
 *
 * ER overview (Phase 1 + Phase 2):
 *
 *   categories ──< events >── venues
 *   events ──< event_images
 *   users ──< registrations >── events
 *   contact_enquiries   (standalone)
 *
 * Phase 2 additions:
 *   • users               — identity table for attendees and organizers
 *   • events.capacity     — maximum confirmed registrations (NULL = unlimited)
 *   • events.start_at     — event start datetime (required)
 *   • events.end_at       — event end datetime (required, registration closes here)
 *   • events.status       — lifecycle: 'draft' | 'published' | 'cancelled'
 *   • registrations       — join table linking users to events they signed up for
 */

import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// ---------------------------------------------------------------------------
// categories — event types shown as navigation tiles ("Corporate Events" etc.)
// slug is the URL-safe identifier used in routes and ?category= filter.
// UNIQUE constraint at DB level so it can be a stable FK-free lookup key.
// ---------------------------------------------------------------------------
export const categories = pgTable("categories", {
  id:          serial("id").primaryKey(),
  name:        text("name").notNull(),
  slug:        text("slug").notNull().unique(),        // e.g. "corporate-event"
  description: text("description").notNull(),
  createdAt:   timestamp("created_at", { withTimezone: true }).defaultNow(),
})

// ---------------------------------------------------------------------------
// venues — first-class entity so we can later query "all events at venue X"
// without brittle name-string matching. city defaults to "Mumbai".
// ---------------------------------------------------------------------------
export const venues = pgTable("venues", {
  id:        serial("id").primaryKey(),
  name:      text("name").notNull(),
  city:      text("city").notNull().default("Mumbai"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
})

// ---------------------------------------------------------------------------
// events — core table.
//
// FK behaviour is intentionally asymmetric:
//   category_id → RESTRICT  : cannot delete a category that owns events.
//                              Forces explicit cleanup; prevents orphaned rows.
//   venue_id    → SET NULL  : deleting a venue just clears the FK column.
//                              The event record survives (venue is optional metadata).
//
// Phase 2 additions:
//   capacity  — NULL means unlimited registrations allowed.
//               Checked transactionally during registration (Phase 4).
//   start_at  — Event start time. Stored with timezone for correctness across
//               regions. Required so registration logic can reason about timing.
//   end_at    — Registration closes at this time. Registering after end_at → 400.
//   status    — TEXT not a PG enum because this set is likely to evolve
//               (e.g. 'postponed', 'sold_out'). Validated at application layer
//               via Zod enum; PG stores the string.
//               Tradeoff: PG enum = stricter DB constraint but painful to migrate.
//               TEXT + app-level validation = flexible, easier to extend.
// ---------------------------------------------------------------------------
export const events = pgTable("events", {
  id:          serial("id").primaryKey(),
  slug:        text("slug").notNull().unique(),         // globally unique across all categories
  name:        text("name").notNull(),
  description: text("description").notNull(),
  thumbnail:   text("thumbnail").notNull(),             // relative path "/images/events/..."
  categoryId:  integer("category_id").notNull()
                 .references(() => categories.id, { onDelete: "restrict" }),
  venueId:     integer("venue_id")
                 .references(() => venues.id, { onDelete: "set null" }), // nullable
  // --- Phase 2 additions ---
  capacity:    integer("capacity"),                     // NULL = unlimited
  startAt:     timestamp("start_at", { withTimezone: true }).notNull()
                 .default(new Date("2024-01-01T09:00:00Z")), // default for backfilling existing rows
  endAt:       timestamp("end_at",   { withTimezone: true }).notNull()
                 .default(new Date("2024-12-31T23:59:00Z")),
  status:      text("status").notNull().default("published"), // 'draft'|'published'|'cancelled'
  createdAt:   timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt:   timestamp("updated_at", { withTimezone: true }).defaultNow(),
})

// ---------------------------------------------------------------------------
// event_images — normalises images[] array into rows.
// position preserves gallery display order (ascending → left-to-right).
// CASCADE DELETE: removing an event removes all its images automatically.
// ---------------------------------------------------------------------------
export const eventImages = pgTable("event_images", {
  id:       serial("id").primaryKey(),
  eventId:  integer("event_id").notNull()
              .references(() => events.id, { onDelete: "cascade" }),
  url:      text("url").notNull(),
  position: integer("position").notNull().default(0), // 0-indexed display order
})

// ---------------------------------------------------------------------------
// users — identity table for attendees and organizers.
//
// Design decisions:
//   • email UNIQUE — login identifier; also enforces one account per address.
//   • password_hash — bcrypt hash (work factor ≥ 12). Plaintext never stored.
//   • role — TEXT not a PG enum. Roles may expand ('admin', 'staff').
//     Zod enum validates at the API boundary; the DB stores the string.
//   • No FK to events — a user can exist without owning any events.
//
// Index: unique index on email created automatically by .unique() above.
// ---------------------------------------------------------------------------
export const users = pgTable("users", {
  id:           serial("id").primaryKey(),
  email:        text("email").notNull().unique(),
  name:         text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role:         text("role").notNull().default("attendee"), // 'attendee' | 'organizer'
  createdAt:    timestamp("created_at", { withTimezone: true }).defaultNow(),
})

// ---------------------------------------------------------------------------
// registrations — join table linking users ↔ events.
//
// Design decisions:
//   • UNIQUE(event_id, user_id) — hard DB-level guarantee against duplicate
//     registrations. Even if application code has a bug, the DB rejects the
//     second insert with error code 23505. This is a second line of defence
//     after the SELECT FOR UPDATE check in the registration service (Phase 4).
//   • status — 'confirmed' or 'cancelled'. We soft-delete (set status =
//     'cancelled') rather than hard-delete so we preserve the history of who
//     registered and when, which is useful for organisers.
//   • ON DELETE CASCADE (event_id) — removing an event purges registrations.
//   • ON DELETE CASCADE (user_id)  — removing a user purges their registrations.
// ---------------------------------------------------------------------------
export const registrations = pgTable(
  "registrations",
  {
    id:        serial("id").primaryKey(),
    eventId:   integer("event_id").notNull()
                 .references(() => events.id, { onDelete: "cascade" }),
    userId:    integer("user_id").notNull()
                 .references(() => users.id, { onDelete: "cascade" }),
    status:    text("status").notNull().default("confirmed"), // 'confirmed' | 'cancelled'
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    // Composite unique index — the primary correctness guarantee against
    // duplicate registrations. Drizzle generates:
    //   CREATE UNIQUE INDEX registrations_event_user_uidx ON registrations(event_id, user_id)
    uniqueIndex("registrations_event_user_uidx").on(table.eventId, table.userId),
  ]
)

// ---------------------------------------------------------------------------
// Relations — used by Drizzle's db.query.* relational API for type-safe joins.
// ---------------------------------------------------------------------------
export const categoriesRelations = relations(categories, ({ many }) => ({
  events: many(events),
}))

export const venuesRelations = relations(venues, ({ many }) => ({
  events: many(events),
}))

export const eventsRelations = relations(events, ({ one, many }) => ({
  category:      one(categories,    { fields: [events.categoryId], references: [categories.id] }),
  venue:         one(venues,        { fields: [events.venueId],    references: [venues.id]    }),
  images:        many(eventImages),
  registrations: many(registrations),
}))

export const eventImagesRelations = relations(eventImages, ({ one }) => ({
  event: one(events, { fields: [eventImages.eventId], references: [events.id] }),
}))

export const usersRelations = relations(users, ({ many }) => ({
  registrations: many(registrations),
}))

export const registrationsRelations = relations(registrations, ({ one }) => ({
  event: one(events, { fields: [registrations.eventId], references: [events.id] }),
  user:  one(users,  { fields: [registrations.userId],  references: [users.id]  }),
}))

// ---------------------------------------------------------------------------
// enquiry_status — tracks the lifecycle of an inbound contact submission.
// Using a DB enum (not plain text) so invalid states are rejected at the DB
// level and the set of valid transitions is self-documenting.
// ---------------------------------------------------------------------------
export const enquiryStatusEnum = pgEnum("enquiry_status", ["new", "read", "replied"])

// ---------------------------------------------------------------------------
// contact_enquiries — persists every submission from POST /api/contact.
// ---------------------------------------------------------------------------
export const contactEnquiries = pgTable("contact_enquiries", {
  id:        serial("id").primaryKey(),
  name:      text("name").notNull(),
  email:     text("email").notNull(),
  phone:     text("phone"),                                          // optional
  service:   text("service"),                                        // e.g. "Sales Lounge"
  message:   text("message").notNull(),
  status:    enquiryStatusEnum("status").notNull().default("new"),   // lifecycle state
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
})

// ---------------------------------------------------------------------------
// Exported types
// ---------------------------------------------------------------------------
export type ContactEnquiry    = typeof contactEnquiries.$inferSelect
export type NewContactEnquiry = typeof contactEnquiries.$inferInsert
export type User              = typeof users.$inferSelect
export type NewUser           = typeof users.$inferInsert
export type Registration      = typeof registrations.$inferSelect
export type NewRegistration   = typeof registrations.$inferInsert
