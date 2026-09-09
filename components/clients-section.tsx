"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { ArrowRight } from "lucide-react"

const CLIENTS = [
  { id: 11, logo: `/clients/client-11.webp` },
  { id: 8, logo: `/clients/client-8.webp` },
  { id: 9, logo: `/clients/client-9.webp` },
  { id: 6, logo: `/clients/client-6.webp` },
  { id: 3, logo: `/clients/client-3.webp` },
  { id: 2, logo: `/clients/client-2.webp` }
]

export function ClientsSection() {
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
    <section ref={containerRef} className="relative w-full bg-muted/20 py-24 px-6 overflow-hidden">
      
      <div className="max-w-7xl mx-auto relative">
        <div 
          className="text-center mb-16 space-y-4"
          style={{
            opacity: Math.min(scrollProgress * 2, 1),
            transform: `translateY(${Math.max(0, 20 - scrollProgress * 40)}px)`
          }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Trusted by Industry Leaders
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Partnering with India's most prestigious real estate brands
          </p>
        </div>

        <div className="relative">
          <div className="flex gap-8 animate-scroll">
            {[...CLIENTS, ...CLIENTS, ...CLIENTS].map((client, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-56 h-40 flex items-center justify-center bg-card rounded-xl p-4 border border-border hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300"
                style={{
                  opacity: Math.min(scrollProgress * 2, 1)
                }}
              >
                <img
                  src={client.logo}
                  alt={`Client ${client.id}`}
                  className={`object-contain transition-all duration-300 ${client.id === 11 ? "w-full h-full scale-150" : "max-w-full max-h-full"} dark:brightness-90 dark:invert-[0.1]`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <a href="/clients" className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white rounded-full font-semibold hover:shadow-xl hover:shadow-neutral-900/30 transition-all duration-300">
            SEE ALL CLIENTS
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
        @media (max-width: 768px) {
          .animate-scroll {
            animation-duration: 15s;
          }
        }
      `}</style>
    </section>
  )
}
