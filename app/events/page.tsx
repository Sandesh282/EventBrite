"use client"

import { useState } from "react"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { ScrollHeader } from "@/components/scroll-header"
import { EVENT_CATEGORIES } from "@/lib/events"
import Image from "next/image"

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

export default function EventsPage() {
  const categories = EVENT_CATEGORIES

  return (
    <>
      <ScrollHeader alwaysVisible />
      <div className="min-h-screen bg-white">

        <header className="pt-28 pb-10 px-10 md:px-16 flex items-end justify-between border-b border-neutral-100">
          <div>
            <p className="text-[9px] uppercase tracking-[0.5em] text-neutral-400 mb-3">Event Production</p>
            <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-light text-neutral-900 leading-none tracking-[-0.02em]">
              Events
            </h1>
          </div>
          <a
            href="https://drive.google.com/drive/folders/1lX81Vzuk-VKDSTBaGabCgLsnsLJXRmGq"
            target="_blank" rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.35em] text-neutral-400 hover:text-neutral-900 transition-colors duration-300 pb-1 border-b border-neutral-200 hover:border-neutral-900"
          >
            View Drive
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
          </a>
        </header>

        <div className="sl-grid grid grid-cols-6">
          {categories.map((cat, i) => {
            const colSpan = getColSpan(i, categories.length)
            const aspect  = getAspect(i, categories.length)
            return (
              <Link
                key={cat.categorySlug}
                href={`/events/${cat.categorySlug}`}
                className={`sl-card ${colSpan} ${aspect} group relative overflow-hidden bg-neutral-200 cursor-pointer`}
              >
                <Image
                  src={cat.events[0]?.thumbnail || "/images/placeholder.jpg"}
                  alt={cat.category}
                  fill
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(.25,.46,.45,.94)] group-hover:scale-[1.05]"
                  quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                  <p className="text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-white/50 mb-1 md:mb-1.5 font-light">Experience</p>
                  <h2 className="text-white text-xs md:text-sm font-medium uppercase tracking-[0.08em] leading-snug">{cat.category}</h2>
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="h-px w-0 group-hover:w-10 bg-white/35 transition-all duration-500 delay-100" />
                </div>
              </Link>
            )
          })}
        </div>

        <div className="flex items-center justify-between px-10 md:px-16 py-8 border-t border-neutral-100">
          <p className="text-[9px] uppercase tracking-[0.4em] text-neutral-300">{categories.length} Categories</p>
          <p className="text-[9px] uppercase tracking-[0.4em] text-neutral-300">EventBrite Production</p>
        </div>

        <article className="max-w-5xl mx-auto px-10 md:px-16 py-24 border-t border-neutral-100">
          <section className="mb-20">
            <p className="text-[9px] uppercase tracking-[0.5em] text-neutral-300 mb-6">Our Capabilities</p>
            <p className="text-2xl md:text-3xl lg:text-4xl font-light text-neutral-700 leading-[1.5]">
              EventBrite specializes in delivering world-class production for global brands. Our portfolio includes collaborations with <strong>Audi, HP, Reliance, and Viacom</strong>, spanning from high-octane product launches to large-scale cultural festivals.
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
