"use client"

import { ArrowRight } from "lucide-react"
import { Footer } from "@/components/footer"
import { useEffect, useRef, useState } from "react"
import { AppShell } from "@/components/app-shell"
import { ScrollHeader } from "@/components/scroll-header"

const SPECIALIZATIONS = [
  {
    title: "Design",
    description: "Our dedicated Design Team works relentlessly to craft innovative layouts and event structures, ensuring every element is thoughtfully planned.",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop"
  },
  {
    title: "Fabrication",
    description: "Our state-of-the-art fabrication facility brings designs to life with precision and quality.",
    image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800&h=600&fit=crop"
  },
  {
    title: "Execution",
    description: "Seamless execution is our hallmark. Our experienced team manages every aspect of project delivery.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop"
  }
]

export default function AboutPage() {
  const [scrollY, setScrollY] = useState(0)
  const specializationRefs = useRef<(HTMLDivElement | null)[]>([])
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(SPECIALIZATIONS.length).fill(false))

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = specializationRefs.current.indexOf(entry.target as HTMLDivElement)
          if (index !== -1 && entry.isIntersecting) {
            setVisibleItems((prev) => {
              const newState = [...prev]
              newState[index] = true
              return newState
            })
          }
        })
      },
      { threshold: 0.2 }
    )

    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })

    specializationRefs.current.forEach((ref) => ref && observer.observe(ref))
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-black">
      <ScrollHeader alwaysVisible />
      
      {/* Hero Section with Video Background */}
      <section className="relative h-[100dvh] w-full">
        <AppShell videoSrc="/intro.mp4" skipIntro={true} />
        
        {/* Hero Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 z-10">
          <div className="text-center space-y-4 sm:space-y-6 max-w-4xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-white leading-tight drop-shadow-2xl">
              Who <span className="text-amber-500">We Are</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto px-4 drop-shadow-xl">
              Driven by passion, defined by purpose — building trust and delivering excellence every step of the way.
            </p>
            <a href="/contact" className="group inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-500 transition-all duration-300 text-sm sm:text-base shadow-2xl">
              WORK WITH US
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>
      
      {/* Main Content Sections - Flowing after the Hero */}
      <main className="relative bg-neutral-50">
        <section className="relative w-full py-32 px-6 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 to-amber-600/20 blur-2xl"></div>
                <img src="/images/about.webp" alt="Eventbrite office spaces" className="relative w-full h-auto rounded-2xl shadow-2xl" />
              </div>

              <div className="space-y-8">
                <div>
                  <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">Who We Are</span>
                  <h2 className="text-5xl md:text-6xl font-bold text-neutral-900 mt-4 leading-tight">
                    About Eventbrite
                  </h2>
                </div>
                <div className="space-y-6 text-neutral-600 text-lg leading-relaxed">
                  <p>
                    For over a decade, Eventbrite has been at the forefront of India's real estate marketing industry. Starting as a turnkey exhibition contractor, we have grown into a trusted design-build partner, shaping landmark experiences for leading developers.
                  </p>
                  <p>
                    Based in Mumbai, we operate a 35,000 sq. ft. fabrication facility with over 200 skilled professionals, ensuring flawless execution from concept to completion.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="relative w-full bg-white py-32 px-6 md:px-12 lg:px-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-4">Vision & Mission</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-12 rounded-3xl bg-neutral-50 border border-neutral-200 shadow-sm">
                <h3 className="text-3xl font-bold text-neutral-900 mb-6">Vision</h3>
                <p className="text-neutral-600 text-lg">To redefine how India buys homes by building a ₹1000 crore enterprise that creates premium, sustainable spaces.</p>
              </div>
              <div className="p-12 rounded-3xl bg-neutral-50 border border-neutral-200 shadow-sm">
                <h3 className="text-3xl font-bold text-neutral-900 mb-6">Mission</h3>
                <p className="text-neutral-600 text-lg">To deliver innovative and cost-effective project experiences that engage audiences and accelerate conversions.</p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  )
}
