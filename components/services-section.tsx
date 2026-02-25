"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { ArrowRight } from "lucide-react"

const SERVICES = [
  {
    id: 1,
    title: "Experience Centre",
    description: "Immersive spaces that bring your brand story to life through innovative design and technology.",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
    gradient: "from-blue-500/10 to-cyan-500/10"
  },
  {
    id: 2,
    title: "Marketing Office",
    description: "Strategic spaces designed to showcase your projects with impact and drive sales success.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80",
    gradient: "from-purple-500/10 to-pink-500/10"
  },
  {
    id: 3,
    title: "Project Office",
    description: "Professional workspaces that enhance productivity and collaboration.",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80",
    gradient: "from-green-500/10 to-emerald-500/10"
  },
  {
    id: 4,
    title: "Show Apartment",
    description: "Stunning model homes that inspire buyers through meticulous design.",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
    gradient: "from-orange-500/10 to-red-500/10"
  },
  {
    id: 5,
    title: "Sample-Up Apartment",
    description: "Detailed sample spaces demonstrating quality and craftsmanship.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    gradient: "from-indigo-500/10 to-blue-500/10"
  }
]

export function ServicesSection() {
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
    <section ref={containerRef} className="relative w-full bg-background py-32 px-6 md:px-12 lg:px-20 overflow-hidden">
      
      <div className="max-w-7xl mx-auto relative">
        <div 
          className="text-center mb-20 space-y-4"
          style={{
            opacity: Math.min(scrollProgress * 2, 1),
            transform: `translateY(${Math.max(0, 30 - scrollProgress * 60)}px)`
          }}
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight">
            Our <span className="text-amber-600">Expertise</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive solutions for real estate marketing excellence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, index) => (
            <div
              key={service.id}
              className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
              style={{
                opacity: Math.min((scrollProgress - index * 0.05) * 2, 1),
                transform: `translateY(${Math.max(0, 50 - (scrollProgress - index * 0.05) * 100)}px)`
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={service.image}
                  alt={`EventBrite ${service.title} Design & Execution India`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-neutral-900/30 to-transparent" />
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-neutral-900 font-bold shadow-lg">
                  {service.id}
                </div>
              </div>

              <div className="relative p-6 space-y-4">
                <h3 className="text-2xl font-bold text-foreground">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
                <button className="group/btn inline-flex items-center gap-2 text-foreground font-semibold hover:gap-3 transition-all">
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div 
          className="text-center mt-16"
          style={{
            opacity: Math.min((scrollProgress - 0.4) * 2, 1),
            transform: `translateY(${Math.max(0, 30 - (scrollProgress - 0.4) * 60)}px)`
          }}
        >
          <a href="/expertise" className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white rounded-full font-semibold hover:shadow-xl hover:shadow-neutral-900/30 transition-all duration-300">
            VIEW ALL SERVICES
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  )
}
