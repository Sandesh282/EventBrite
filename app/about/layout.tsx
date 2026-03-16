import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About EventBrite | Real Estate Marketing Studio Mumbai',
  description:
    'Learn about EventBrite, Mumbai\'s leading real estate marketing studio. With over 10 years of experience and a 35,000 sq. ft. facility, we specialize in Sales Lounges and Event Management.',
  keywords: [
    'about eventbrite india',
    'real estate marketing agency mumbai',
    'turnkey exhibition contractor',
    'sales lounge design company',
    'event management history',
  ],
  alternates: { canonical: 'https://www.eventbrite.in/about' },
  openGraph: {
    title: 'About EventBrite | Real Estate Marketing & Event Management',
    description:
      'From turnkey exhibition contracting to premium real estate sales lounges, learn how EventBrite has become a trusted partner for India\'s leading developers.',
    url: 'https://www.eventbrite.in/about',
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
