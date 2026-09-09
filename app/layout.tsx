import type { Metadata, Viewport } from 'next'
import { Jost, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

const SITE_URL = 'https://www.eventbrite.in'
const SITE_NAME = 'EventBrite'
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-default.jpg`

export const metadata: Metadata = {
  // ── Core ────────────────────────────────────────────────────────────────────
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'EventBrite | Real Estate Marketing Studio & Event Management Mumbai',
    template: '%s | EventBrite India',
  },
  description:
    'EventBrite is India\'s premier real estate marketing studio and turnkey event management company. We specialize in Sales Lounges, Experience Centres, Show Apartments, and large-scale corporate, brand, and sports events across India.',
  keywords: [
    'real estate marketing agency mumbai',
    'sales lounge design india',
    'experience centre designer mumbai',
    'turnkey exhibition contractor india',
    'event management company mumbai',
    'brand launch event agency india',
    'corporate events mumbai',
    'show apartment interior design india',
    'site branding real estate mumbai',
    'eventbrite india marketing',
    'premium event production mumbai',
    'real estate exhibition stall design',
  ],
  authors: [{ name: 'EventBrite', url: SITE_URL }],
  creator: 'EventBrite',
  publisher: 'EventBrite',
  category: 'Real Estate Marketing & Event Management',

  // ── Open Graph ──────────────────────────────────────────────────────────────
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'EventBrite | Real Estate Marketing & Event Management Mumbai',
    description:
      'Mumbai\'s premier real estate marketing studio. Sales Lounges, Experience Centres, Show Apartments, Corporate & Brand events across India.',
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'EventBrite — Real Estate Marketing & Event Management',
      },
    ],
  },

  // ── Twitter / X ─────────────────────────────────────────────────────────────
  twitter: {
    card: 'summary_large_image',
    title: 'EventBrite | Real Estate Marketing & Event Management Mumbai',
    description:
      'Mumbai\'s premier real estate marketing studio. Sales Lounges, Experience Centres, Show Apartments, Corporate & Brand events across India.',
    images: [DEFAULT_OG_IMAGE],
    creator: '@eventbritein',
  },

  // ── Robots ──────────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // ── Canonical / Alternates ──────────────────────────────────────────────────
  alternates: {
    canonical: SITE_URL,
  },

  // ── Icons ───────────────────────────────────────────────────────────────────
  icons: {
    icon: '/images/logo.webp',
    apple: '/images/logo.webp',
    shortcut: '/images/logo.webp',
  },

  // ── Verification ────────────────────────────────────────────────────────────
  // Add your Google Search Console verification token here when you have it:
  // verification: { google: 'YOUR_TOKEN_HERE' },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
}

// ── JSON-LD Structured Data ──────────────────────────────────────────────────
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'LocalBusiness'],
  name: 'EventBrite',
  alternateName: 'EventBrite India',
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.webp`,
  image: DEFAULT_OG_IMAGE,
  description:
    'Mumbai\'s leading real estate marketing studio specialising in Sales Lounges, Experience Centres, Show Apartments, and corporate & brand event management.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Mumbai',
    addressRegion: 'Maharashtra',
    addressCountry: 'IN',
  },
  areaServed: {
    '@type': 'Country',
    name: 'India',
  },
  knowsAbout: [
    'Real Estate Sales Lounge Design',
    'Experience Centre Design',
    'Show Apartment Interior Design',
    'Corporate Event Management',
    'Brand Launch Events',
    'Exhibition Contracting',
    'Site Branding & Signage',
  ],
  sameAs: [
    // Add your social profiles here:
    // 'https://www.instagram.com/eventbritein',
    // 'https://www.linkedin.com/company/eventbritein',
  ],
}

import { ThemeProvider } from '@/components/theme-provider'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${jost.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="font-sans antialiased overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
