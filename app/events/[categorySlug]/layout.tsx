/**
 * app/events/[categorySlug]/layout.tsx
 *
 * generateMetadata queries the DB for real category data instead of the
 * old static lookup. This ensures OG tags reflect whatever is in the DB,
 * not what's compiled into the bundle — important once content is updated
 * without a redeploy.
 */

import { eq, asc } from "drizzle-orm"
import { Metadata } from "next"
import { db } from "@/db"
import * as schema from "@/db/schema"

type Props = {
  params: Promise<{ categorySlug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug } = await params

  // Fetch category + first event thumbnail for the OG image
  const category = await db.query.categories.findFirst({
    where: eq(schema.categories.slug, categorySlug),
    with: {
      events: {
        limit: 1,
        columns: { thumbnail: true },
        orderBy: [asc(schema.events.id)],
      },
    },
  })

  if (!category) {
    return { title: "Category Not Found" }
  }

  const title       = `${category.name} | Event Production & Management India`
  const description = `${category.description.substring(0, 160)}`
  const url         = `https://www.eventbrite.in/events/${categorySlug}`

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
          url:    category.events[0]?.thumbnail || "/images/og-default.jpg",
          width:  1200,
          height: 630,
          alt:    category.name,
        },
      ],
    },
  }
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
