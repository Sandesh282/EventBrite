import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Events Executed',
  description:
    'EventBrite has executed 500+ events across India: Brand Launches (Audi, Ford), Corporate Events (HP, Lakshaya), Doctors Conferences, Exhibitions, Political Events, Special Events, and Sports Events.',
  keywords: [
    'event management company mumbai',
    'brand launch event management india',
    'corporate event management mumbai',
    'doctors conference event management',
    'exhibition contractor mumbai',
    'sports event management india',
    'political event management',
    'special events mumbai',
    'dabang sports event',
    'HP foundation day event',
  ],
  alternates: { canonical: 'https://www.eventbrite.in/events' },
  openGraph: {
    title: 'Events Executed | Brand, Corporate, Sports & Special Events | EventBrite',
    description:
      'EventBrite has executed 500+ events — Brand Launches for Audi & Ford, Corporate events for HP, Doctors Conferences, Exhibitions, Political Rallies, and Sports Events across India.',
    url: 'https://www.eventbrite.in/events',
  },
}

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
