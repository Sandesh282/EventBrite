<div align="center">

# EventBrite

### Where Spaces Tell Stories

**India's premier real estate marketing studio — crafting Sales Lounges, Experience Centres, Show Apartments, and large-scale events that stop people in their tracks.**

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?logo=framer&logoColor=white)](https://www.framer.com/motion)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com)

</div>

---

## What Is EventBrite?

EventBrite is a Mumbai-based real estate marketing studio with 25 years of turning empty spaces into powerful brand moments. They've designed over 200 Sales Lounges, Experience Centres, and Show Apartments for India's top developers — and managed everything from intimate product launches to large-scale sports events.

This repository is the studio's official marketing website — built to match the same standard of excellence they bring to every physical space they design.

> **The site doesn't just display work. It *performs* it.** Every scroll triggers a choreographed animation. Every section has a story arc. The landing experience is cinematic — full-screen video, overlaid text that fades in with precision, and a parallax system that makes pages feel alive as you navigate through them.

---

## Feature Highlights

### Cinematic Landing Experience
- **Full-screen background video** with custom play/pause controls
- **Animated landing overlay** — layered text and brand elements that fade in on load
- **Asset preloader** — critical media loaded silently before the first frame renders
- **Page transition system** — smooth crossfades between routes, no jarring jumps

### Scroll-Driven Parallax & Animations
- **Unified parallax engine** — sections respond to scroll with staggered, depth-layered motion built on Framer Motion
- **Scroll header** — navbar hides/reveals based on scroll direction and speed
- **Scroll-based counter animation** — stats count up from zero as they enter the viewport
- **Per-card staggered reveals** — service and team cards animate in with individual delay offsets

### Sales Lounge Gallery
- **Full project showcase** — every completed sales lounge presented as a dedicated portfolio piece
- **Dynamic slug routing** — `/sales-lounge/[slug]` for SEO-indexed individual project pages
- **WebP-optimised images** — all assets converted and renamed via bundled Python scripts
- **Lightbox-style gallery** — fullscreen image browsing with keyboard navigation

### Events Section
- **Category-based event listing** — browsable by event type (corporate, brand, sports, and more)
- **Dynamic nested routing** — `/events/[categorySlug]/[eventSlug]` structure
- **Rich event data model** — titles, descriptions, galleries, dates, and client metadata
- **Events layout wrapper** — consistent header and metadata across all event pages

### Services & Expertise
- **5 core service verticals** — Experience Centre, Marketing Office, Project Office, Show Apartment, Sample-Up Apartment
- **Hover-animated service cards** — gradient overlays, scale transforms, and image zoom on interaction
- **Dedicated `/expertise` page** — deep-dive into methodology and approach

### About, Team & Testimonials
- **Immersive About section** — company story with parallax image and animated reveal
- **Team grid** — grayscale-to-colour hover effect, role labels, smooth transitions
- **Testimonials carousel** — client quotes with Embla Carousel, autoplay, and touch support
- **Client logo section** — partner brand grid with fade-in stagger

### Performance & SEO
- **Full Next.js 16 App Router** with server components and edge-ready rendering
- **Comprehensive metadata** — title templates, Open Graph tags, Twitter cards, and canonical URLs per route
- **JSON-LD structured data** — `Organization` + `LocalBusiness` schema.org markup on every page
- **`robots.ts` + `sitemap.ts`** — auto-generated and always in sync with route structure
- **Google Fonts via `next/font`** — Jost (body) and Playfair Display (headings), zero layout shift

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
