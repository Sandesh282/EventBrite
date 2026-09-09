import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact EventBrite | Get a Quote for Your Next Project',
  description:
    'Ready to transform your real estate marketing or plan a large-scale event? Contact EventBrite today for a consultation on Sales Lounges, Experience Centres, and Event Production.',
  keywords: [
    'contact eventbrite mumbai',
    'real estate marketing consultation',
    'event management quote',
    'sales lounge design inquiry',
    'eventbrite office location',
  ],
  alternates: { canonical: 'https://www.eventbrite.in/contact' },
  openGraph: {
    title: 'Contact EventBrite | Real Estate Marketing & Event Management',
    description:
      'Get in touch with our expert team in Mumbai to discuss your next sales lounge design or large-scale event production.',
    url: 'https://www.eventbrite.in/contact',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
