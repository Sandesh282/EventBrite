"use client"

import { ArrowRight } from "lucide-react"

export function HeroInfo() {
  return (
    <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-8 md:px-10 lg:px-12">
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-end md:justify-between">
        {/* View Project CTA */}
        <a
          href="/sales-lounge"
          className="flex w-fit items-center gap-2 rounded-full border border-foreground/40 px-5 py-2.5 text-xs font-medium uppercase tracking-widest text-foreground transition-all duration-300 hover:border-foreground hover:bg-foreground/10"
        >
          <span>View Project</span>
          <ArrowRight size={14} aria-hidden="true" />
        </a>
      </div>
    </div>
  )
}
