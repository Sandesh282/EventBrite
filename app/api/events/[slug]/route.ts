/**
 * app/api/events/[slug]/route.ts
 *
 * GET /api/events/:slug — single event with all relations joined.
 *
 * This is the join query most worth explaining in an interview:
 *   events → categories (many-to-one, required)
 *   events → venues     (many-to-one, optional)
 *   events → event_images (one-to-many, ordered by position)
 *
 * Rather than 3 separate queries, we use Drizzle's relational query
 * builder which compiles to a single efficient JOIN under the hood.
 */

import { NextRequest, NextResponse } from "next/server"
import { eq, asc } from "drizzle-orm"
import { db } from "@/db"
import * as schema from "@/db/schema"

type RouteParams = { params: Promise<{ slug: string }> }

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { slug } = await params

  // db.query.* uses the relations defined in schema.ts to produce a
  // type-safe joined fetch — no manual JOIN SQL required.
  // images are ordered ascending by position to preserve gallery order.
  const event = await db.query.events.findFirst({
    where: eq(schema.events.slug, slug),
    with: {
      category: {
        columns: { id: true, name: true, slug: true, description: true },
      },
      venue: {
        columns: { id: true, name: true, city: true },
      },
      images: {
        columns: { url: true, position: true },
        orderBy: [asc(schema.eventImages.position)],
      },
    },
  })

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 })
  }

  // Flatten images into a plain string[] to match the original Event interface
  // that the rest of the frontend already expects.
  const { images: imageRows, ...rest } = event
  const response = {
    ...rest,
    images: imageRows.map((img) => img.url),
  }

  return NextResponse.json({ data: response })
}
