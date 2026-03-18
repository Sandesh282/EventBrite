import { MetadataRoute } from 'next'
import { PROJECTS } from '@/lib/projects'
import { EVENT_CATEGORIES } from '@/lib/events'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.eventbrite.in'

  // Base routes
  const routes = ['', '/about', '/contact', '/sales-lounge', '/events'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Project routes
  const projectRoutes = PROJECTS.map((project) => ({
    url: `${baseUrl}/sales-lounge/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Event category routes
  const eventCategoryRoutes = EVENT_CATEGORIES.map((cat) => ({
    url: `${baseUrl}/events/${cat.categorySlug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Event detail routes
  const eventDetailRoutes = EVENT_CATEGORIES.flatMap((cat) =>
    cat.events.map((event) => ({
      url: `${baseUrl}/events/${cat.categorySlug}/${event.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }))
  )

  return [...routes, ...projectRoutes, ...eventCategoryRoutes, ...eventDetailRoutes]
}
