<div align="center">

# EventBrite

### Where Spaces Tell Stories

**A premier real estate marketing studio crafting Sales Lounges, Experience Centres, Show Apartments, and corporate events across India.**

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?logo=framer&logoColor=white)](https://www.framer.com/motion)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com)

</div>

---

## What Is EventBrite?

EventBrite is a Mumbai-based real estate marketing studio with over 25 years of experience turning empty spaces into immersive brand experiences. The studio has executed 200+ Sales Lounges, Experience Centres, and Show Apartments for top developers across India.

This repository contains the studio's official web application, designed to showcase portfolio projects, interactive experience centers, and corporate event showcases.

> **Built for performance and visual impact.** Features full-screen video backgrounds, smooth parallax scrolling, dynamic routing, and custom Framer Motion animations.

---

## Feature Highlights

### Cinematic Landing Experience
- **Full-screen background video** with custom play and pause controls
- **Animated landing overlay** with layered typography and smooth entry transitions
- **Asset preloader** ensuring smooth video and image rendering on initial load
- **Page transition system** providing fluid crossfades across App Router routes

### Scroll-Driven Parallax & Animations
- **Unified parallax engine** with staggered, depth-layered motion built on Framer Motion
- **Scroll header** with navbar hide/reveal logic based on scroll direction
- **Scroll-based counter animation** for key statistics and project metrics
- **Staggered section reveals** for service and team components

### Sales Lounge Gallery
- **Full project showcase** presenting completed sales lounges as portfolio items
- **Dynamic slug routing** (`/sales-lounge/[slug]`) for individual project pages
- **WebP-optimized images** with asset pipeline conversion scripts
- **Lightbox gallery** with image modal view and navigation controls

### Events Section
- **Category-based event listing** browsable by event type (corporate, brand, sports)
- **Dynamic nested routing** using `/events/[categorySlug]/[eventSlug]`
- **Rich event data model** covering titles, descriptions, galleries, and metadata
- **Events layout wrapper** providing consistent headers across event pages

### Services & Expertise
- **5 core service verticals**: Experience Centre, Marketing Office, Project Office, Show Apartment, and Sample-Up Apartment
- **Hover-animated service cards** with gradient overlays and scale transitions
- **Dedicated `/expertise` page** detailing methodology and design process

### About, Team & Testimonials
- **Immersive About section** featuring brand history and interactive elements
- **Team grid** with grayscale hover effects and role details
- **Testimonials carousel** built with Embla Carousel and touch gestures
- **Client logo grid** displaying brand partner showcases

### Performance & SEO
- **Next.js 16 App Router** with Server Components
- **Comprehensive metadata** including Open Graph, Twitter cards, and canonical URLs
- **JSON-LD structured data** with `Organization` and `LocalBusiness` schema markup
- **`robots.ts` & `sitemap.ts`** auto-generated for search engine indexing
- **Google Fonts via `next/font`** (Jost & Playfair Display) for optimized typography

---ody) and Playfair Display (headings), zero layout shift

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5.7 |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion 12 |
| Components | shadcn/ui (Radix UI primitives) |
| Fonts | Jost + Playfair Display (next/font) |
| Carousel | Embla Carousel React |
| Forms | React Hook Form + Zod |
| Theme | next-themes (dark/light/system) |
| Analytics | Vercel Analytics |
| Deployment | Vercel |

---

## Project Structure

```
eventbrite/
├── app/
│   ├── about/              # About page (layout + page)
│   ├── clients/            # Clients showcase page
│   ├── contact/            # Contact page
│   ├── events/
│   │   └── [categorySlug]/
│   │       └── [eventSlug]/   # Dynamic event detail
│   ├── expertise/          # Services deep-dive page
│   ├── sales-lounge/
│   │   └── [slug]/         # Dynamic project detail
│   ├── globals.css         # Global styles & CSS tokens
│   ├── layout.tsx          # Root layout with metadata + JSON-LD
│   ├── page.tsx            # Homepage (section composition)
│   ├── robots.ts           # Auto-generated robots.txt
│   └── sitemap.ts          # Auto-generated sitemap.xml
│
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   ├── app-shell.tsx       # Hero section with video + overlay
│   ├── scroll-header.tsx   # Animated sticky navbar
│   ├── landing-overlay.tsx # Cinematic intro overlay
│   ├── sales-lounge-gallery.tsx
│   ├── services-section.tsx
│   ├── stats-section.tsx   # Animated counter section
│   ├── team-section.tsx
│   ├── testimonials-section.tsx
│   └── ...                 # 20+ more section components
│
├── lib/
│   ├── events.ts           # All events data and types
│   └── projects.ts         # All sales lounge project data
│
├── hooks/
│   ├── use-mobile.ts
│   └── use-toast.ts
│
└── public/
    ├── images/             # Project photography (WebP)
    └── videos/             # Section background videos
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Sandesh282/EventBrite.git
cd EventBrite

# Install dependencies
npm install
# or
pnpm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

### Image Utilities

Two Python utility scripts are included for asset management:

```bash
# Convert all images in a directory to WebP format
python convert_to_webp.py

# Batch rename image files to a clean numeric sequence
python rename_images.py
```

---

## Key Numbers

| Metric | Value |
|---|---|
| Years in Business | 25 |
| Projects Completed | 200+ |
| Expert Team Members | 88 |
| Prestigious Awards | 40 |
| Cities Served | Pan-India |

---

## Pages & Routes

| Route | Description |
|---|---|
| `/` | Homepage — full cinematic experience |
| `/about` | Company story and values |
| `/expertise` | Services deep-dive |
| `/events` | Event categories listing |
| `/events/[category]` | Category-specific events |
| `/events/[category]/[event]` | Individual event detail |
| `/sales-lounge` | All completed projects |
| `/sales-lounge/[slug]` | Individual project gallery |
| `/clients` | Client brand showcase |
| `/contact` | Get in touch |

---

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Deployment

The site is deployed on **Vercel** with automatic deployments on every push to `main`. Vercel Analytics is embedded for performance and engagement tracking.

```bash
# Production build validation
npm run build
npm run start
```

---

<div align="center">

**Built by [Sandesh](https://github.com/Sandesh282) · Mumbai, India**

*Real Estate Marketing & Event Management*

</div>
