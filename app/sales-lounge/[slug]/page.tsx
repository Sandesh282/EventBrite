"use client"

import { notFound } from "next/navigation"
import { use } from "react"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { ScrollHeader } from "@/components/scroll-header"
import { PROJECTS } from "@/lib/projects"
import Image from "next/image"
import { motion } from "framer-motion"
import { JsonLd } from "@/components/json-ld"

/**
 * Layout pattern using col-span + row-span ONLY.
 * grid-auto-rows: 380px → all cells are exact multiples of 380px.
 * No aspect-ratio, so mixed-width items in the same row are always the same height.
 * 
 * Pattern (9 slots, repeats):
 *   row 1-2 : [col-span-6, row-span-2]          full-width tall (760px)
 *   row 3   : [col-span-4] + [col-span-2]        2/3 + 1/3 (380px each)
 *   row 4   : [col-span-2] + [col-span-2] + [col-span-2]   three equal (380px)
 *   row 5   : [col-span-2] + [col-span-4]        1/3 + 2/3 (380px each)
 *   row 6-7 : [col-span-6, row-span-2]          full-width tall (760px)
 * 
 * For 15 images:
 *   items 0-8  → rows 1-7  (fills 7 rows perfectly)
 *   items 9-14 → pattern positions 0-5
 *     item 9  : col-6 row-2 (rows 8-9)
 *     item 10 : col-4 (row 10)   \
 *     item 11 : col-2 (row 10)   / fills row 10
 *     item 12 : col-2 (row 11) \
 *     item 13 : col-2 (row 11)  > fills row 11
 *     item 14 : col-2 (row 11) /
 * Zero empty space.
 */
const LAYOUT: { col: string; row: string }[] = [
  { col: "col-span-6", row: "row-span-2" }, // 0 — full-width tall
  { col: "col-span-4", row: "row-span-1" }, // 1 — 2/3
  { col: "col-span-2", row: "row-span-1" }, // 2 — 1/3
  { col: "col-span-2", row: "row-span-1" }, // 3 — 1/3
  { col: "col-span-2", row: "row-span-1" }, // 4 — 1/3
  { col: "col-span-2", row: "row-span-1" }, // 5 — 1/3
  { col: "col-span-2", row: "row-span-1" }, // 6 — 1/3
  { col: "col-span-4", row: "row-span-1" }, // 7 — 2/3
  { col: "col-span-6", row: "row-span-2" }, // 8 — full-width tall
]

function getLayout(index: number) {
  return LAYOUT[index % LAYOUT.length]
}

export default function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const project = PROJECTS.find(p => p.slug === slug)
  if (!project) notFound()

  const { images } = project
  const catLabel = project.category.charAt(0) + project.category.slice(1).toLowerCase()

  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.name,
    "description": project.brief,
    "image": project.thumbnail,
    "locationCreated": {
      "@type": "Place",
      "name": project.location
    },
    "creator": {
      "@type": "Organization",
      "name": "EventBrite"
    }
  }

  return (
    <>
      <JsonLd schema={projectSchema} />
      <ScrollHeader alwaysVisible />
      <div className="min-h-screen bg-white">

        {/* Breadcrumb */}
        <div className="pt-24 pb-0 px-10 md:px-16">
          <nav className="flex items-center gap-2 text-[9px] uppercase tracking-[0.35em] text-neutral-400">
            <Link href="/" className="hover:text-neutral-700 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/sales-lounge" className="hover:text-neutral-700 transition-colors">Sales Lounge</Link>
            <span>/</span>
            <span className="text-neutral-700">{project.name}</span>
          </nav>
        </div>

        {/* Project header */}
        <header className="px-10 md:px-16 pt-8 pb-12 border-b border-neutral-100">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-neutral-400 mb-4">{catLabel}</p>
              <h1 className="text-[clamp(3rem,8vw,7rem)] font-light text-neutral-900 leading-none tracking-[-0.02em]">
                {project.name}
              </h1>
              <p className="mt-4 text-neutral-400 text-lg font-light tracking-wider">{project.location}</p>
            </div>
            <div className="flex gap-12 lg:gap-20 pb-1">
              {[["Year", project.year], ["Area", project.area], ["Category", catLabel]].map(([label, val]) => (
                <div key={label}>
                  <p className="text-xs uppercase tracking-[0.4em] text-neutral-300 mb-2">{label}</p>
                  <p className="text-base md:text-lg text-neutral-700 font-light">{val}</p>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* ── Gallery ──────────────────────────────────────────────────────────
            Uses grid-auto-rows (fixed px) + col/row spans.
            Every cell is an exact rectangle — zero empty space, no aspect-ratio fights.
        */}
        <div className="proj-gallery grid grid-cols-6">
          {images.map((src, i) => {
            const { col, row } = getLayout(i)
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={`proj-card ${col} ${row} relative overflow-hidden bg-neutral-200`}
              >
                {/* Shimmer always underneath — visible while image pixels haven't painted */}
                <div className="absolute inset-0 shimmer-bg" />
                <Image
                  src={src}
                  alt={`${project.name} Sales Lounge — ${project.location} — view ${i + 1}`}
                  width={1200}
                  height={800}
                  className="img-fade absolute inset-0 w-full h-full object-cover hover:scale-[1.03] transition-transform duration-700 ease-out"
                  loading={i < 4 ? "eager" : "lazy"}
                  quality={95}
                />
              </motion.div>
            )
          })}
        </div>

        {/* Case Study Text */}
        <article className="max-w-5xl mx-auto px-8 md:px-16 py-24">
          <section className="mb-20">
            <p className="text-[9px] uppercase tracking-[0.5em] text-neutral-300 mb-6">The Brief</p>
            <p className="text-2xl md:text-3xl lg:text-4xl font-light text-neutral-700 leading-[1.5]">{project.brief}</p>
          </section>
          <hr className="border-neutral-100 mb-20" />
          <section className="mb-20">
            <p className="text-[9px] uppercase tracking-[0.5em] text-neutral-300 mb-6">Our Approach</p>
            <h2 className="text-3xl md:text-4xl font-light text-neutral-900 leading-snug mb-8">Crafted with precision, built to convert.</h2>
            <p className="text-lg md:text-xl lg:text-2xl text-neutral-500 leading-[1.8] font-light">{project.approach}</p>
          </section>
          <hr className="border-neutral-100 mb-20" />
          <section className="mb-20">
            <p className="text-[9px] uppercase tracking-[0.5em] text-neutral-300 mb-6">The Outcome</p>
            <p className="text-2xl md:text-3xl lg:text-4xl font-light text-neutral-700 leading-[1.5]">{project.outcome}</p>
          </section>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-6 border-t border-neutral-100">
            <p className="text-[9px] uppercase tracking-[0.4em] text-neutral-400">Ready to transform your sales experience?</p>
            <Link href="/contact" className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.35em] text-neutral-900 border-b border-neutral-900 pb-0.5 hover:text-neutral-500 hover:border-neutral-500 transition-colors duration-300">
              Get In Touch
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
            </Link>
          </div>
        </article>

        {/* More Projects */}
        <section className="border-t border-neutral-100 px-10 md:px-16 py-12">
          <p className="text-[9px] uppercase tracking-[0.5em] text-neutral-300 mb-8">More Projects</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {PROJECTS.filter(p => p.slug !== slug).slice(0, 4).map(p => (
              <Link key={p.id} href={`/sales-lounge/${p.slug}`} className="group relative aspect-[4/3] overflow-hidden bg-neutral-100">
                <Image 
                  src={p.thumbnail} 
                  alt={p.name} 
                  fill
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" 
                  loading="lazy"
                  quality={85}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-[8px] uppercase tracking-[0.35em] text-white/50 mb-1">{p.location}</p>
                  <p className="text-white text-xs font-medium uppercase tracking-wide">{p.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <Footer />
      </div>

      <style>{`
        /* Fixed row height — all cells same height, no aspect-ratio conflicts */
        .proj-gallery {
          grid-auto-rows: 380px;
        }

        /*
          CSS fade-in on the img element itself.
          @starting-style would be ideal but support is limited,
          so we use animation: the image is invisible for 0s then fades in.
          This means the shimmer shows until the browser paints pixels,
          at which point the img animates over it.
        */
        .img-fade {
          opacity: 0;
          animation: imgReveal 0.001s linear forwards;
        }
        /* Fires once pixels are painted (natural browser behaviour) */
        @keyframes imgReveal {
          to { opacity: 1; }
        }

        /* Shimmer animation */
        @keyframes shimmer {
          0%   { background-position: -400% 0; }
          100% { background-position:  400% 0; }
        }
        .shimmer-bg {
          background: linear-gradient(90deg, #e0e0e0 25%, #efefef 50%, #e0e0e0 75%);
          background-size: 400% 100%;
          animation: shimmer 1.4s ease-in-out infinite;
        }

        /* Mobile: 1 column, fixed height per card */
        @media (max-width: 479px) {
          .proj-gallery { grid-template-columns: 1fr !important; grid-auto-rows: 260px !important; }
          .proj-card { grid-column: span 1 !important; grid-row: span 1 !important; }
        }
        /* Tablet: 2 columns */
        @media (min-width: 480px) and (max-width: 1023px) {
          .proj-gallery { grid-template-columns: repeat(2, 1fr) !important; grid-auto-rows: 300px !important; }
          .proj-card { grid-column: span 1 !important; grid-row: span 1 !important; }
        }
      `}</style>
    </>
  )
}
