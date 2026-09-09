"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Users } from "lucide-react"

const TEAM = [
  { name: "Oliver Grant", role: "Account Manager", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
  { name: "Mason Blake", role: "Creative Director", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80" },
  { name: "Liam Carter", role: "Project Lead", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80" },
  { name: "Noah Bennett", role: "Design Head", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80" }
]

export function TeamSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  const calculateScrollProgress = useCallback(() => {
    if (!containerRef.current) return
    const { top } = containerRef.current.getBoundingClientRect()
    const progress = (window.innerHeight - top) / window.innerHeight
    setScrollProgress(Math.max(0, Math.min(progress, 1)))
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", calculateScrollProgress, { passive: true })
    calculateScrollProgress()
    return () => window.removeEventListener("scroll", calculateScrollProgress)
  }, [calculateScrollProgress])

  return (
    <section ref={containerRef} className="relative w-full bg-muted/20 py-24 px-6 md:px-12 lg:px-20 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div 
          className="text-center mb-16 space-y-4"
          style={{
            opacity: Math.min(scrollProgress * 2, 1),
            transform: `translateY(${Math.max(0, 30 - scrollProgress * 60)}px)`
          }}
        >
          <h2 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">
            Meet Our Team
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Visionaries, planners, and creators who turn ideas into unforgettable experiences
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map((member, index) => (
            <div
              key={index}
              className="group relative"
              style={{
                opacity: Math.min((scrollProgress - index * 0.05) * 2, 1),
                transform: `translateY(${Math.max(0, 30 - (scrollProgress - index * 0.05) * 60)}px)`
              }}
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-neutral-900/20 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-sm text-neutral-300 uppercase tracking-wider">{member.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
