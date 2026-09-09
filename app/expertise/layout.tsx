import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Services',
  description:
    'Comprehensive real estate marketing services: Experience Centres, Sales Lounges, Show Apartments, Sample Apartments, Site Branding, Signage, Bhoomi Poojan, and Channel Partner Events across India.',
  keywords: [
    'experience centre design mumbai',
    'show apartment interior design india',
    'sales lounge design',
    'site branding signage',
    'bhoomi poojan event management',
    'channel partner meet mumbai',
    'real estate marketing services india',
  ],
  alternates: { canonical: 'https://www.eventbrite.in/expertise' },
  openGraph: {
    title: 'Our Services | Sales Lounges, Experience Centres & Events | EventBrite',
    description:
      'From Experience Centres and Show Apartments to Site Branding and Channel Partner Events — EventBrite delivers end-to-end real estate marketing solutions.',
    url: 'https://www.eventbrite.in/expertise',
  },
}

export default function ExpertiseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
