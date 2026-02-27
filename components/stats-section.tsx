"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Award, Users, Briefcase, Trophy } from "lucide-react"

const STATS = [
  { icon: Briefcase, value: "25", label: "Years of Experience" },
  { icon: Trophy, value: "200", label: "Projects Completed" },
  { icon: Users, value: "88", label: "Expert Employees" },
  { icon: Award, value: "40", label: "Prestigious Awards" }
]

export function StatsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [counts, setCounts] = useState(STATS.map(() => 0))

  const calculateScrollProgress = useCallback(() => {
    if (!containerRef.current) return
    const { top, height } = containerRef.current.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const progress = (windowHeight - top) / (windowHeight + height)
    setScrollProgress(Math.max(0, Math.min(progress, 1)))
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", calculateScrollProgress, { passive: true })
    calculateScrollProgress()
    return () => window.removeEventListener("scroll", calculateScrollProgress)
  }, [calculateScrollProgress])

  // Animate counters when in view
  useEffect(() => {
    if (scrollProgress > 0.3) {
      STATS.forEach((stat, index) => {
        const target = parseInt(stat.value)
        const duration = 2000
        const steps = 60
        const increment = target / steps
        let current = 0

        const timer = setInterval(() => {
          current += increment
          if (current >= target) {
            setCounts(prev => {
              const newCounts = [...prev]
              newCounts[index] = target
              return newCounts
            })
            clearInterval(timer)
          } else {
            setCounts(prev => {
              const newCounts = [...prev]
              newCounts[index] = Math.floor(current)
              return newCounts
            })
          }
        }, duration / steps)

        return () => clearInterval(timer)
      })
    }
  }, [scrollProgress])

  const getParallaxOffset = useCallback((speed: number) => {
    return scrollProgress * speed * 100
  }, [scrollProgress])

  return (
    <section ref={containerRef} className="relative w-full h-[100dvh] bg-background overflow-hidden">
      {/* Hero Image with Parallax */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 will-change-transform"
          style={{
            transform: `translateY(${getParallaxOffset(0.5)}px) scale(${1 + scrollProgress * 0.1})`
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
            alt="Modern office building"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />
        
        {/* Stats Overlay with Individual Parallax */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-7xl w-full px-6 md:px-12 lg:px-20">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {STATS.map((stat, index) => {
                const Icon = stat.icon
                const parallaxSpeed = 0.3 + index * 0.1
                return (
                  <div
                    key={index}
                    className="text-center group"
                    style={{
                      opacity: Math.min(scrollProgress * 2, 1),
                      transform: `translateY(${Math.max(0, 50 - getParallaxOffset(parallaxSpeed))}px)`,
                      transitionDelay: `${index * 100}ms`
                    }}
                  >
                    <div className="flex flex-col items-center space-y-4">
                      <div 
                        className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 group-hover:bg-amber-500/20 group-hover:border-amber-500/50 transition-all duration-500 group-hover:scale-110"
                        style={{
                          transform: `translateY(${-getParallaxOffset(0.2)}px)`
                        }}
                      >
                        <Icon className="w-8 h-8 md:w-10 md:h-10 text-amber-400" />
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-5xl md:text-6xl lg:text-7xl font-bold text-white">
                          {counts[index]}
                          {stat.value.includes("+") && "+"}
                        </p>
                        <div 
                          className="h-1 w-16 mx-auto bg-gradient-to-r from-transparent via-amber-500 to-transparent"
                          style={{
                            transform: `scaleX(${scrollProgress})`,
                            transition: 'transform 0.8s ease-out'
                          }}
                        />
                        <p className="text-sm md:text-base text-white/80 font-medium uppercase tracking-wider">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade with parallax */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"
        style={{
          transform: `translateY(${-getParallaxOffset(0.3)}px)`
        }}
      />
    </section>
  )
}
