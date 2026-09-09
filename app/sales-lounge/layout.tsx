import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sales Lounge & Experience Centre Design',
  description:
    'EventBrite is India\'s premier studio for Real Estate Sales Lounges, Experience Centres, and Show Apartments. We design and execute high-conversion marketing spaces for top developers.',
  keywords: [
    'sales lounge design mumbai',
    'experience centre design india',
    'real estate marketing office',
    'show apartment interior design',
    'site branding real estate',
    'marketing office design mumbai',
    'real estate signage india',
  ],
  alternates: { canonical: 'https://www.eventbrite.in/sales-lounge' },
  openGraph: {
    title: 'Sales Lounge & Experience Centre Design Portfolio | EventBrite',
    description:
      'Explore our portfolio of award-winning Sales Lounges and Experience Centres designed for India\'s leading real estate developers.',
    url: 'https://www.eventbrite.in/sales-lounge',
  },
}

export default function SalesLoungeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
