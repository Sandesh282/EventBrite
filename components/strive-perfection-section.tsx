"use client"

import { useEffect, useRef, useState } from "react"

export function StrivePerfectionSection() {
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
      className="relative w-full h-[100dvh] bg-background overflow-hidden flex items-center justify-center"
      style={{ opacity: sectionOpacity }}
    >
      <div className="px-8 md:px-12 lg:px-16 text-center max-w-6xl">
        <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-foreground text-center leading-snug tracking-tight">
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
            STRIVE
          </span>
          <span
            className="inline-block transition-all duration-300 mr-6 mb-4"
            style={getWordStyle(0.2, 0.22)}
          >
            FOR
          </span>
          <span
            className="inline-block transition-all duration-300 mr-6 mb-4"
            style={getWordStyle(0.3, 0.3)}
          >
            PERFECTION
          </span>
          <br />
          <span
            className="inline-block transition-all duration-300 mr-6 mb-4"
            style={getWordStyle(0.4, 0.25)}
          >
            IN
          </span>
          <span
            className="inline-block transition-all duration-300 mr-6 mb-4"
            style={getWordStyle(0.5, 0.28)}
          >
            EVERY
          </span>
          <span
            className="inline-block transition-all duration-300"
            style={getWordStyle(0.6, 0.2)}
          >
            DETAIL
          </span>
        </h2>
      </div>
    </section>
  )
}
