"use client"

import { useEffect, useRef, useState } from "react"

/**
 * ParallaxSection - Two messages reveal word-by-word with parallax on a single scrolling page
 */
export function ParallaxSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      if (rect.top < windowHeight && rect.bottom > 0) {
        const progress = Math.max(0, Math.min((windowHeight - rect.top) / windowHeight, 1))
        setScrollProgress(progress)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const getWordStyle = (startPoint: number, speed: number) => {
    const opacity = Math.max(0.3, Math.min((scrollProgress - startPoint) * 4, 1))
    const offset = (scrollProgress - startPoint) * speed * 20
    return {
      opacity,
      transform: `translateY(-${offset}px)`,
    }
  }

  const sectionOpacity = Math.min(scrollProgress * 2, 1)

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-amber-50 transition-opacity duration-700"
      style={{ opacity: sectionOpacity }}
    >
      {/* First Message - WE DESIGN BESPOKE SOLUTIONS FOR ARCHITECTURE AND INTERIOR DESIGN */}
      <div className="min-h-screen flex items-center justify-center px-8 md:px-12 lg:px-16">
        <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-black text-center leading-snug tracking-tight max-w-6xl">
          <span
            className="inline-block transition-all duration-300 mr-6 mb-4"
            style={getWordStyle(0.0, 0.25)}
          >
            WE
          </span>
          <span
            className="inline-block transition-all duration-300 mr-6 mb-4"
            style={getWordStyle(0.1, 0.28)}
          >
            DESIGN
          </span>
          <span
            className="inline-block transition-all duration-300 mr-6 mb-4"
            style={getWordStyle(0.2, 0.22)}
          >
            BESPOKE
          </span>
          <span
            className="inline-block transition-all duration-300 mr-6 mb-4"
            style={getWordStyle(0.3, 0.3)}
          >
            SOLUTIONS
          </span>
          <br />
          <span
            className="inline-block transition-all duration-300 mr-6 mb-4"
            style={getWordStyle(0.4, 0.25)}
          >
            FOR
          </span>
          <span
            className="inline-block transition-all duration-300 mr-6 mb-4"
            style={getWordStyle(0.5, 0.28)}
          >
            ARCHITECTURE
          </span>
          <span
            className="inline-block transition-all duration-300 mr-6 mb-4"
            style={getWordStyle(0.6, 0.2)}
          >
            AND
          </span>
          <span
            className="inline-block transition-all duration-300 mr-6 mb-4"
            style={getWordStyle(0.7, 0.3)}
          >
            INTERIOR
          </span>
          <span
            className="inline-block transition-all duration-300"
            style={getWordStyle(0.8, 0.25)}
          >
            DESIGN
          </span>
        </h1>
      </div>
    </section>
  )
}
