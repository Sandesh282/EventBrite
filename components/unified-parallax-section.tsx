"use client"

import { useEffect, useRef, useState } from "react"

export function UnifiedParallaxSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  const clamp = (value: number, min = 0, max = 1) =>
    Math.min(max, Math.max(min, value))

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // When the section is not visible at all, pin progress to 0 or 1
      if (rect.bottom <= 0) {
        // Scrolled completely past
        setScrollProgress(1)
        return
      }
      if (rect.top >= windowHeight) {
        // Haven't reached the text page yet
        setScrollProgress(0)
        return
      }

      // While the section is intersecting the viewport, map its top position
      // from bottom-of-viewport (progress 0) to top-of-viewport (progress 1).
      const rawProgress = (windowHeight - rect.top) / windowHeight
      setScrollProgress(clamp(rawProgress))
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // First line word style: reveal words one by one as we scroll on
  // the text page, with a slower, smoother fade + slight slide-up.
  const getWordStyle = (order: number) => {
    const progress = clamp(scrollProgress)

    // Spread words across most of the mid-scroll range so the full
    // sentence completes comfortably before any cross-fade.
    const appearStart = 0.12 + order * 0.08
    const appearEnd = appearStart + 0.3

    let opacity = 0
    if (progress <= appearStart) {
      opacity = 0
    } else if (progress >= appearEnd) {
      opacity = 1
    } else {
      const linear = (progress - appearStart) / (appearEnd - appearStart)
      // Ease-out for a softer feel
      opacity = 1 - (1 - linear) * (1 - linear)
    }

    const translateFrom = 20
    const translateY = (1 - clamp(opacity)) * translateFrom

    return {
      opacity: clamp(opacity),
      transform: `translateY(${translateY}px)`,
    }
  }

  // First message opacity:
  // - Smooth fade IN from 0 → 1
  // - HOLD at 1
  // - Smooth fade OUT from 1 → 0
  const firstMessageOpacity = clamp(
    scrollProgress < 0.1
      ? 0
      : scrollProgress < 0.35
        ? (scrollProgress - 0.1) / 0.25 // slower 0 → 1 fade in
        : scrollProgress < 0.8
          ? 1 // hold fully visible
          : scrollProgress < 0.9
            ? 1 - (scrollProgress - 0.8) / 0.1 // 1 → 0 fade out
            : 0,
  )

  // Second message wrapper opacity:
  // - Wait until the first line is fully gone
  // - Then leave a short blank gap (both invisible)
  // - Then smoothly fade IN to full opacity
  const secondProgress = clamp(scrollProgress)
  const secondMessageOpacity = clamp(
    secondProgress < 0.94
      ? 0 // both lines invisible (blank screen period)
      : secondProgress < 1
        ? (secondProgress - 0.94) / 0.06 // smooth 0 → 1 fade in
        : 1,
  )

  // Keep section fully opaque while in view; we're driving the feel
  // via the text/word animations instead.
  const sectionOpacity = 1

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen bg-background transition-opacity duration-700 flex items-center justify-center overflow-hidden"
      style={{ opacity: sectionOpacity }}
    >
      <div className="absolute inset-0 flex items-center justify-center px-8 md:px-12 lg:px-16">
        {/* First Message - WE DESIGN BESPOKE SOLUTIONS FOR ARCHITECTURE AND INTERIOR DESIGN */}
        <div
          className="text-center max-w-6xl transition-opacity mx-auto px-6 py-8 md:px-10 md:py-10"
          style={{ opacity: firstMessageOpacity }}
        >
          <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-foreground leading-snug tracking-tight">
            <span
              className="inline-block transition-all duration-300 mr-6 mb-4"
              style={getWordStyle(0)}
            >
              WE
            </span>
            <span
              className="inline-block transition-all duration-300 mr-6 mb-4"
              style={getWordStyle(1)}
            >
              DESIGN
            </span>
            <span
              className="inline-block transition-all duration-300 mr-6 mb-4"
              style={getWordStyle(2)}
            >
              BESPOKE
            </span>
            <span
              className="inline-block transition-all duration-300 mr-6 mb-4"
              style={getWordStyle(3)}
            >
              SOLUTIONS
            </span>
            <br />
            <span
              className="inline-block transition-all duration-300 mr-6 mb-4"
              style={getWordStyle(4)}
            >
              FOR
            </span>
            <span
              className="inline-block transition-all duration-300 mr-6 mb-4"
              style={getWordStyle(5)}
            >
              ARCHITECTURE
            </span>
            <span
              className="inline-block transition-all duration-300 mr-6 mb-4"
              style={getWordStyle(6)}
            >
              AND
            </span>
            <span
              className="inline-block transition-all duration-300 mr-6 mb-4"
              style={getWordStyle(7)}
            >
              INTERIOR
            </span>
            <span
              className="inline-block transition-all duration-300"
              style={getWordStyle(8)}
            >
              DESIGN
            </span>
          </h1>
        </div>

        {/* Second Message - WE STRIVE FOR PERFECTION IN EVERY DETAIL */}
        <div
          className="text-center max-w-6xl transition-opacity absolute mx-auto px-6 py-8 md:px-10 md:py-10"
          style={{ opacity: secondMessageOpacity }}
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-foreground leading-snug tracking-tight">
            <span
              className="inline-block transition-all duration-300 mr-6 mb-4"
              style={getWordStyle(0)}
            >
              WE
            </span>
            <span
              className="inline-block transition-all duration-300 mr-6 mb-4"
              style={getWordStyle(1)}
            >
              STRIVE
            </span>
            <span
              className="inline-block transition-all duration-300 mr-6 mb-4"
              style={getWordStyle(2)}
            >
              FOR
            </span>
            <span
              className="inline-block transition-all duration-300 mr-6 mb-4"
              style={getWordStyle(3)}
            >
              PERFECTION
            </span>
            <br />
            <span
              className="inline-block transition-all duration-300 mr-6 mb-4"
              style={getWordStyle(4)}
            >
              IN
            </span>
            <span
              className="inline-block transition-all duration-300 mr-6 mb-4"
              style={getWordStyle(5)}
            >
              EVERY
            </span>
            <span
              className="inline-block transition-all duration-300"
              style={getWordStyle(6)}
            >
              DETAIL
            </span>
          </h2>
        </div>
      </div>
    </section>
  )
}
