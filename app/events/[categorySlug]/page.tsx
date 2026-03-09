"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { ScrollHeader } from "@/components/scroll-header"
import { getCategoryBySlug } from "@/lib/events"
import { notFound } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"

function getColSpan(i: number, total: number) {
  const rem = total % 3
  if (rem === 1 && i === total - 1) return "col-span-6"
  if (rem === 2 && i >= total - 2)  return "col-span-3"
  return "col-span-2"
}

function getAspect(i: number, total: number) {
  const rem = total % 3
  if (rem === 1 && i === total - 1) return "aspect-[21/9]"
  if (rem === 2 && i >= total - 2)  return "aspect-[3/2]"
  return "aspect-[4/3]"
}

export default function CategoryPage() {
  const { categorySlug } = useParams()
  const category = getCategoryBySlug(categorySlug as string)

  if (!category) {
    return notFound()
  }

  const list = category.events

  return (
    <>
      <ScrollHeader alwaysVisible />
      <div className="min-h-screen bg-white">

        <header className="pt-28 pb-10 px-10 md:px-16 flex items-end justify-between border-b border-neutral-100">
          <div>
            <p className="text-[9px] uppercase tracking-[0.5em] text-neutral-400 mb-3">
              <Link href="/events" className="hover:text-neutral-900 transition-colors">Events</Link> / {category.category}
            </p>
            <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-light text-neutral-900 leading-none tracking-[-0.02em]">
              {category.category}
            </h1>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-[9px] uppercase tracking-[0.35em] text-neutral-400 mb-1">{list.length} Projects</p>
            <p className="text-[9px] uppercase tracking-[0.35em] text-neutral-900 font-medium">EventBrite Portfolio</p>
          </div>
        </header>

        <div className="sl-grid grid grid-cols-6">
          {list.map((event, i) => {
            const colSpan = getColSpan(i, list.length)
            const aspect  = getAspect(i, list.length)
            return (
              <Link
                key={event.slug}
                href={`/events/${category.categorySlug}/${event.slug}`}
                className={`sl-card ${colSpan} ${aspect} group relative overflow-hidden bg-neutral-200 cursor-pointer`}
              >
                <Image 
                  src={event.thumbnail} 
                  alt={event.name}
                  fill
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-700 scale-100 group-hover:scale-110"
                  quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                  <p className="text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-white/50 mb-1 md:mb-1.5 font-light">Event Case Study</p>
                  <h2 className="text-white text-xs md:text-sm font-medium uppercase tracking-[0.08em] leading-snug">{event.name}</h2>
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="h-px w-0 group-hover:w-10 bg-white/35 transition-all duration-500 delay-100" />
                </div>
              </Link>
            )
          })}
        </div>

        <div className="flex items-center justify-between px-10 md:px-16 py-8 border-t border-neutral-100">
          <p className="text-[9px] uppercase tracking-[0.4em] text-neutral-300">End of Category</p>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.35em] text-neutral-400 hover:text-neutral-900 transition-colors duration-300"
          >
            All Categories
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
          </Link>
        </div>

        <article className="max-w-5xl mx-auto px-10 md:px-16 py-24 border-t border-neutral-100">
           <section>
            <p className="text-[9px] uppercase tracking-[0.5em] text-neutral-300 mb-6">About {category.category}</p>
            <p className="text-2xl md:text-3xl lg:text-4xl font-light text-neutral-700 leading-[1.5]">
              {category.description}
            </p>
          </section>
        </article>

        <Footer />
      </div>

      <style>{`
        @media (max-width: 479px) {
          .sl-grid { grid-template-columns: 1fr !important; }
          .sl-card { grid-column: span 1 !important; aspect-ratio: 4/3 !important; }
        }
        @media (min-width: 480px) and (max-width: 1023px) {
          .sl-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .sl-card { grid-column: span 1 !important; aspect-ratio: 4/3 !important; }
        }
      `}</style>
    </>
  )
}
