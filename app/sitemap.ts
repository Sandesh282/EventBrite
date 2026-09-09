/**
 * app/sitemap.ts
 *
 * force-dynamic defers sitemap generation to request time.
 * Without this, Next.js runs the function at build time — which
 * would fail if DATABASE_URL isn't set in the CI/build environment.
 */

export const dynamic = "force-dynamic"

import { MetadataRoute } from "next"
import { asc } from "drizzle-orm"
import { db } from "@/db"
import * as schema from "@/db/schema"
import { PROJECTS } from "@/lib/projects"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.eventbrite.in"

  // Base routes — static, no DB needed
  const routes = ["", "/about", "/contact", "/sales-lounge", "/events"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }))

  // Project routes — still from static data (intentionally deferred)
  const projectRoutes = PROJECTS.map((project) => ({
    url: `${baseUrl}/sales-lounge/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  // Fetch all categories and events from DB for event routes
  const categoriesWithEvents = await db.query.categories.findMany({
    orderBy: [asc(schema.categories.id)],
    with: {
      events: {
        columns: { slug: true },
        orderBy: [asc(schema.events.id)],
      },
    },
  })

  // Event category routes — one URL per category
  const eventCategoryRoutes = categoriesWithEvents.map((cat) => ({
    url: `${baseUrl}/events/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  // Event detail routes — one URL per event (nested under category)
  const eventDetailRoutes = categoriesWithEvents.flatMap((cat) =>
    cat.events.map((event) => ({
      url: `${baseUrl}/events/${cat.slug}/${event.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }))
  )

  return [...routes, ...projectRoutes, ...eventCategoryRoutes, ...eventDetailRoutes]
}
