"use client"

import { useState } from "react"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { ScrollHeader } from "@/components/scroll-header"
import { PROJECTS } from "@/lib/projects"
import Image from "next/image"

type CategoryKey = "ALL" | "RESIDENTIAL" | "COMMERCIAL" | "TOWNSHIP"

const TABS: { key: CategoryKey; label: string }[] = [
  { key: "ALL",         label: "Gallery"     },
  { key: "RESIDENTIAL", label: "Residential" },
  { key: "COMMERCIAL",  label: "Commercial"  },
  { key: "TOWNSHIP",    label: "Township"    },
]

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

export default function SalesLoungePage() {
  const [active, setActive] = useState<CategoryKey>("ALL")
  const list = active === "ALL" ? PROJECTS : PROJECTS.filter(p => p.category === active)

  return (
    <>
      <ScrollHeader alwaysVisible />
      <div className="min-h-screen bg-background">

        <header className="pt-28 pb-10 px-10 md:px-16 flex items-end justify-between border-b border-border">
          <div>
            <p className="text-[9px] uppercase tracking-[0.5em] text-muted-foreground mb-3">Our Portfolio</p>
            <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-light text-foreground leading-none tracking-[-0.02em]">
              Sales Lounge
            </h1>
          </div>
          <a
            href="https://drive.google.com/drive/folders/1lX81Vzuk-VKDSTBaGabCgLsnsLJXRmGq"
            target="_blank" rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.35em] text-muted-foreground hover:text-foreground transition-colors duration-300 pb-1 border-b border-border hover:border-foreground"
          >
            View Drive
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
          </a>
        </header>

        <nav className="sl-tabs border-b border-border">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`relative flex-shrink-0 text-[11px] uppercase tracking-[0.25em] pb-2 transition-all duration-200 ${
                active === key ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
              <span className={`absolute bottom-0 left-0 right-0 h-px bg-foreground transition-transform duration-300 origin-left ${active === key ? "scale-x-100" : "scale-x-0"}`} />
            </button>
          ))}
        </nav>

        <div className="sl-grid grid grid-cols-6">
          {list.map((p, i) => {
            const colSpan = getColSpan(i, list.length)
            const aspect  = getAspect(i, list.length)
            return (
              <Link
                key={p.id}
                href={`/sales-lounge/${p.slug}`}
                className={`sl-card ${colSpan} ${aspect} group relative overflow-hidden bg-muted cursor-pointer`}
              >
                <Image
                  src={p.thumbnail}
                  alt={p.name}
                  fill
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(.25,.46,.45,.94)] group-hover:scale-[1.05]"
                  quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                  <p className="text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-white/50 mb-1 md:mb-1.5 font-light">{p.location}</p>
                  <h2 className="text-white text-xs md:text-sm font-medium uppercase tracking-[0.08em] leading-snug">{p.name}</h2>
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="h-px w-0 group-hover:w-10 bg-white/35 transition-all duration-500 delay-100" />
                </div>
              </Link>
            )
          })}
        </div>

        <div className="flex items-center justify-between px-10 md:px-16 py-8 border-t border-border">
          <p className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground/50">{list.length} Projects</p>
          <a
            href="https://drive.google.com/drive/folders/1lX81Vzuk-VKDSTBaGabCgLsnsLJXRmGq"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.35em] text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            Full Archive
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
          </a>
        </div>

        <Footer />
      </div>

      <style>{`
        .sl-tabs {
          display: flex; align-items: center; gap: 2rem;
          padding: 1.75rem 1.5rem; overflow-x: auto;
          scrollbar-width: none; -ms-overflow-style: none;
          justify-content: center;
        }
        .sl-tabs::-webkit-scrollbar { display: none; }
        @media (max-width: 639px) { .sl-tabs { justify-content: flex-start; gap: 1.5rem; padding: 1.25rem 1rem; } }
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
