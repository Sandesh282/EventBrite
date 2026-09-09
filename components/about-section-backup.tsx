"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight } from "lucide-react"

const STATS = [
  { value: "10+", label: "Years Experience" },
  { value: "200+", label: "Professionals" },
  { value: "35K", label: "Sq. Ft. Facility" },
  { value: "100+", label: "Projects" }
]

export function AboutSectionBackup() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const offset = Math.max(0, Math.min(window.innerHeight - rect.top, 400))
        setScrollY(offset)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section ref={containerRef} className="relative w-full min-h-screen bg-neutral-100 py-32 px-6 md:px-12 lg:px-20 overflow-hidden">
      
      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Image */}
          <div 
            className="relative order-2 lg:order-1"
            style={{ transform: `translateY(${scrollY * 0.05}px)` }}
          >
            <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-blue-500/10">
              <img
                src="/images/eb-1.webp"
                alt="Eventbrite office interior"
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/20 to-transparent" />
            </div>
          </div>

          {/* Content */}
          <div 
            className="space-y-8 order-1 lg:order-2"
            style={{ transform: `translateY(${-scrollY * 0.03}px)` }}
          >
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight text-neutral-900">
                About Eventbrite
              </h2>
            </div>

            <div className="space-y-6 text-neutral-600 leading-relaxed max-w-xl">
              <p className="text-lg">
                For over a decade, <span className="text-neutral-900 font-semibold">Eventbrite</span> has been at the forefront of India's 
                real estate marketing industry. Starting as a turnkey exhibition 
                contractor, we have grown into a trusted design-build partner.
              </p>
              
              <p className="text-lg">
                Based in Mumbai, we operate a <span className="text-neutral-900 font-semibold">35,000 sq. ft. facility</span> 
                with over 200 skilled professionals, ensuring flawless execution 
                from concept to completion.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              {STATS.map((stat, i) => (
                <div 
                  key={i} 
                  className="group p-6 rounded-xl bg-white border border-neutral-200 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300"
                >
                  <p className="text-4xl md:text-5xl font-bold text-neutral-900 mb-2">{stat.value}</p>
                  <p className="text-xs text-neutral-600 uppercase tracking-wider font-medium">{stat.label}</p>
                </div>
              ))}
            </div>

            <a 
              href="/about" 
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white rounded-full font-semibold hover:shadow-xl hover:shadow-neutral-900/30 transition-all duration-300"
            >
              LEARN MORE
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
