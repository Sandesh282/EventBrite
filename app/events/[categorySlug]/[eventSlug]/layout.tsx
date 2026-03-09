import { getEventBySlug } from "@/lib/events"
import { Metadata } from "next"

type Props = {
  params: Promise<{ categorySlug: string; eventSlug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug, eventSlug } = await params
  const event = getEventBySlug(categorySlug, eventSlug)

  if (!event) {
    return {
      title: "Event Not Found",
    }
  }

  const title = `${event.name} | Event Production Showcase`
  const description = `${event.description.substring(0, 160)}`
  const url = `https://www.eventbrite.in/events/${categorySlug}/${eventSlug}`

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
          url: event.thumbnail,
          width: 1200,
          height: 630,
          alt: event.name,
        },
      ],
    },
  }
}

export default function EventLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
