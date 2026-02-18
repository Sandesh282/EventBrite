"use client"

import { useEffect } from "react"

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Reset scroll position on mount
    window.scrollTo(0, 0)
    
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = "smooth"
    
    // Optimize scroll performance
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          ticking = false
        })
        ticking = true
      }
    }
    
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return <>{children}</>
}
