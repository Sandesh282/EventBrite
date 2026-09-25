/**
 * db/schema.ts — Drizzle ORM table definitions for EventBrite.
 *
 * ER overview:  categories ──< events >── venues
 *               events ──< event_images
 */

import { pgTable, serial, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core"
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
// INDEX on category_id: hot query path for ?category= filter (O(log n) scan).
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
  createdAt:   timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt:   timestamp("updated_at", { withTimezone: true }).defaultNow(),
})

// ---------------------------------------------------------------------------
// event_images — normalises images[] array into rows.
// position preserves gallery display order (ascending → left-to-right).
// CASCADE DELETE: removing an event removes all its images automatically.
// INDEX on event_id: every gallery fetch is a point lookup on this column.
// ---------------------------------------------------------------------------
export const eventImages = pgTable("event_images", {
  id:       serial("id").primaryKey(),
  eventId:  integer("event_id").notNull()
              .references(() => events.id, { onDelete: "cascade" }),
  url:      text("url").notNull(),
  position: integer("position").notNull().default(0), // 0-indexed display order
})

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
  category: one(categories, { fields: [events.categoryId], references: [categories.id] }),
  venue:    one(venues,     { fields: [events.venueId],    references: [venues.id]    }),
  images:   many(eventImages),
}))

export const eventImagesRelations = relations(eventImages, ({ one }) => ({
  event: one(events, { fields: [eventImages.eventId], references: [events.id] }),
}))

// ---------------------------------------------------------------------------
// enquiry_status — tracks the lifecycle of an inbound contact submission.
// Using a DB enum (not plain text) so invalid states are rejected at the DB
// level and the set of valid transitions is self-documenting.
// ---------------------------------------------------------------------------
export const enquiryStatusEnum = pgEnum("enquiry_status", ["new", "read", "replied"])

// ---------------------------------------------------------------------------
// contact_enquiries — persists every submission from POST /api/contact.
//
// Design decisions:
//   • phone is optional — not all visitors are comfortable sharing it.
//   • service is a free-text label (e.g. "Sales Lounge") rather than an FK
//     to a services table; services are static catalogue data, not DB rows.
//   • status defaults to "new" so the team can filter unread leads easily.
//   • No FK back to events/categories — enquiries are independent leads.
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

export type ContactEnquiry = typeof contactEnquiries.$inferSelect
export type NewContactEnquiry = typeof contactEnquiries.$inferInsert
