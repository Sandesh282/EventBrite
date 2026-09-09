/**
 * components/event-gallery.tsx
 *
 * "use client" — isolated to this component because Framer Motion's
 * whileInView / motion.div require access to the browser's Intersection
 * Observer API, which is unavailable in Node.js / RSC.
 *
 * The parent page is a server component; it passes image URLs and names
 * as plain props so the DB fetch stays server-side.
 */
"use client"

import Image from "next/image"
import { motion } from "framer-motion"

// Repeating layout pattern: position 0 is the hero, then alternating widths
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

interface EventGalleryProps {
  images: string[]
  eventName: string
  categoryName: string
}

export function EventGallery({ images, eventName, categoryName }: EventGalleryProps) {
  return (
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
              alt={`${eventName} — ${categoryName} — view ${idx + 1}`}
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
  )
}
