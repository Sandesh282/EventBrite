/**
 * app/events/[categorySlug]/[eventSlug]/layout.tsx
 *
 * generateMetadata queries the DB by event slug.
 * Event slugs are globally unique (enforced by the UNIQUE constraint in
 * the events table), so we don't need categorySlug to resolve the event —
 * the single-column lookup hits the unique index directly.
 */

import { eq } from "drizzle-orm"
import { Metadata } from "next"
import { db } from "@/db"
import * as schema from "@/db/schema"

type Props = {
  params: Promise<{ categorySlug: string; eventSlug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug, eventSlug } = await params

  // Point lookup on slug — hits the UNIQUE index, O(log n)
  const event = await db.query.events.findFirst({
    where: eq(schema.events.slug, eventSlug),
    columns: { name: true, description: true, thumbnail: true },
  })

  if (!event) {
    return { title: "Event Not Found" }
  }

  const title       = `${event.name} | Event Production Showcase`
  const description = `${event.description.substring(0, 160)}`
  const url         = `https://www.eventbrite.in/events/${categorySlug}/${eventSlug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [
        {
          url:    event.thumbnail,
          width:  1200,
          height: 630,
          alt:    event.name,
        },
      ],
    },
  }
}

export default function EventLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
