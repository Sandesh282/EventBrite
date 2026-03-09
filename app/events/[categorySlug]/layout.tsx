import { EVENT_CATEGORIES } from "@/lib/events"
import { Metadata } from "next"

type Props = {
  params: Promise<{ categorySlug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug } = await params
  const category = EVENT_CATEGORIES.find((c) => c.categorySlug === categorySlug)

  if (!category) {
    return {
      title: "Category Not Found",
    }
  }

  const title = `${category.category} | Event Production & Management India`
  const description = `${category.description.substring(0, 160)}`
  const url = `https://www.eventbrite.in/events/${categorySlug}`

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
          url: category.events[0]?.thumbnail || "/images/og-default.jpg",
          width: 1200,
          height: 630,
          alt: category.category,
        },
      ],
    },
  }
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
