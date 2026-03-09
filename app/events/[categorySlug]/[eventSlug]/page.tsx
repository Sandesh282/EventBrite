"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { ScrollHeader } from "@/components/scroll-header"
import { getEventBySlug, getCategoryBySlug, EVENT_CATEGORIES } from "@/lib/events"
import { notFound } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { JsonLd } from "@/components/json-ld"

const LAYOUT: { col: string; row: string }[] = [
  { col: "col-span-6", row: "row-span-2" },
  { col: "col-span-4", row: "row-span-1" },
  { col: "col-span-2", row: "row-span-1" },
  { col: "col-span-2", row: "row-span-1" },
  { col: "col-span-2", row: "row-span-1" },
  { col: "col-span-2", row: "row-span-1" },
  { col: "col-span-2", row: "row-span-1" },
  { col: "col-span-4", row: "row-span-1" },
  { col: "col-span-6", row: "row-span-2" },
]

function getLayout(index: number) {
  return LAYOUT[index % LAYOUT.length]
}

export default function EventDetailPage() {
  const { categorySlug, eventSlug } = useParams()
  const event = getEventBySlug(categorySlug as string, eventSlug as string)
  const category = getCategoryBySlug(categorySlug as string)

  if (!event || !category) {
    return notFound()
  }

  const { images } = event

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.name,
    "description": event.description,
    "image": event.thumbnail,
    "organizer": {
      "@type": "Organization",
      "name": "EventBrite"
    }
  }

  return (
    <>
      <JsonLd schema={eventSchema} />
      <ScrollHeader alwaysVisible />
      <div className="min-h-screen bg-white">

        {/* Breadcrumb */}
        <div className="pt-24 pb-0 px-10 md:px-16">
          <nav className="flex items-center gap-2 text-[9px] uppercase tracking-[0.35em] text-neutral-400 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <Link href="/" className="hover:text-neutral-700 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/events" className="hover:text-neutral-700 transition-colors">Events</Link>
            <span>/</span>
            <Link href={`/events/${categorySlug}`} className="hover:text-neutral-700 transition-colors">{category.category}</Link>
            <span>/</span>
            <span className="text-neutral-700">{event.name}</span>
          </nav>
        </div>

        {/* Event header */}
        <header className="px-10 md:px-16 pt-8 pb-12 border-b border-neutral-100">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-neutral-400 mb-4">{category.category}</p>
              <h1 className="text-[clamp(3rem,8vw,7rem)] font-light text-neutral-900 leading-none tracking-[-0.02em]">
                {event.name}
              </h1>
              <p className="mt-4 text-neutral-400 text-lg font-light tracking-wider italic">Event Production Showcase</p>
            </div>
            <div className="flex gap-12 lg:gap-20 pb-1">
              {[["Year", "2023"], ["Location", "Mumbai"], ["Type", category.category]].map(([label, val]) => (
                <div key={label}>
                  <p className="text-xs uppercase tracking-[0.4em] text-neutral-300 mb-2">{label}</p>
                  <p className="text-base md:text-lg text-neutral-700 font-light">{val}</p>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* Gallery */}
        <div className="proj-gallery grid grid-cols-6">
          {images.map((img, idx) => {
            const { col, row } = getLayout(idx)
            return (
              <motion.div
                key={img}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className={`proj-card ${col} ${row} relative overflow-hidden bg-neutral-200`}
              >
                <div className="absolute inset-0 shimmer-bg" />
                <Image
                  src={img}
                  alt={`${event.name} — ${category.category} — view ${idx + 1}`}
                  width={800}
                  height={600}
                  className="img-fade absolute inset-0 w-full h-full object-cover hover:scale-[1.03] transition-transform duration-700 ease-out"
                  loading={idx < 6 ? "eager" : "lazy"}
                  quality={95}
                />
              </motion.div>
            )
          })}
        </div>

        {/* Case Study Text */}
        <article className="max-w-5xl mx-auto px-8 md:px-16 py-24">
          <section className="mb-20">
            <p className="text-[9px] uppercase tracking-[0.5em] text-neutral-300 mb-6">The Overview</p>
            <p className="text-2xl md:text-3xl lg:text-4xl font-light text-neutral-700 leading-[1.5]">{event.description}</p>
          </section>
          <hr className="border-neutral-100 mb-20" />
          <section className="mb-20">
            <p className="text-[9px] uppercase tracking-[0.5em] text-neutral-300 mb-6">The Production</p>
            <h2 className="text-3xl md:text-4xl font-light text-neutral-900 leading-snug mb-8">Crafting monumental experiences.</h2>
            <p className="text-lg md:text-xl lg:text-2xl text-neutral-500 leading-[1.8] font-light">
              EventBrite's production team approached this project with a focus on precision and brand storytelling. Leveraging our 35,000 sq. ft. in-house facility, we designed and fabricated every element to ensure a seamless and high-impact experience. From technical lighting rigs to custom scenic builds, every detail was managed with absolute precision.
            </p>
          </section>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-6 border-t border-neutral-100">
            <p className="text-[9px] uppercase tracking-[0.4em] text-neutral-400">Collaborate with our production team</p>
            <Link href="/contact" className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.35em] text-neutral-900 border-b border-neutral-900 pb-0.5 hover:text-neutral-500 hover:border-neutral-500 transition-colors duration-300">
              Get In Touch
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
            </Link>
          </div>
        </article>

        {/* More Events */}
        <section className="border-t border-neutral-100 px-10 md:px-16 py-12">
          <p className="text-[9px] uppercase tracking-[0.5em] text-neutral-300 mb-8">Related Events</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {category.events.filter(e => e.slug !== eventSlug).slice(0, 4).map(e => (
              <Link key={e.slug} href={`/events/${categorySlug}/${e.slug}`} className="group relative aspect-[4/3] overflow-hidden bg-neutral-100">
                <Image 
                  src={e.thumbnail} 
                  alt={e.name} 
                  fill
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" 
                  loading="lazy"
                  quality={85}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-[8px] uppercase tracking-[0.35em] text-white/50 mb-1">View Case Study</p>
                  <p className="text-white text-xs font-medium uppercase tracking-wide">{e.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <Footer />
      </div>

      <style>{`
        .proj-gallery {
          grid-auto-rows: 380px;
        }
        .img-fade {
          opacity: 0;
          animation: imgReveal 0.001s linear forwards;
        }
        @keyframes imgReveal {
          to { opacity: 1; }
        }
        @keyframes shimmer {
          0%   { background-position: -400% 0; }
          100% { background-position:  400% 0; }
        }
        .shimmer-bg {
          background: linear-gradient(90deg, #e0e0e0 25%, #efefef 50%, #e0e0e0 75%);
          background-size: 400% 100%;
          animation: shimmer 1.4s ease-in-out infinite;
        }
        @media (max-width: 479px) {
          .proj-gallery { grid-template-columns: 1fr !important; grid-auto-rows: 260px !important; }
          .proj-card { grid-column: span 1 !important; grid-row: span 1 !important; }
        }
        @media (min-width: 480px) and (max-width: 1023px) {
          .proj-gallery { grid-template-columns: repeat(2, 1fr) !important; grid-auto-rows: 300px !important; }
          .proj-card { grid-column: span 1 !important; grid-row: span 1 !important; }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  )
}
